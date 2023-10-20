
import json from 'contracts/pair.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';
import { contractAddress } from "config/config.contract"

const abi = AbiRegistry.create(json);

export const contractsMap = new Map();

contractAddress.market.forEach(item => {
  contractsMap.set(item.market, new SmartContract({
    address: new Address(item.exchangeAddress),
    abi
  }));
})