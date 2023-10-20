import ethereum from "../assets/img/ethereum.svg";
import usdc from "../assets/img/usdc.svg";
import bitcoin from "../assets/img/bitcoin.svg"
import usdt from "../assets/img/usdt.svg";

export const contractAddress = {
  market: [
    {
      market: 'BTC-USDT',
      exchangeAddress:
        'erd1qqqqqqqqqqqqqpgqg3kvlulk7jqynhwhenc5ww9qq7tzdh4wymtst8wqaj',
      baseSymbol: 'BTC',
      quoteSymbol: 'USDT',
      baseESDT: 'BTC-2e6739',
      quoteESDT: 'USDT-fb47d0',
      logo: bitcoin
    },
    {
      market: 'ETH-USDT',
      exchangeAddress:
        'erd1qqqqqqqqqqqqqpgq5e4wry9el60qm8kvv5aqaa04jlf6x44vymtswz5sg4',
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
  faucetAddress: "erd1qqqqqqqqqqqqqpgqpe9kw7yydm6dl9l8g8p3c7y5ye6vmx0cymts6fr2te",
};
