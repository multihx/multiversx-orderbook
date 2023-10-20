import React, { useEffect, useState } from 'react';
import { SessionEnum } from 'localConstants';
import { useMintTransaction } from 'hooks/transactions/useSendFaucetTransaction';
import { contractAddress } from '../../config/config.contract';
import { useGetAccountInfo } from 'hooks';
import axios from 'axios';
import { format } from '../../utils/format';

const ESDT_LIST = contractAddress.ESDTList;
const Faucet = () => {
  const { address } = useGetAccountInfo();
  const [balance, setBalance] = useState<any>([]);

  const { sendMintTransaction, mintTokenTransactionStatus } =
    useMintTransaction(SessionEnum.abiPingPongSessionId);
  const onMint = async () => {
    await sendMintTransaction();
  };

  const getAssetLogo = (symbol: string) => {
    return ESDT_LIST.filter((item) => item.Symbol === symbol)[0].logo;
  };

  const fetchBalance = async () => {
    let addressBalance: any = [];
    let myBalance: any = [];

    axios
      .get(`https://devnet-gateway.multiversx.com/address/${address}/esdt`)
      .then((response) => {
        let esdts = response.data.data.esdts;
        ESDT_LIST.map((token) => {
          let ret = Object.keys(esdts).filter((i: any) => i === token.ESDT);
          const merged = Object.assign(esdts[ret[0]], token);
          myBalance.push(merged);
        });
        console.log(myBalance);
        // setBalance(myBalance);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(
        `https://devnet-gateway.multiversx.com/address/${contractAddress.faucetAddress}/esdt`
      )
      .then((response) => {
        let esdts = response.data.data.esdts;
        ESDT_LIST.map((token) => {
          let ret = Object.keys(esdts).filter((i: any) => i === token.ESDT);
          const merged = Object.assign(esdts[ret[0]], token);
          addressBalance.push(merged);
        });
        // console.log(myBalance);
        // setBalance(myBalance);
      })
      .catch((error) => {
        console.error(error);
      });


      
      myBalance.forEach(element => {

        console.log(element)
  
});

      // Object.assign(esdts[ret[0]], token);

  setBalance(myBalance);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className='w-full  bg-[#202020] pt-4'>
      <div className='px-20  '>
        <table className='table-auto w-full justify-start text-white  rounded-xl bg-[#000000]'>
          <thead className='h-8'>
            <tr className='text-left py-4 '>
              <th>
                <span className='ml-8'>Asset</span>
              </th>
              {/* <th>Mint Account</th> */}
              <th>My balance </th>
            </tr>
          </thead>
          <tbody className='mt-20 rounded-xl'>
            {balance.map((item: any) => {
              return (
                <tr className='bg-[#27272C] h-20 rounded-xl'>
                  <td>
                    <div className='flex flex-row items-center'>
                      <img
                        className='h-8 ml-6'
                        src={getAssetLogo(item.Symbol)}
                        alt=''
                      />
                      <span className='mx-4'>{item.Symbol}</span>
                    </div>
                  </td>
                  {/* <td>222</td> */}
                  <td>{format(item.balance / 10 ** 18)}</td>
                  <td>
                    <div className='flex flex-row  justify-end pr-20 '>
                      <button
                        className='bg-[#21F7DC] px-16 py-2 rounded text-black '
                        onClick={onMint}
                      >
                        Claim
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faucet;
