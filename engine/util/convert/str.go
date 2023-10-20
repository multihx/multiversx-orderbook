package convert

import "strconv"

func StrToUint64(in string) float64 {
	out, _ := strconv.ParseFloat(in, 64)
	return out
}
