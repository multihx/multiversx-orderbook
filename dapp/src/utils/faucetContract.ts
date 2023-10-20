// import { contractAddress } from 'config';
import json from 'contracts/faucet.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';
import { contractAddress } from 'config/config.contract';
const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address(contractAddress.faucetAddress),
  abi
});
