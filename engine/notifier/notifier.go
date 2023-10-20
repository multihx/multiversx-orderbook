package notifier

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"engine/common"
	util "engine/util/redis"

	"github.com/go-redis/redis/v8"
	"github.com/shopspring/decimal"
	log "github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
)

type EventNotifier struct {
	exchangeAddressList []string
	con                 string
	rdb                 *redis.Client
	eventId             string
}

func NewEventNotifier(addressList []string, connection, eventId string) *EventNotifier {
	inst := new(EventNotifier)
	inst.exchangeAddressList = addressList
	inst.con = "amqp://user-abd11e1f:0f1b283688229ca953439aafe0d0afdbb284a744e07476e533e5a924aee74730@devnet-rabbitmq.beaconx.app:5672/"
	inst.rdb = util.NewRedis("127.0.0.1:6379")
	inst.eventId = eventId
	return inst
}

func (e *EventNotifier) Start() {
	go e.run()
}

func (e *EventNotifier) run() {
	log.Debug("start EventNotifier")

	connection, err := amqp.Dial(e.con)
	if err != nil {
		panic(err)
	}
	defer connection.Close()

	log.Debug("Successfully connected to RabbitMQ instance")

	ch, err := connection.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclarePassive(
		e.eventId, // name
		false,     // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	for d := range msgs {
		blockEvent := new(BlockchainEvent)
		err := json.Unmarshal(d.Body, blockEvent)
		if err != nil {
			log.Error(err)
		}

		for _, event := range blockEvent.Events {
			if e.isInterestedEvent(event) {
				log.Debugf("contract event: %#v", event)
				if event.Identifier == "createBuyOrder" {
					e.handleCreateOrder(event, "buy")
				} else if event.Identifier == "createSellOrder" {
					e.handleCreateOrder(event, "sell")
				} else if event.Identifier == "executeOrder" {

				}
			}
		}
	}
}

func (e *EventNotifier) isInterestedEvent(ev Event) bool {
	for _, addr := range e.exchangeAddressList {
		if ev.Address == addr {
			return true
		}
	}
	return false
}

func (e *EventNotifier) handleCreateOrder(ev Event, side string) {
	log.Debugf("=========> ")
	log.Debugf("  %#v", ev)
	id, creator, _, inputAmount, outputAmount := parseOrderData(ev.Data)

	log.Debugf(" id:%v, creator:%v, inputAmount:%v, outputAmount:%v, side:%v", id, creator, inputAmount, outputAmount, side)
	if side == "buy" {
		event := common.EngineEvent{}
		newOrder := common.LimitOrder{
			Id:              fmt.Sprintf("%v", id),
			Qty:             outputAmount,
			Price:           inputAmount.Div(decimal.RequireFromString("1000000000000000000")).Div(outputAmount),
			Side:            common.NEW_BUY_ORDER,
			ContractAddress: ev.Address,
			Creator:         creator,
			TimeStamp:       time.Now().Unix(),
			Filled:          decimal.RequireFromString("0"),
		}
		event.EventID = common.NEW_BUY_ORDER
		event.Data = newOrder.ToString()
		e.pushEngineEvent(event)
	} else {
		event := common.EngineEvent{}
		newOrder := common.LimitOrder{
			Id:              fmt.Sprintf("%v", id),
			Qty:             inputAmount.Div(decimal.RequireFromString("1000000000000000000")),
			Price:           outputAmount.Div(inputAmount.Div(decimal.RequireFromString("1000000000000000000"))),
			Side:            common.NEW_SELL_ORDER,
			ContractAddress: ev.Address,
			Creator:         creator,
			TimeStamp:       time.Now().Unix(),
			Filled:          decimal.RequireFromString("0"),
		}
		event.EventID = common.NEW_SELL_ORDER
		event.Data = newOrder.ToString()
		e.pushEngineEvent(event)
	}
}

func (e *EventNotifier) pushEngineEvent(engineEvent common.EngineEvent) {
	b, _ := json.Marshal(engineEvent)
	e.pushRedis(string(b))
}

func (e *EventNotifier) pushRedis(data string) {
	key := "engine"
	_, err := e.rdb.LPush(context.Background(), key, data).Result()
	if err != nil {
		log.Error(err)
	}
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
