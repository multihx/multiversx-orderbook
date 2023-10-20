package market

import (
	"context"
	"engine/common"
	"engine/conf"
	"engine/launcher"
	"engine/orderbook"
	util "engine/util/redis"

	"github.com/go-redis/redis/v8"
	log "github.com/sirupsen/logrus"
)

type Market struct {
	orderbook *orderbook.OrderBook
	conf      conf.Market
	sequence  uint64
	ch        chan interface{}
	rdb       *redis.Client

	orders map[string]*common.LimitOrder
}

func NewMarket(cfg conf.Market) *Market {
	m := new(Market)
	m.orderbook = orderbook.NewOrderBook()
	m.conf = cfg
	m.ch = make(chan interface{}, 1000)
	m.sequence = 0
	m.rdb = util.NewRedis("127.0.0.1:6379")
	m.orders = make(map[string]*common.LimitOrder)
	return m
}

func (m *Market) PushOrder(order interface{}) {
	m.ch <- order
}

func (m *Market) run() {
	log.Infof("%v started", m.conf.Market)
	for {
		select {
		case order := <-m.ch:
			m.processLimitOrder(order)
		}
	}
}

func (m *Market) processLimitOrder(data interface{}) {
	order := data.(*common.LimitOrder)
	log.Infof("processLimitOrder market: %s, order id: %v, qty: %v, price: %v, side: %v", m.conf.Market, order.Id, order.Qty, order.Price, order.Side)
	m.orders[order.Id] = order
	var side orderbook.Side
	if order.Side == common.NEW_BUY_ORDER {
		side = orderbook.Buy
	} else {
		side = orderbook.Sell
	}
	done, partial, partialQuantityProcessed, err := m.orderbook.ProcessLimitOrder(
		"maker",
		side,
		order.Id,
		order.Qty,
		order.Price)

	if err != nil {
		log.Error(err)
	}
	log.Debug("processLimitOrder result...")
	log.Debugf(" done: %v", done)
	log.Debugf(" partial: %v", partial)
	log.Debugf(" partialQuantityProcessed: %v", partialQuantityProcessed)

	orderList := make([]string, 0)
	if len(done) > 0 {
		for _, o := range done {
			orderList = append(orderList, o.ID())
		}
		if partial != nil {
			orderList = append(orderList, partial.ID())
		}
		launcher.SubmitBlockchainOrderMatch(m.conf.ExchangeAddress, orderList)
	}

	m.updateOrderbookView()
}

func (m *Market) getOrderbookView() string {
	data, err := m.orderbook.MarshalJSON()
	if err != nil {
		log.Error(err)
	}
	return string(data)
}

func (m *Market) updateOrderbookView() {
	ctx := context.Background()
	orderbook := m.getOrderbookView()
	log.Debugf("updateOrderbookView: %v, orderbook: %v", m.conf.Market, orderbook)
	err := m.rdb.Set(ctx, m.conf.Market, orderbook, 0).Err()
	if err != nil {
		log.Error("updateOrderbookView:", err)
		return
	}
}

func (m *Market) GetOpenOrders(orderIds []string) []*common.LimitOrder {
	list := make([]*common.LimitOrder, 0)
	for _, orderId := range orderIds {
		if _, ok := m.orders[orderId]; ok {
			list = append(list, m.orders[orderId])
		}
	}
	return list
}
