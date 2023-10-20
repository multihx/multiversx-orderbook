package convert

import "github.com/shopspring/decimal"

func BigNumberToStr(val string) string {
	return decimal.RequireFromString(val).Div(decimal.RequireFromString("1000000000000000000")).String()
}
