package launcher

import (
	"context"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/multiversx/mx-chain-crypto-go/signing"
	"github.com/multiversx/mx-chain-crypto-go/signing/ed25519"
	log "github.com/sirupsen/logrus"

	"github.com/multiversx/mx-sdk-go/blockchain"
	"github.com/multiversx/mx-sdk-go/blockchain/cryptoProvider"
	"github.com/multiversx/mx-sdk-go/builders"
	"github.com/multiversx/mx-sdk-go/core"
	"github.com/multiversx/mx-sdk-go/interactors"
)

var (
	suite  = ed25519.NewEd25519()
	keyGen = signing.NewKeyGenerator(suite)
)

type launcher struct {
	ch        chan TxReq
	gateway   string
	walletPem []byte
	explorer  string
}

var Launcher *launcher

var gateway string
var explorerURL string
var walletPem []byte

func NewLaunch(_gateway string, pem []byte, explorer string) *launcher {
	Launcher = new(launcher)
	Launcher.gateway = gateway
	Launcher.walletPem = walletPem
	Launcher.explorer = explorer
	Launcher.ch = make(chan TxReq, 100)

	gateway = _gateway
	explorerURL = explorer
	walletPem = pem

	return Launcher
}

type TxReq struct {
	contract string
	data     string
}

func (l *launcher) Start() {
	go l.run()
}

func (l *launcher) run() {
	for {
		select {
		case txReq := <-l.ch:
			sendTransaction(txReq.contract, txReq.data)
		}
	}
}

func sendTransaction(contractAddress string, data string) {
	args := blockchain.ArgsProxy{
		ProxyURL:            gateway,
		Client:              nil,
		SameScState:         false,
		ShouldBeSynced:      false,
		FinalityCheck:       false,
		CacheExpirationTime: time.Minute,
		EntityType:          core.Proxy,
	}
	ep, err := blockchain.NewProxy(args)
	if err != nil {
		log.Error("error creating proxy", "error", err)
		return
	}

	w := interactors.NewWallet()

	privateKey, err := w.LoadPrivateKeyFromPemData(walletPem)
	if err != nil {
		log.Error("unable to load alice.pem", "error", err)
		return
	}
	// Generate address from private key
	address, err := w.GetAddressFromPrivateKey(privateKey)
	if err != nil {
		log.Error("unable to load the address from the private key", "error", err)
		return
	}

	// netConfigs can be used multiple times (for example when sending multiple transactions) as to improve the
	// responsiveness of the system
	netConfigs, err := ep.GetNetworkConfig(context.Background())
	if err != nil {
		log.Error("unable to get the network configs", "error", err)
		return
	}

	tx, _, err := ep.GetDefaultTransactionArguments(context.Background(), address, netConfigs)
	if err != nil {
		log.Error("unable to prepare the transaction creation arguments", "error", err)
		return
	}

	// set tx data
	tx.Receiver = contractAddress // exchange contract address
	tx.Data = []byte(data)
	tx.GasLimit = 600000000
	tx.GasPrice = 10000000000
	tx.Value = "0"

	holder, _ := cryptoProvider.NewCryptoComponentsHolder(keyGen, privateKey)
	txBuilder, err := builders.NewTxBuilder(cryptoProvider.NewSigner())
	if err != nil {
		log.Error("unable to prepare the transaction creation arguments", "error", err)
		return
	}

	ti, err := interactors.NewTransactionInteractor(ep, txBuilder)
	if err != nil {
		log.Error("error creating transaction interactor", "error", err)
		return
	}

	err = ti.ApplySignature(holder, &tx)
	if err != nil {
		log.Error("error signing transaction", "error", err)
		return
	}

	ti.AddTransaction(&tx)
	hashes, err := ti.SendTransactionsAsBunch(context.Background(), 100)
	if err != nil {
		log.Error("error sending transaction", "error", err)
		return
	}

	log.Info("transactions sent ", "hash: ", fmt.Sprintf("%s%v", explorerURL, hashes[0]))
}

func matchOrdersExt(takerOrderId uint64, makerOrderIds []uint64) string {
	log.Info("takerOrderId ", takerOrderId)
	log.Info("makerOrderIds ", makerOrderIds)
	_args := make([]string, 0)
	bytes064 := make([]byte, 8)
	binary.BigEndian.PutUint64(bytes064, takerOrderId)

	compact := make([]byte, 0)
	for _, v := range bytes064 {
		if v == 0 {
			continue
		}
		compact = append(compact, v)
	}
	// _args = append(_args, hex.EncodeToString([]byte{bytes064[7]}))
	_args = append(_args, hex.EncodeToString(compact))
	for _, elem := range makerOrderIds {
		bytes164 := make([]byte, 8)
		binary.BigEndian.PutUint64(bytes164, elem)
		_args = append(_args, hex.EncodeToString(bytes164))
	}
	dataField := "matchOrdersExt" + "@" + _args[0] + "@" + strings.Join(_args[1:], "")
	log.Info("dataField ", dataField)
	return dataField
}

func SubmitBlockchainOrderMatch(receiver string, orderList []string) {
	takerOrder := orderList[len(orderList)-1]
	makerOrderIdList := make([]uint64, 0)

	takerOrderId, _ := strconv.ParseInt(takerOrder, 10, 64)
	for _, makerOrder := range orderList[:len(orderList)-1] {
		makerOrderId, _ := strconv.ParseInt(makerOrder, 10, 64)
		makerOrderIdList = append(makerOrderIdList, uint64(makerOrderId))
	}

	data := matchOrdersExt(uint64(takerOrderId), makerOrderIdList)
	Launcher.ch <- TxReq{contract: receiver, data: data}
	// sendTransaction(receiver, data)
}
