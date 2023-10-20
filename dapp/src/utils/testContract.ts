import { contractAddress } from 'config';
import json from 'contracts/empty.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address("erd1qqqqqqqqqqqqqpgq663ckn3vuh3k9sp3w7w7h6nj3edxldu7ymtsv5rnpy"),
  abi
});
