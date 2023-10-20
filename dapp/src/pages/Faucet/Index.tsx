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
  const onMint = async (esdtId: string) => {
    await sendMintTransaction(esdtId);
  };

  const getAssetLogo = (symbol: string) => {
    return ESDT_LIST.filter((item) => item.Symbol === symbol)[0].logo;
  };

  const fetchBalance = async () => {
    let faucetBalance: any = [];
    let myBalance: any = [];
    let balance = ESDT_LIST;
    setBalance(balance);
    axios
      .get(`https://devnet-gateway.multiversx.com/address/${address}/esdt`)
      .then((response) => {
        let esdts = response.data.data.esdts;
        ESDT_LIST.map((token) => {
          let ret = Object.keys(esdts).filter((i: any) => i === token.ESDT);
          console.log(ret);
          if (ret[0]) {
            // console.log()
            const merged = Object.assign(esdts[ret[0]], token);
            console.log('xxxx', merged);
            myBalance.push(merged);
          }
        });
        // console.log(myBalance);
        // setBalance(myBalance);
        if (myBalance.length > 0) {
          // setBalance(myBalance);
        }
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
          faucetBalance.push(merged);
        });
        console.log('000', faucetBalance);

        faucetBalance.forEach((item: any) => {
          console.log('2222myBalance', myBalance);

          // let ret = Object(myBalance).keys(esdts).filter((i: any) => i === item.ESDT);

          myBalance.forEach((y: any) => {
            if (item.ESDT == y.ESDT) {
              console.log('match');
              item['my'] = y;
            }
          });
          // console.log('2222', ret);
        });

        console.log(faucetBalance);

        setBalance(faucetBalance);
      })
      .catch((error) => {
        console.error(error);
      });
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
              <th>Mint Account</th>
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
                  <td>{format(item.balance / 10 ** 18)}</td>
                  <td>{item.my ? format(item.my.balance / 10 ** 18) : 0}</td>
                  <td>
                    <div className='flex flex-row  justify-end pr-20 '>
                      <button
                        className='bg-[#21F7DC] px-16 py-2 rounded text-black '
                        onClick={() => {
                          onMint(item.ESDT);
                        }}
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
