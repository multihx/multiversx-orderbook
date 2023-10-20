package api

import (
	"context"
	"encoding/json"
	"engine/market"
	"engine/util/convert"
	util "engine/util/redis"
	"sort"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo"
	log "github.com/sirupsen/logrus"
)

var rdb *redis.Client

func init() {
	rdb = util.NewRedis("127.0.0.1:6379")
}

func OrderBook(c echo.Context) error {
	req := new(OrderbookReq)
	err := c.Bind(req)
	if err != nil {
		log.Errorf("OrderBook %v", err)
		return err
	}

	cmd := rdb.Get(context.Background(), req.MarketID)
	redisData, err := cmd.Result()

	if err == redis.Nil {
		return c.JSON(200, map[string]interface{}{"code": 0, "data": ""})
	} else if err != nil {
		log.Error(err)
		return c.JSON(200, map[string]interface{}{"code": 0, "data": ""})
	}

	view := new(OrderbookView)
	err = json.Unmarshal([]byte(redisData), view)
	if err != nil {
		log.Error(err)
		return c.JSON(200, map[string]interface{}{"code": 0, "data": ""})
	}

	askList := make([][]float64, 0)
	for _, v := range view.Asks.Prices {
		price := convert.StrToUint64(v.Price)
		volume := convert.StrToUint64(v.Volume)
		askList = append(askList, []float64{price, volume})
	}
	sortByPrice(askList, true)

	bidList := make([][]float64, 0)
	for _, v := range view.Bids.Prices {
		price := convert.StrToUint64(v.Price)
		volume := convert.StrToUint64(v.Volume)
		bidList = append(bidList, []float64{price, volume})
	}
	sortByPrice(bidList, false)

	resp := make(map[string]interface{})
	resp["bids"] = bidList
	resp["asks"] = askList
	data, _ := json.Marshal(resp)

	return c.JSON(200, map[string]interface{}{"code": 0, "data": string(data)})
}

func sortByPrice(askList [][]float64, asc bool) {
	if asc {
		sort.Slice(askList, func(i, j int) bool {
			return askList[i][0] < askList[j][0]
		})
	} else {
		sort.Slice(askList, func(i, j int) bool {
			return askList[i][0] > askList[j][0]
		})
	}
}

func OpenOrder(c echo.Context) error {
	req := new(GetOpenOrderReq)
	err := c.Bind(req)
	if err != nil {
		log.Errorf("OrderBook %v", err)
		return err
	}
	openOrders := market.Engine.GetOpenOrders(req.MarketID, req.OrderIds)
	return c.JSON(200, map[string]interface{}{"code": 0, "data": openOrders})
}
