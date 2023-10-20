package api

import (
	"encoding/json"
	"fmt"
	"testing"
)

func TestView(t *testing.T) {

	js := `
	{
		"asks": {
			"numOrders": 2,
			"depth": 1,
			"prices": {
				"1000000000000000000": {
					"volume": "2",
					"price": "1000000000000000000",
					"orders": [
						{
							"side": "buy",
							"id": "31",
							"timestamp": "2023-10-19T03:06:36.329053Z",
							"quantity": "1",
							"price": "1000000000000000000"
						},
						{
							"side": "buy",
							"id": "32",
							"timestamp": "2023-10-19T03:07:54.867234Z",
							"quantity": "1",
							"price": "1000000000000000000"
						}
					]
				},
	
				"2000000000000000000": {
					"volume": "2",
					"price": "2000000000000000000",
					"orders": [
						{
							"side": "buy",
							"id": "31",
							"timestamp": "2023-10-19T03:06:36.329053Z",
							"quantity": "1",
							"price": "2000000000000000000"
						},
						{
							"side": "buy",
							"id": "32",
							"timestamp": "2023-10-19T03:07:54.867234Z",
							"quantity": "1",
							"price": "2000000000000000000"
						}
					]
				}
			}
		},
		"bids": {
			"numOrders": 2,
			"depth": 1,
			"prices": {
				"1000000000000000000": {
					"volume": "2",
					"price": "1000000000000000000",
					"orders": [
						{
							"side": "buy",
							"id": "31",
							"timestamp": "2023-10-19T03:06:36.329053Z",
							"quantity": "1",
							"price": "1000000000000000000"
						},
						{
							"side": "buy",
							"id": "32",
							"timestamp": "2023-10-19T03:07:54.867234Z",
							"quantity": "1",
							"price": "1000000000000000000"
						}
					]
				},
	
				"2000000000000000000": {
					"volume": "2",
					"price": "2000000000000000000",
					"orders": [
						{
							"side": "buy",
							"id": "31",
							"timestamp": "2023-10-19T03:06:36.329053Z",
							"quantity": "1",
							"price": "2000000000000000000"
						},
						{
							"side": "buy",
							"id": "32",
							"timestamp": "2023-10-19T03:07:54.867234Z",
							"quantity": "1",
							"price": "2000000000000000000"
						}
					]
				}
			}
		}
	}
	
	`

	view := new(OrderbookView)
	json.Unmarshal([]byte(js), view)

	fmt.Println(view)

	bidList := make([]interface{}, 0)
	for _, v := range view.Bids.Prices {
		pair := make([]string, 2)
		pair[0] = v.Price
		pair[1] = v.Volume
		bidList = append(bidList, pair)
	}

	sellList := make([]interface{}, 0)
	for _, v := range view.Asks.Prices {
		pair := make([]string, 2)
		pair[0] = v.Price
		pair[1] = v.Volume
		sellList = append(sellList, pair)
	}

	resp := make(map[string]interface{})

	resp["bid"] = bidList
	resp["ask"] = sellList

	data, _ := json.Marshal(resp)

	fmt.Println(string(data))
}
