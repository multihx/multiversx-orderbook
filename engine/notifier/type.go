package notifier

type BlockchainEvent struct {
	Hash      string  `json:"hash"`
	ShardID   int64   `json:"shardId"`
	Timestamp int64   `json:"timestamp"`
	Events    []Event `json:"events"`
}

type Event struct {
	Address    string   `json:"address"`
	Identifier string   `json:"identifier"`
	Topics     []string `json:"topics"`
	Data       *string  `json:"data"`
	TxHash     string   `json:"txHash"`
}
