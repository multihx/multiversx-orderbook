import { create } from 'zustand'
import { contractAddress } from '../config/config.contract';
const marketList = contractAddress.market

export interface Market {
    market: string,
    account: string,
    baseWalletBalance: number;
    baseContractBalance: number;
    quoteWalletBalance: number;
    quoteContractBalance: number;
    setMarket: (id: string) => void;
    setAccount: (account: string) => void;
    setBaseWalletBalance: (balance: number) => void,
    setBaseContractBalance: (balance: number) => void,
    setQuoteWalletBalance: (balance: number) => void,
    setQuoteContractBalance: (balance: number) => void,
}

export const useMarket = create<Market>((set) => ({
    market: marketList[0].market,
    account: "",
    baseWalletBalance: 0,
    baseContractBalance: 0,
    quoteWalletBalance: 0,
    quoteContractBalance: 0,
    setMarket: (market: string) => set(() => ({ market: market })),
    setAccount: (account: string) => set(() => ({ account: account })),
    setBaseWalletBalance: (balance: number) => set(() => ({ baseWalletBalance: balance })),
    setBaseContractBalance: (balance: number) => set(() => ({ baseContractBalance: balance })),
    setQuoteWalletBalance: (balance: number) => set(() => ({ quoteWalletBalance: balance })),
    setQuoteContractBalance: (balance: number) => set(() => ({ quoteContractBalance: balance })),
}))