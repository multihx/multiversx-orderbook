package main

import (
	"engine/api"
	"engine/conf"
	"engine/launcher"
	"engine/market"
	"engine/notifier"
	"io/ioutil"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	_ "engine/util/logger"

	log "github.com/sirupsen/logrus"
)

func initConf() {
	conf.LoadConfig()
}

func initNotifier() {
	marketAddressList := make([]string, 0)
	for _, v := range conf.EngineConfig.Market {
		marketAddressList = append(marketAddressList, v.ExchangeAddress)
	}
	notifier := notifier.NewEventNotifier(marketAddressList, conf.EngineConfig.EventNotifier.Connection, conf.EngineConfig.EventNotifier.EventID)
	notifier.Start()
}

func initLauncher() {
	var gateway string
	var explorer string
	gateway = conf.EngineConfig.Launcher.GateWay
	explorer = conf.EngineConfig.Launcher.Explorer

	filePath := conf.EngineConfig.Launcher.WalletPem
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Error(err)
		return
	}
	l := launcher.NewLaunch(gateway, content, explorer)
	l.Start()
}

func initEngine() {
	engine := market.NewEngine()
	engine.LoadMarket()
	engine.Start()
}

func main() {
	initConf()
	initNotifier()
	initLauncher()
	initEngine()

	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	e.POST("/api/orderbook", api.OrderBook)
	e.POST("/api/openOrder", api.OpenOrder)

	listenPort := ":8080"
	log.Infof("start listen %v", listenPort)
	err := e.Start(listenPort)
	if err != nil {
		panic(err)
	}
}
