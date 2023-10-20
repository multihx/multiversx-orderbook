import { AbiRegistry } from "@multiversx/sdk-core";
import { Account, Address, AddressValue, SmartContract, U64Value, Interaction, TokenTransfer, U32Value } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { promises } from "fs";
import { UserSigner } from "@multiversx/sdk-wallet";

import { ExchangeAddr } from "./const.js"

const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

let contractAddress = new Address(ExchangeAddr);

class OrderInputParamsSimple {
    constructor(amount, match_provider) {
        this.amount = amount;
        this.match_provider = match_provider;
    }
}

let abiJson = await promises.readFile("../contract/output/contract.abi.json", { encoding: "utf8" });
let abiObj = JSON.parse(abiJson);
let abiRegistry = AbiRegistry.create(abiObj);

async function createBuyOrder() {
    let addressOfAlice = new Address("erd1qk4e0su5wx72yrmunxa5me0g4mx5xw025x77mzkeljnw9rzhymtshkdxtq");
    const alice = new Account(addressOfAlice);

    let contract = new SmartContract({ address: contractAddress, abi: abiRegistry });
    const aliceOnNetwork = await proxyNetworkProvider.getAccount(addressOfAlice);
    alice.update(aliceOnNetwork);

    let takerId = 3
    let makerOrderIds = [1, 2]
    let tx = contract.methods.matchOrdersExt([takerId,makerOrderIds])
        .withSender(addressOfAlice)
        .withNonce(alice.getNonceThenIncrement())
        .withGasLimit(10000000)
        .withChainID("D")
        .buildTransaction();



    // let tx = contract.methods.createBuyOrder([new OrderInputParamsSimple(Number(1), new Address("erd1qk4e0su5wx72yrmunxa5me0g4mx5xw025x77mzkeljnw9rzhymtshkdxtq"))])
    //     .withSender(addressOfAlice)
    //     .withNonce(alice.getNonceThenIncrement())
    //     .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount("USDC-be5b9b", "1", 18))
    //     .withGasLimit(10000000)
    //     .withChainID("D")
    //     .buildTransaction();

    // serialize the tx for signing
    const serializedTransaction = tx.serializeForSigning();

    // read pem file 
    const pemText = await promises.readFile("../../wallet/wallet-owner.pem", { encoding: "utf8" });
    const signer = UserSigner.fromPem(pemText);

    // apply signature
    const transactionSignature = await signer.sign(serializedTransaction);
    tx.applySignature(transactionSignature);

    // send tx
    let txHash = await proxyNetworkProvider.sendTransaction(tx);
    console.log("Hash:", txHash);
}

createBuyOrder();