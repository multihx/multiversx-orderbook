import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { contractAddress } from '../../config/config.contract'
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useMarket } from "store";

const MARKET_LIST = contractAddress.market

export default function MarketSelect() {
  const { market, setMarket } = useMarket()
  const getAssetLogo = (symbol: string) => {
    return MARKET_LIST.filter(item => item.baseSymbol === symbol)[0].logo
  }

  return (
    <div className="text-left z-10 flex flex-row">
      <div>
        <img
          className="h-8"
          src={getAssetLogo(market.split('-')[0])}
          alt=""
        />
      </div>
      <Menu as="div" className="relative inline-block text-right">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-[#27272B] bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {market}
            <ChevronDownIcon className="h-4 ml-4"></ChevronDownIcon>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y bg-[#27272B]  rounded-md   shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {MARKET_LIST.map((item) => {
                return (
                  <Menu.Item key={item.market}>
                    {({ active }) => (
                      <button onClick={() => { setMarket(item.market) }}
                        className={`${active ? "  text-white" : "text-gray-200"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <div
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          ></div>
                        ) : (
                          <div className="mr-2 h-5 w-5" aria-hidden="true" />
                        )}
                        {item.market}
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
