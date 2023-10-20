// orderbook 
export interface OrderbookResp {
    code: number;
    data: string;
}


export interface OrderbookData {
    ask: Array<string[]>;
    bid: Array<string[]>;
}

 
export interface Asset {
    symbol: string;
    logo: string;
    address: string;
}

// open order
export interface OpenOrderResp {
    code: number;
    data: OpenOrderVo[];
}

export interface OpenOrderVo {
    address: string;
    amount: number;
    filled: number;
    price: number;
    seq: number;
    timestamp: number;
    side: number;
}

// trades
export interface TradeResp {
    code: number;
    data: TradeVo[];
}

export interface TradeVo {
    amount: number;
    maker: string;
    price: number;
    taker: string;
    side: number;
    timestamp: number;
}