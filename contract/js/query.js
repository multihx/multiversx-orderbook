import { AbiRegistry } from "@multiversx/sdk-core";
import { Address, SmartContract, ResultsParser } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { promises } from "fs";

import { ExchangeAddr } from "./const.js"

const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

let contractAddress = new Address(ExchangeAddr);

let abiJson = await promises.readFile("../pair/output/pair.abi.json", { encoding: "utf8" });
let abiObj = JSON.parse(abiJson);
let abiRegistry = AbiRegistry.create(abiObj);
clear
let contract = new SmartContract({
    address: contractAddress,
    abi: abiRegistry
});

async function getOrderIdCounter() {
    let interaction = contract.methods.getOrderIdCounter([]);

    let query = interaction.check().buildQuery();
    let queryResponse = await proxyNetworkProvider.queryContract(query);
    let typedBundle = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());

    let ret = typedBundle.values[0].valueOf()
    console.log(ret.toString())
}

async function getOrderById() {
    let interaction = contract.methods.getOrderById([1]);

    let query = interaction.check().buildQuery();
    let queryResponse = await proxyNetworkProvider.queryContract(query);
    let typedBundle = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());

    let order = typedBundle.values[0].valueOf()
    const { id, creator, input_amount, output_amount } = order
    console.log(id.toString())
    console.log(creator.toString())
    console.log(input_amount.toString())
    console.log(output_amount.toString())
}

async function getAddressOrderIds() {
    const address = "erd1qk4e0su5wx72yrmunxa5me0g4mx5xw025x77mzkeljnw9rzhymtshkdxtq"
    let interaction = contract.methods.getAddressOrderIds([address]);
    let query = interaction.check().buildQuery();
    let queryResponse = await proxyNetworkProvider.queryContract(query);
    let typedBundle = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());

    console.log(typedBundle.values[0])
    let ret = typedBundle.values[0].valueOf()
    console.log(ret)
}

await getAddressOrderIds()
