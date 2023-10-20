import { useState } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { contractAddress } from 'config';
import { refreshAccount, sendTransactions } from 'helpers';
import { useTrackTransactionStatus } from 'hooks/sdkDappHooks';
import { SessionEnum } from 'localConstants';
import { IPlainTransactionObject } from 'types/sdkCoreTypes';
import { getChainId } from 'utils/getChainId';
import { smartContract } from 'utils/faucetContract';

export const useMintTransaction = (type: SessionEnum) => {
  // Needed in order to differentiate widgets between each other
  // By default sdk-dapp takes the last sessionId available which will display on every widget the same transaction
  // this usually appears on page refreshes
  const [pingPongSessionId, setPingPongSessionId] = useState(
    sessionStorage.getItem(type)
  );

  const mintTokenTransactionStatus = useTrackTransactionStatus({
    transactionId: pingPongSessionId ?? '0'
  });

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(pingPongSessionId ?? '');
  };

  const sendMintTransaction = async (amount?: string) => {
    clearAllTransactions();

    const pingTransaction = smartContract.methods
      .claim(["TEST-482984","3000000000000000000"])
      .withGasLimit(60000000)
      .withChainID(getChainId())
      .buildTransaction()
      .toPlainObject();

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing mint token transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Mint token transaction successful'
      },
      redirectAfterSign: false
    });

    sessionStorage.setItem(type, sessionId);
    setPingPongSessionId(sessionId);
  };

  return {
    sendMintTransaction,
    mintTokenTransactionStatus
  };
};
