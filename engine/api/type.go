package api

type OrderbookReq struct {
	MarketID string `json:"marketID"`
}

// "data":{"sequence":1,"bids":[],"asks":[["1","1000"]]}}
type OrderbookView struct {
	Asks Elem `json:"asks"`
	Bids Elem `json:"bids"`
}

type Elem struct {
	NumOrders int64            `json:"numOrders"`
	Depth     int64            `json:"depth"`
	Prices    map[string]Price `json:"prices"`
}

type Price struct {
	Volume string  `json:"volume"`
	Price  string  `json:"price"`
	Orders []Order `json:"orders"`
}

type Order struct {
	Side      string `json:"side"`
	ID        string `json:"id"`
	Timestamp string `json:"timestamp"`
	Quantity  string `json:"quantity"`
	Price     string `json:"price"`
}

type GetOpenOrderReq struct {
	MarketID string   `json:"marketID"`
	OrderIds []string `json:"orderIds"`
}
