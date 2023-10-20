import { useState } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';

import { refreshAccount, sendTransactions } from 'helpers';
import { useTrackTransactionStatus } from 'hooks/sdkDappHooks';
import { SessionEnum } from 'localConstants';
import { IPlainTransactionObject } from 'types/sdkCoreTypes';
import { getChainId } from 'utils/getChainId';
import { contractsMap } from 'utils/pairContract';
import { Address } from '@multiversx/sdk-core/out/address';
import { TokenTransfer } from '@multiversx/sdk-core/out/tokenTransfer';

import { contractAddress } from "config/config.contract"

export const useSendPairTransaction = (type: SessionEnum) => {
  const [pingPongSessionId, setPingPongSessionId] = useState(
    sessionStorage.getItem(type)
  );

  const transactionStatus = useTrackTransactionStatus({
    transactionId: pingPongSessionId ?? '0'
  });

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(pingPongSessionId ?? '');
  };

  type OrderInputParamsSimple = {
    amount: any
    match_provider: any
  }


  const getMarketCfg = (market: string) => {
    return contractAddress.market.filter(item => item.market === market)[0]
  }

  const sendCreateBuyOrder = async (market: string, amount: number, price: number) => {
    clearAllTransactions();

    const orderInputParamsSimple: OrderInputParamsSimple = {
      amount: Number(amount),
      match_provider: new Address("erd1qk4e0su5wx72yrmunxa5me0g4mx5xw025x77mzkeljnw9rzhymtshkdxtq"),
    };

    const smartContract = contractsMap.get(market);
    const tx = smartContract.methods
      .createBuyOrder([orderInputParamsSimple])
      .withGasLimit(60000000)
      .withChainID(getChainId())
      .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(getMarketCfg(market).quoteESDT, amount * price, 18))
      .buildTransaction()
      .toPlainObject();

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing creating buy order transaction',
        errorMessage: 'An error has occured during order creation',
        successMessage: 'Transaction successful'
      },
      redirectAfterSign: false
    });

    sessionStorage.setItem(type, sessionId);
    setPingPongSessionId(sessionId);
  };

  const sendCreateSellOrder = async (market: string, amount: number, price: number) => {
    console.log('sendCreateSellOrder', market, amount, price)
    clearAllTransactions();
    console.log('total', Number(amount * price))
    const orderInputParamsSimple: OrderInputParamsSimple = {
      amount: Number(amount * price),
      match_provider: new Address("erd1qk4e0su5wx72yrmunxa5me0g4mx5xw025x77mzkeljnw9rzhymtshkdxtq"),
    };

    const smartContract = contractsMap.get(market);
    const tx = smartContract.methods
      .createSellOrder([orderInputParamsSimple])
      .withGasLimit(60000000)
      .withChainID(getChainId())
      .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(getMarketCfg(market).baseESDT, amount.toString(), 18))
      .buildTransaction()
      .toPlainObject();

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing creating sell order transaction',
        errorMessage: 'An error has occured during order creation',
        successMessage: 'Transaction successful'
      },
      redirectAfterSign: false
    });

    sessionStorage.setItem(type, sessionId);
    setPingPongSessionId(sessionId);
  };

  return {
    sendCreateBuyOrder,
    sendCreateSellOrder,

    transactionStatus
  };
};
