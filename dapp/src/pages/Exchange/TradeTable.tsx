import { useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { OpenOrderVo, TradeVo } from './Types';
import { useMarket } from 'store';
import { format } from '../../utils/format';
import { useQuery } from 'hooks/query/usePairQuery';
import { useGetAccountInfo } from 'hooks';
import { openOrders } from './api';

const TradeTable = () => {
  const { market } = useMarket();
  const [openOrderVo, setOpenOrderVo] = useState<any[]>([]);
  const [trades, setTrades] = useState<TradeVo[]>([]);
  const [tab, setTab] = useState('openOrders');
  const { getAddressOrderIds } = useQuery();
  const { address } = useGetAccountInfo();

  useEffect(() => {
    const fetchOrder = async () => {
      let orderIds = await getAddressOrderIds(market, address);
      let openOrderList = await openOrders({
        marketID: market,
        orderIds
      });
      setOpenOrderVo(openOrderList);
    };
    fetchOrder();
  }, []);

  useInterval(() => {
    const fetchOrder = async () => {
      let orderIds = await getAddressOrderIds(market, address);
      let openOrderList = await openOrders({
        marketID: market,
        orderIds
      });
      setOpenOrderVo(openOrderList);
    };
    fetchOrder();
  }, 2 * 1000);

  function convertTaiTime(num: string) {
    return BigInt(num) - BigInt(Math.pow(2, 62)) - BigInt(10);
  }

  function convertTime(input: any) {
    let bigNum = convertTaiTime(input.valueOf());
    let final = Number(bigNum) * 1000;
    return final;
  }

  const convertToLocalTime = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    // Get the local time components from the Date object
    const localTime = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Months are zero-based, so adding 1
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    };

    // Format the local time components as a string
    const formattedTime = `${localTime.year}-${localTime.month}-${localTime.day} ${localTime.hours}:${localTime.minutes}:${localTime.seconds}`;
    return formattedTime;
  };

  const OpenOrderTable = () => {
    return (
      <div className=''>
        <div className='mt-2 flex w-full items-center text-xs text-white'>
          <p className='w-1/4 text-left md:w-[12%]'>Date</p>
          <p className='w-1/4 text-left md:w-[12%]'>Pair</p>
          <p className='w-1/4 text-center md:w-[8%]'>Type</p>
          <p className='w-1/4 text-center md:w-[8%]'>Side</p>
          <p className='hidden w-[12%] text-left md:flex'>Price</p>
          <p className='hidden w-[12%] text-left md:flex'>Amount</p>
          <p className='hidden w-[12%] text-left md:flex'>Filled</p>
          <p className='hidden w-[12%] text-left md:flex'>Total</p>
          <p className='hidden w-[12%] items-center justify-center text-center md:flex text-gray-text'>
            Cancel All
          </p>
        </div>
        {openOrderVo.map((order, index) => (
          <div
            key={index}
            className='mt-2 flex w-full items-center text-xs text-white overflow-hidden'
          >
            <p className='w-1/4 text-left md:w-[12%]'>
              {convertToLocalTime(order.TimeStamp)}
            </p>
            <p className='w-1/4 text-left md:w-[12%]'>{market}</p>
            <p className='w-1/4 text-center md:w-[8%]'>{'limit'}</p>
            <p className='w-1/4 text-center md:w-[8%]'>
              {order.Side == 0 ? 'buy' : 'sell'}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(Number(order.Price))}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(Number(order.Qty))}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(Number(order.Price))}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(Number(order.Qty))}
            </p>
            <p className='hidden w-[12%] items-center justify-center text-center md:flex text-gray-text'>
              Cancel
            </p>
          </div>
        ))}
      </div>
    );
  };

  const TradesTable = () => {
    return (
      <div className=''>
        <div className='mt-2 flex w-full items-center text-xs text-white'>
          <p className='w-1/4 text-left md:w-[12%]'>Date</p>
          <p className='w-1/4 text-left md:w-[12%]'>Pair</p>
          <p className='w-1/4 text-center md:w-[8%]'>Type</p>
          <p className='w-[12%] text-center md:w-[8%]'>Side</p>
          <p className='hidden w-[12%] text-left md:flex'>Price</p>
          <p className='hidden w-[12%] text-left md:flex'>Amount</p>
          {/* <p className="hidden w-[12%] text-left md:flex">Executed</p> */}
          {/* <p className="hidden w-[12%] text-left md:flex">Role</p> */}
        </div>

        {trades.map((order, index) => (
          <div
            key={index}
            className='mt-2 flex w-full items-center text-xs text-white'
          >
            <p className='w-1/4 text-left md:w-[12%]'>
              {convertToLocalTime(order.timestamp)}
            </p>
            <p className='w-1/4 text-left md:w-[12%]'>{market}</p>
            <p className='w-1/4 text-center md:w-[8%]'>{'limit'}</p>
            <p className='w-[12%] text-center md:w-[8%]'>
              {order.side == 0 ? 'buy' : 'sell'}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(order.price)}
            </p>
            <p className='hidden w-[12%] text-left md:flex'>
              {format(order.amount)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className='flex items-center text-[#23F7DD]'>
        <div
          className={
            tab == 'openOrders'
              ? 'cursor-pointer rounded px-3 py-2 text-center text-gray-text font-bold text-primary  border-[1px] border-[#23F7DD]'
              : 'cursor-pointer rounded px-3 py-2 text-center text-gray-text text-primary'
          }
          onClick={() => {
            setTab('openOrders');
          }}
        >
          Open Orders ({openOrderVo.length})
        </div>
        <div
          className={
            tab == 'tradeHistory'
              ? 'cursor-pointer rounded px-3 py-2 text-center text-gray-text font-bold border-[1px] border-[#23F7DD]'
              : 'cursor-pointer rounded px-3 py-2 text-center text-gray-text ext-primary'
          }
          onClick={() => {
            setTab('tradeHistory');
          }}
        >
          Trade History ({trades.length})
        </div>
      </div>
      {tab == 'openOrders' ? OpenOrderTable() : TradesTable()}
    </div>
  );
};

export default TradeTable;
