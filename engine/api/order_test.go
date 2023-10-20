package api

import (
	"encoding/base64"
	"encoding/hex"
	"engine/util/parser"
	"fmt"
	"testing"

	"github.com/shopspring/decimal"
)

func Test(t *testing.T) {
	encodedStr := "AAAAAAAAABF/6BnrlWAwroScmAguZcnhtKG/WueG32DOwBjQQahpggWrl8OUcbyiD3yZu03l6K7NQznqob3titn8puKMVybXAAAACA3gtrOnY//+AAAAAQwAAAAAAAAajgE="

	decodedBytes, err := base64.StdEncoding.DecodeString(encodedStr)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	_ = decodedBytes

	v1, v2, v3, v4, v5 := parseOrderData(decodedBytes)

	fmt.Println(v1, v2, v3, v4, v5)

}

// pub struct Order<M: ManagedTypeApi> {
//     pub id: u64,
//     pub creator: ManagedAddress<M>,
//     pub match_provider: ManagedAddress<M>,
//     pub input_amount: BigUint<M>,
//     pub output_amount: BigUint<M>,
//     // pub fee_config: FeeConfig<M>,
//     // pub deal_config: DealConfig,
//     pub create_epoch: u64,
//     pub order_type: OrderType,
// }

func parseOrderData(data []byte) (uint64, string, string, decimal.Decimal, decimal.Decimal) {

	idx := 0
	ok, allOk := true, true
	id, idx, ok := parser.ParseUint64(data, idx)
	allOk = allOk && ok
	creator, idx, ok := parser.ParsePubkey(data, idx)
	allOk = allOk && ok
	matchProvider, idx, ok := parser.ParsePubkey(data, idx)
	allOk = allOk && ok
	_inputAmount, idx, ok := parser.ParseBigInt(data, idx)
	allOk = allOk && ok
	_outputAmount, idx, ok := parser.ParseBigInt(data, idx)
	allOk = allOk && ok

	inputAmount := decimal.RequireFromString(_inputAmount.String())
	outputAmount := decimal.RequireFromString(_outputAmount.String())

	return id, hex.EncodeToString(creator), hex.EncodeToString(matchProvider), inputAmount, outputAmount
}
