import { Card } from 'components/Card';
import { contractAddress } from 'config';
import { AuthRedirectWrapper } from 'wrappers';
import TradePanel from './TradePanel';
import Orderbook from './Orderbook';
import TradeForm from './TradeForm';
import ExchangeHeader from 'components/Layout/Header/ExchangeHeader/ExchangeHeader';
import Footer from './Footer';

export const Exchange = () => (
  // <AuthRedirectWrapper>
  <div className='flex flex-col w-full bg-[#202020]'>
    <div className='flex items-center justify-between bg-dark px-4 md:px-6 md:py-3 bg-[#202020] border border-[#1c1b1d]  w-full'>
      <div className='flex items-center text-gray-300 w-full'><ExchangeHeader></ExchangeHeader></div>
    </div>
    <div className='flex h-full flex-1 items-start'>
      <TradePanel></TradePanel>
      <Orderbook></Orderbook>
      <TradeForm></TradeForm>
    </div>
    <Footer></Footer>
  </div>
  // </AuthRedirectWrapper>
);
