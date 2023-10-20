import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useState, useRef } from "react";
import { useMarket } from "store";

const ChartComponent = (props: any) => {
  const {
    data,
    colors: {
      backgroundColor = "#202020",
      lineColor = "#2962FF",
      textColor = "#B2B5BE",
      areaTopColor = "#3E3D40",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const { market } = useMarket();
  const chartContainerRef = useRef<any>(null);
  const chartInstanceRef = useRef<any>(null);
  const candleStickRef = useRef<any>(null);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const fetchKline = (symbol: string) => {
    const arr = symbol.split("-")
    fetch(`https://api.binance.com/api/v3/klines?symbol=${arr[0]}${arr[1]}&interval=4h`)
      .then((res) => res.json())
      .then((data) => {
        const candleStickData = data.map((d: any) => {
          return { time: d[0] / 1000, open: Number(d[1]), high: Number(d[2]), low: Number(d[3]), close: Number(d[4]) }
        })
        candleStickRef.current.setData(candleStickData)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchKline(market)
  }, [market])

  useEffect(() => {
    let { height } = getWindowDimensions();
    if (chartContainerRef.current) {
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
      };

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current?.clientWidth,
        height: height * 0.6,

        grid: {
          vertLines: {
            color: "#3E3D40",
          },
          horzLines: {
            color: "#3E3D40",
          },
        },
      });

      chartInstanceRef.current = chart;
      chart.timeScale().fitContent();
      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "black",
      });
      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "#27272B",
      });
      // Create the Main Series (Candlesticks)
      const mainSeries = chart.addCandlestickSeries();
      window.addEventListener("resize", handleResize);
      candleStickRef.current = mainSeries

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div className=" border-[#131722] border" ref={chartContainerRef} />;
};

const TradingView = () => {
  return (
    <div>
      <ChartComponent></ChartComponent>
    </div>
  );
};

export default TradingView;