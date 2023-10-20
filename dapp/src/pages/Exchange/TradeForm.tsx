import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useSendPairTransaction } from 'hooks/transactions/useSendPairTransaction';
import { SessionEnum } from 'localConstants';
import { useMarket } from 'store';
import { useInterval } from 'hooks/useInterval';
import axios from 'axios';
import { contractAddress } from 'config/config.contract';
import { format } from '../../utils/format';
import { useGetAccountInfo } from 'hooks';

const TradeForm = () => {
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [side, setSide] = useState(0);
  const [quote, setQuote] = useState('');
  const [base, setBase] = useState('');
  const [quoteBalance, setQuoteBalance] = useState('');
  const [baseBalance, setBaseBalance] = useState('');
  const { market } = useMarket();
  const isPriceFirstFocus = useRef(true);
  const isAmountFirstFocus = useRef(true);
  const { address } = useGetAccountInfo();

  const { sendCreateBuyOrder, sendCreateSellOrder, transactionStatus } =
    useSendPairTransaction(SessionEnum.abiPingPongSessionId);

  const getMarketCfg = (market: string) => {
    return contractAddress.market.filter((item) => item.market === market)[0];
  };

  const placeOrder = async () => {
    if (side == 0) {
      await sendCreateBuyOrder(market, amount, price);
    } else {
      await sendCreateSellOrder(market, amount, price);
    }
  };

  const changeSide = (side: number) => {
    setSide(side);
  };

  const fetchBalance = async () => {
    axios
      .get(`https://devnet-gateway.multiversx.com/address/${address}/esdt`)
      .then((response) => {
        // Handle the successful response
        let esdts = response.data.data.esdts;
        setBaseBalance(
          format(esdts[getMarketCfg(market).baseESDT].balance / 10 ** 18)
        );
        setQuoteBalance(
          format(esdts[getMarketCfg(market).quoteESDT].balance / 10 ** 18)
        );
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  useInterval(() => {
    fetchBalance();
  }, 1 * 1000);

  useEffect(() => {
    let arr = market.split('-');
    const base = arr[0];
    const quote = arr[1];
    setBase(base);
    setQuote(quote);
    fetchBalance();
  }, [market]);

  return (
    <div className='p-3 flex h-full w-[20%] flex-col gap-y-4 overflow-y-hidden   border-l border-gray-btn bg-gray-bg  bg-[#27272B] border-[#3E3D40] text-white'>
      Balances
      <div>
        <div className='flex justify-between'>
          <span>Asset</span>
          <span>Wallet</span>
        </div>

        <div className='flex justify-between text-sm  text-gray-400'>
          <span>{base}</span>
          <span>{baseBalance}</span>
        </div>

        <div className='flex justify-between text-sm text-gray-400'>
          <span>{quote}</span>
          <span>{quoteBalance}</span>
        </div>
      </div>
      <div className='flex justify-between p-2 w-full text-black'>
        <button
          onClick={() => {
            changeSide(0); // buy
          }}
          className={
            side == 0
              ? 'bg-[#23F7DD] w-full py-2 rounded-s'
              : 'bg-[#202020] w-full py-2 text-white'
          }
        >
          Buy
        </button>
        <button
          onClick={() => {
            changeSide(1); // sell
          }}
          className={
            side == 1
              ? 'bg-red-400 w-full py-2 rounded-e'
              : 'bg-[#202020] w-full py-2 text-white'
          }
        >
          Sell
        </button>
      </div>
      <a className='font-semibold text-primary'>Limit</a>
      <div className='flex w-full flex-col rounded border bg-[#202020] px-2 py-3 border-transparent'>
        <div className='mt-2 flex items-center text-xs'>
          <p className='text-gray-500'>Price</p>
          <input
            placeholder='0.0'
            className='mx-1 w-full flex-1 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onFocus={() => {
              // if (isPriceFirstFocus.current) {
              //   setPrice(0);
              //   isPriceFirstFocus.current = false;
              // }
            }}
          />
          <p>{quote}</p>
        </div>
      </div>
      <div className='flex w-full flex-col rounded border bg-[#202020] px-2 py-3 border-transparent'>
        <div className='mt-2 flex items-center text-xs'>
          <p className='text-gray-500'>Amount</p>
          <input
            placeholder='0.0'
            className='mx-1 w-full flex-1 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            type='number'
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            onFocus={() => {
              // if (isAmountFirstFocus.current) {
              //   setPrice(0);
              //   isAmountFirstFocus.current = false;
              // }
            }}
          />
          <p>{base}</p>
        </div>
      </div>
      <div className='w-full mt-10 px-3'>
        <button
          className={
            side == 0
              ? 'text-black bg-[#23F7DD] py-2 w-full rounded'
              : 'text-black bg-red-400 py-2 w-full rounded'
          }
          onClick={placeOrder}
        >
          {side == 0 ? 'Buy' : 'Sell'}
        </button>
      </div>
    </div>
  );
};

export default TradeForm;
