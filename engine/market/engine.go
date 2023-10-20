package market

import (
	"context"
	"encoding/json"
	"engine/common"
	"engine/conf"
	"time"

	util "engine/util/redis"

	"github.com/go-redis/redis/v8"
	log "github.com/sirupsen/logrus"
)

var Engine *engine

type engine struct {
	markets map[string]*Market
	rdb     *redis.Client
}

func NewEngine() *engine {
	Engine = new(engine)
	Engine.rdb = util.NewRedis("127.0.0.1:6379")
	return Engine
}

func (e *engine) LoadMarket() {
	e.markets = make(map[string]*Market)
	for _, marketCfg := range conf.EngineConfig.Market {
		market := NewMarket(marketCfg)
		e.markets[marketCfg.ExchangeAddress] = market
	}
}

func (e *engine) Start() {
	for _, market := range e.markets {
		go market.run()
	}

	go e.drainMsg()
}

func (e *engine) drainMsg() {
	ticker := time.NewTicker(200 * time.Millisecond)

	for {
		select {
		case <-ticker.C:
			// log.Infof("engine drainMsg")
			key := "engine"
			value, err := e.rdb.BRPop(context.Background(), 1*time.Second, key).Result()
			if err == redis.Nil {
				continue
			}
			if err != nil {
				continue
			}

			engineEvent := parseRedisMsg(value[1])
			if engineEvent != nil {
				e.handleEngineEvent(engineEvent)
			}
		}
	}
}

func parseRedisMsg(data string) *common.EngineEvent {
	log.Info("parseRedisMsg ", data)
	var engineEvent common.EngineEvent
	err := json.Unmarshal([]byte(data), &engineEvent)
	if err != nil {
		log.Error(err)
		return nil
	}

	return &engineEvent
}

func (e *engine) handleEngineEvent(engineEvent *common.EngineEvent) {
	if engineEvent.EventID == common.NEW_BUY_ORDER || engineEvent.EventID == common.NEW_SELL_ORDER {
		newOrder := new(common.LimitOrder)
		json.Unmarshal([]byte(engineEvent.Data), newOrder)
		e.pushMarketOrder(newOrder)
	} else if engineEvent.EventID == common.ORDER_MATCH {

	}
}

func (e *engine) pushMarketOrder(order *common.LimitOrder) {
	m := e.markets[order.ContractAddress]
	if m == nil {
		log.Error("market not found", order.ContractAddress)
		return
	}
	log.Info("pushMarketOrder ", order)
	m.PushOrder(order)
}

func (e *engine) getMarketById(marketId string) *Market {
	for _, v := range e.markets {
		if v.conf.Market == marketId {
			return v
		}
	}
	return nil
}

func (e *engine) GetOpenOrders(marketId string, orderIds []string) []*common.LimitOrder {
	m := e.getMarketById(marketId)
	if m == nil {
		log.Error("market not found", marketId)
		return nil
	}
	orders := m.GetOpenOrders(orderIds)
	return orders
}
