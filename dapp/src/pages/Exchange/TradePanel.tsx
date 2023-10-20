import TradingView from './TradingView';
import TradeTable from './TradeTable';

const TradePanel = () => {
  return (
    <div className='flex h-full w-[60%] flex-col  overflow-y-hidden     border-gray-btn bg-gray-bg  border-r border-[#3E3D40]  '>
      <div className='h-[62%] bg-[#27272B]'>{<TradingView></TradingView>}</div>
      <div className='flex-1 bg-[#27272B] p-3 z-30 '>
        <TradeTable></TradeTable>
      </div>
    </div>
  );
};

export default TradePanel;
