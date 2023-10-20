import { create } from 'zustand'
import { contractAddress } from '../config/config.contract';
const marketList = contractAddress.market

export interface Market {
    market: string,
    setMarket: (id: string) => void;
 
}

export const useMarket = create<Market>((set) => ({
    market: marketList[0].market,
    setMarket: (market: string) => set(() => ({ market: market })),
}))