import { contractAddress } from 'config';
import json from 'contracts/faucet.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address("erd1qqqqqqqqqqqqqpgqpe9kw7yydm6dl9l8g8p3c7y5ye6vmx0cymts6fr2te"),
  abi
});
