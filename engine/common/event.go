package common

import (
	"encoding/json"

	"github.com/shopspring/decimal"
)

const (
	NEW_BUY_ORDER = iota
	NEW_SELL_ORDER
	ORDER_MATCH
)

type EngineEvent struct {
	EventID int
	Data    string
}

type LimitOrder struct {
	Id              string
	Qty             decimal.Decimal
	Price           decimal.Decimal
	Side            int
	Creator         string
	ContractAddress string
	TimeStamp       int64
	Filled          decimal.Decimal
}

func (ev LimitOrder) ToString() string {
	b, _ := json.Marshal(ev)
	return string(b)
}
