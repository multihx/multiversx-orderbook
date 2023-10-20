import { useEffect, useState } from 'react';
import { orderbook as orderbookAPI } from './api';
import { format } from '../../utils/format';
import { useInterval } from 'hooks/useInterval';
import { useMarket } from 'store';

const Orderbook = () => {
  const { market } = useMarket();
  const [fetching, setFetching] = useState(false);
  const [orderbookData, setOrderbookData] = useState<any>(null);
  const [spread, setSpread] = useState(Number);
  const [spreadPercent, setSpreadPercent] = useState(Number);
  const fetchOrderbook = async () => {
    setFetching(true);
    let orderbook = await orderbookAPI({ marketID: market });
    let bids = orderbook?.bids || [];
    let asks = orderbook?.asks || [];
    // console.log("fetchOrderbook done", asks, bids);

    let depth = 50;
    let sum = (
      total: number,
      [_, size]: [number, number],
      index: number
    ): number => (index < depth ? total + size : total);
    let totalSize = bids.reduce(sum, 0) + asks.reduce(sum, 0);
    let asksToDisplay = getCumulativeOrderbookSide(asks, totalSize, true);
    let bidsToDisplay = getCumulativeOrderbookSide(bids, totalSize, false);

    let bestSellPrice;
    let bestBuyPrice;

    if (asks[0] && asks[0][0]) {
      bestSellPrice = asks[0][0];
    } else {
      // asks[0][0] is empty or null
      // Handle the empty case here
      setSpread(0);
      setSpreadPercent(0);
    }

    if (bids[0] && bids[0][0]) {
      bestBuyPrice = bids[0][0];
    } else {
      // bids[0][0] is empty or null
      // Handle the empty case here
      setSpread(0);
      setSpreadPercent(0);
    }

    if (bestSellPrice && bestBuyPrice) {
      setSpread(bestSellPrice - bestBuyPrice);
      let spreadPercent_ = (bestSellPrice - bestBuyPrice) / bestSellPrice;
      setSpreadPercent(spreadPercent_ * 100);
    }

    setOrderbookData({ bids: bidsToDisplay, asks: asksToDisplay });
    setFetching(false);
  };

  useEffect(() => {
    fetchOrderbook();
  }, []);

  useInterval(() => {
    fetchOrderbook();
  }, 1 * 1000);

  function getCumulativeOrderbookSide(
    orders: Array<[number, number]>,
    totalSize: number,
    backwards = false
  ) {
    let cumulative = orders
      .slice(0, 100)
      .reduce((cumulative: any, [price, size]: [any, any], i: number) => {
        const cumulativeSize = (cumulative[i - 1]?.cumulativeSize || 0) + size;
        cumulative.push({
          price,
          size,
          cumulativeSize,
          sizePercent: Math.round((cumulativeSize / (totalSize || 1)) * 100)
        });
        return cumulative;
      }, []);
    if (backwards) {
      cumulative = cumulative.reverse();
    }
    return cumulative;
  }

  return (
    <div className='w-[20%] h-full border-[#3E3D40]'>
      <div className='p-4 bg-[#27272B] h-full '>
        <div className='w-full justify-between flex text-white bg-[#27272B] mb-2'>
          <span>Price({market.split('-')[1]})</span>
          <span>Size({market.split('-')[0]})</span>
        </div>
        {orderbookData?.asks.map((order: any) => (
          <div
            className='relative h-[18px] w-full text-xs mb-0.5'
            key={order.price + ''}
          >
            <div
              className={`relative flex h-[18px] items-center justify-center bg-[#48282E]`}
              style={{ width: `${order.sizePercent}%` }}
            ></div>

            <span className='absolute left-2 top-0.5 text-gray-300'>
              {format(order.price)}
            </span>
            <span className='absolute right-0.5 top-0.5 text-gray-300'>
              {format(order.size)}
            </span>
          </div>
        ))}
        <span className='flex justify-center text-gray-300 text-xs py-3'>
          Spread {spread} ({spreadPercent}%)
        </span>
        {orderbookData?.bids.map((order: any) => (
          <div
            className='relative h-[18px] w-full text-xs mb-0.5'
            key={order.price + ''}
          >
            <div
              className={`relative flex h-[18px] items-center justify-center bg-[#353C2B]`}
              style={{ width: `${order.sizePercent}%` }}
            ></div>

            <span className='absolute left-2 top-0.5 text-gray-300'>
              {format(order.price)}
            </span>
            <span className='absolute right-0.5 top-0.5 text-gray-300'>
              {format(order.size)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderbook;
