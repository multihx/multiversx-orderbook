import { test, beforeEach, afterEach } from "vitest";
import { assertAccount, assertHexList, SWorld, SWallet, SContract, e } from "xsuite";

let world: SWorld;
let deployer: SWallet;
let contract: SContract;

const BTC = "BTC-1234";
const USDT = "USDT-1234";

beforeEach(async () => {
  world = await SWorld.start();
  deployer = await world.createWallet();

  ({ contract } = await deployer.deployContract({
    code: "file:output/contract.wasm",
    codeMetadata: [],
    gasLimit: 10_000_000,
    codeArgs: [e.Str(BTC), e.Str(USDT)]
  }));
});

afterEach(async () => {
  await world.terminate();
});

test("takerBuy", async () => {
  let maker: SWallet;
  let taker: SWallet;
  maker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: BTC, amount: 1 }])],
  });

  taker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: USDT, amount: 100 }])],
  });

  const usd = 100
  const btc = 1
  // sell 1BTC for 100USD
  // maker order
  await maker.callContract({
    callee: contract,
    funcName: "createSellOrder",
    funcArgs: [
      e.Tuple(e.U(usd), deployer),
    ],
    esdts: [{
      id: BTC,
      amount: btc,
    }],
    gasLimit: 10_000_000,
  });

  // taker order
  await taker.callContract({
    callee: contract,
    funcName: "createBuyOrder",
    funcArgs: [
      e.Tuple(e.U(1), deployer),
    ],
    esdts: [{
      id: USDT,
      amount: usd,
    }],
    gasLimit: 10_000_000,
  });

  // match order
  await deployer.callContract({
    callee: contract,
    funcName: "matchOrdersExt",
    funcArgs: [
      e.U64(1),
      e.List(e.U64(0)),
    ],
    gasLimit: 10_000_000,
  });

  assertAccount(await maker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 0 }, { id: USDT, amount: usd }]),
    ],
  });
  assertAccount(await taker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: btc }, { id: USDT, amount: 0 }]),
    ],
  });
});

test("takerSell", async () => {
  let maker: SWallet;
  let taker: SWallet;

  let makerBTC = 0;
  let makerUSDT = 100;

  let takerBTC = 1
  let takerUSD = 0


  maker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: USDT, amount: makerUSDT }])],
  });

  taker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: BTC, amount: takerBTC }])],
  });

  const usd = 100
  const btc = 1
  // buy 1BTC for 100USD
  // maker order
  await maker.callContract({
    callee: contract,
    funcName: "createBuyOrder",
    funcArgs: [
      e.Tuple(e.U(btc), deployer),
    ],
    esdts: [{
      id: USDT,
      amount: usd,
    }],
    gasLimit: 10_000_000,
  });

  // check order
  let result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(0)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(0), // id 
      maker, // createor
      deployer, // match_provider
      e.U(usd), // input_amount
      e.U(btc), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 0])), // order_type
    ),
  ])

  const btcSell = 1
  // taker order
  await taker.callContract({
    callee: contract,
    funcName: "createSellOrder",
    funcArgs: [
      e.Tuple(e.U(100), deployer),
    ],
    esdts: [{
      id: BTC,
      amount: btcSell,
    }],
    gasLimit: 10_000_000,
  });
    result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(1)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(1), // id 
      taker, // createor
      deployer, // match_provider
      e.U(btcSell), // input_amount
      e.U(100), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 1])), // order_type
    ),
  ])

  const takerOrderID = e.U64(1);
  const makerOrderIDList = e.List(e.U64(0));
  // match orders 
  await deployer.callContract({
    callee: contract,
    funcName: "matchOrdersExt",
    funcArgs: [
      takerOrderID,
      makerOrderIDList,
    ],
    gasLimit: 10_000_000,
  });

  makerBTC = 1;
  makerUSDT = 0
  assertAccount(await maker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: makerBTC }, { id: USDT, amount: makerUSDT }]),
    ],
  });

  takerBTC = 0
  takerUSD = 100
  assertAccount(await taker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: takerBTC }, { id: USDT, amount: takerUSD }]),
    ],
  });
});


test("buySellSell", async () => {
  // maker buy 2 btc
  // taker sell 1 btc
  // taker2 sell 1 btc

  // result
  // maker get 2 btc
  // taker get 100 usdt
  // taker2 get 100 usdt

  let maker: SWallet;
  let taker: SWallet;
  let taker2: SWallet;

  let makerBTC = 0;
  let makerUSDT = 200;

  let takerBTC = 1
  let takerUSD = 100

  maker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: USDT, amount: makerUSDT }])],
  });

  taker = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: BTC, amount: takerBTC }])],
  });

  taker2 = await world.createWallet({
    balance: 100_000,
    kvs: [e.kvs.Esdts([{ id: BTC, amount: 1 }])],
  });

  assertAccount(await maker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 0 }, { id: USDT, amount: makerUSDT }]),
    ],
  });
  assertAccount(await taker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: takerBTC }, { id: USDT, amount: 0 }]),
    ],
  });
  assertAccount(await taker2.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 1 }, { id: USDT, amount: 0 }]),
    ],
  });

  const usd = 200
  const btc = 2

  // 1. first order
  // maker buy 2BTC for 200USD
  // maker order
  await maker.callContract({
    callee: contract,
    funcName: "createBuyOrder",
    funcArgs: [
      e.Tuple(e.U(btc), deployer),
    ],
    esdts: [{
      id: USDT,
      amount: usd,
    }],
    gasLimit: 10_000_000,
  });

  let result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(0)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(0), // id 
      maker, // createor
      deployer, // match_provider
      e.U(usd), // input_amount
      e.U(btc), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 0])), // order_type
    ),
  ])


  // 2. second order
  // taker sell 1BTC
  // taker order
  const btcSell = 1
  await taker.callContract({
    callee: contract,
    funcName: "createSellOrder",
    funcArgs: [
      e.Tuple(e.U(100), deployer),
    ],
    esdts: [{
      id: BTC,
      amount: btcSell,
    }],
    gasLimit: 10_000_000,
  });
  result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(1)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(1), // id 
      taker, // createor
      deployer, // match_provider
      e.U(1), // input_amount
      e.U(100), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 1])), // order_type
    ),
  ])

  // match orders 
  await deployer.callContract({
    callee: contract,
    funcName: "matchOrdersExt",
    funcArgs: [
      e.U64(1), // taker order id 
      e.List(e.U64(0)), // maker order id 
    ],
    gasLimit: 10_000_000,
  });

  makerBTC = 1;
  makerUSDT = 0
  assertAccount(await maker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: makerBTC }, { id: USDT, amount: makerUSDT }]),
    ],
  });

  takerBTC = 0
  takerUSD = 100
  assertAccount(await taker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: takerBTC }, { id: USDT, amount: takerUSD }]),
    ],
  });

  // check order 0 balance
  result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(0)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(0), // id 
      maker, // createor
      deployer, // match_provider
      e.U(100), // input_amount
      e.U(1), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 0])), // order_type
    ),
  ])

  // 3. third order
  // taker sell 1 btc
  await taker2.callContract({
    callee: contract,
    funcName: "createSellOrder",
    funcArgs: [
      e.Tuple(e.U(100), deployer),
    ],
    esdts: [{
      id: BTC,
      amount: 1,
    }],
    gasLimit: 10_000_000,
  });
  result = await deployer.callContract({
    callee: contract,
    funcName: "getOrderById",
    funcArgs: [
      e.U(2)
    ],
    gasLimit: 10_000_000,
  });
  assertHexList(result.returnData, [
    e.Tuple(
      e.U64(2), // id 
      taker2, // createor
      deployer, // match_provider
      e.U(1), // input_amount
      e.U(100), // output_amount
      e.U(0), // create_epoch
      e.Bytes(new Uint8Array([0, 0, 0, 0, 1])), // order_type
    ),
  ])

  // check contract balance
  assertAccount(await contract.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 1 }]),
    ],
  });

  // match
  await deployer.callContract({
    callee: contract,
    funcName: "matchOrdersExt",
    funcArgs: [
      e.U64(2),  // taker order id 
      e.List(e.U64(0)), // maker order id 
    ],
    gasLimit: 10_000_000,
  });

  // check contract balance
  assertAccount(await contract.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 0 }, { id: USDT, amount: 0 }]),
    ],
  });

  // check taker balance
  assertAccount(await taker2.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: USDT, amount: 100 }]),
    ],
  });
  // check maker balance
  assertAccount(await maker.getAccountWithKvs(), {
    hasKvs: [
      e.kvs.Esdts([{ id: BTC, amount: 2 }]),
    ],
  });
});