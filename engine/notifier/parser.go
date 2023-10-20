package notifier

import (
	"encoding/base64"
	"encoding/hex"
	"engine/util/parser"

	"github.com/shopspring/decimal"
)

func parseOrderData(base64Data *string) (uint64, string, string, decimal.Decimal, decimal.Decimal) {
	data, _ := base64.StdEncoding.DecodeString(*base64Data)
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
