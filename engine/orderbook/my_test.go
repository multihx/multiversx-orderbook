package orderbook

import (
	"fmt"
	"testing"

	"github.com/shopspring/decimal"
)

func TestLimitOrderPlace(t *testing.T) {
	ob := NewOrderBook()
	quantity := decimal.New(int64(1), 0)
	done, partial, partialQuantityProcessed, err := ob.ProcessLimitOrder("maker", Buy, "1", quantity, decimal.New(int64(1), 0))

	data, _ := ob.MarshalJSON()
	fmt.Println(string(data))
	fmt.Println("1", done, partial, partialQuantityProcessed, err)
	done, partial, partialQuantityProcessed, err = ob.ProcessLimitOrder("taker", Sell, "2", quantity, decimal.New(int64(1), 0))

	data, _ = ob.MarshalJSON()
	fmt.Println(string(data))

	fmt.Println("2", done, partial, partialQuantityProcessed, err)

}
