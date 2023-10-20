import React from 'react'
import { SessionEnum } from 'localConstants';
import { useGetPendingTransactions, useSendPingPongTransaction, useSendTransaction } from 'hooks';

const MyTest = () => {
  const {
    sendTransactionFromAbi,

    transactionStatus
  } = useSendTransaction(SessionEnum.abiPingPongSessionId);

  const onSendTransaction = async () => {
    await sendTransactionFromAbi('10');
  };


  return (
    <div><button onClick={onSendTransaction}>send tx</button></div>
  )
}

export default MyTest