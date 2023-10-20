import ethereum from "../assets/img/ethereum.svg";
import usdc from "../assets/img/usdc.svg";
import bitcoin from "../assets/img/bitcoin.svg"
import usdt from "../assets/img/usdt.svg";

export const contractAddress = {
  market: [
    {
      market: 'BTC-USDT',
      exchangeAddress:
        'erd1qqqqqqqqqqqqqpgqapfmmkdnaj6wrud9lhjwf6tlhrm7lqkpymtsm4cnhl',
      baseSymbol: 'BTC',
      quoteSymbol: 'USDT',
      baseESDT: 'BTC-2e6739',
      quoteESDT: 'USDT-fb47d0',
      logo: bitcoin
    },
    {
      market: 'ETH-USDT',
      exchangeAddress:
        'erd1qqqqqqqqqqqqqpgqkhlsyzfucyggz65sex93g0l28upd5v06ymts7l47l4',
      baseSymbol: 'ETH',
      quoteSymbol: 'USDT',
      baseESDT: 'ETH-7fd852',
      quoteESDT: 'USDT-fb47d0',
      logo: ethereum
    }
  ],
  ESDTList: [
    {
      Symbol: "USDT",
      ESDT: 'USDT-fb47d0',
      logo: usdt,
    },
    {
      Symbol: "BTC",
      ESDT: 'BTC-2e6739',
      logo: bitcoin
    },
    {
      Symbol: "ETH",
      ESDT: 'ETH-7fd852',
      logo: ethereum
    },
  ],
  faucetAddress: "erd1qqqqqqqqqqqqqpgqn7rh8u0nm7g3eukf090uv0el9qasvex4ymtsj3s847",
};
