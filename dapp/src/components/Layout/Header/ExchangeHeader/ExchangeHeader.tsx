import MarketSelect from 'pages/Exchange/MarketSelect';
import { useEffect, useState } from "react";
import { useMarket } from "store";

export interface The24Hour {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

const MarketInfo = () => {
  const [change, setChange] = useState<string>("0");
  const [changePercent, setChangePercent] = useState<string>("0");
  const [low, setLow] = useState<string>("0");
  const [high, setHigh] = useState<string>("0");
  const { market } = useMarket();

  useEffect(() => {
    const base = market.split("-")[0]
    const quote = market.split("-")[1]
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${base}${quote}`)
      .then((response: Response) => {
        if (response.ok) {
          return response.json() as Promise<The24Hour>;
        } else {
          throw new Error('Request failed with status: ' + response.status);
        }
      })
      .then((data: The24Hour) => {
        setChange(data.priceChange)
        setChangePercent(data.priceChangePercent)
        setHigh(data.highPrice)
        setLow(data.lowPrice)
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [market])
  return (
    <div className="flex ml-5 gap-x-5">
      <div className="mr-4 flex flex-col items-start gap-y-2 text-right md:mr-6 md:gap-y-0">
        <p className="text-xs text-gray-500">24h change</p>
        <p className={`text-xs font-bold md:text-[14px] ${change.indexOf("-") ? "text-green-300" : "text-[#943940]"} `}>{Number(changePercent).toFixed(2)}%</p>
      </div>
      <div className="mr-2 flex flex-col items-start gap-y-2 text-right md:mr-6 md:gap-y-0">
        <p className="text-xs text-gray-500">24h low</p>
        <p className="text-xs font-bold md:text-[14px] text-gray-200">{Number(low).toFixed(2)}</p>
      </div>
      <div className="mr-4 flex flex-col items-start gap-y-2 text-right md:mr-6 md:gap-y-0">
        <p className="text-xs text-gray-500">24h High</p>
        <p className="text-xs font-bold md:text-[14px] text-gray-200">{Number(high).toFixed(2)}</p>
      </div>
      {/* <div className="mr-4 flex flex-col items-start gap-y-2 text-right md:mr-6 md:gap-y-0">
        <p className="text-xs text-gray-400">24h Volume</p>
        <p className="text-xs font-bold md:text-[14px] text-gray-200">+0.78</p>
      </div> */}
    </div>
  );
};

const ExchangeHeader = () => {
  return (
    <div className='flex flex-row w-full border-[#39275c]'>
      <MarketSelect  ></MarketSelect>
      <MarketInfo></MarketInfo>
    </div>
  )
}

export default ExchangeHeader