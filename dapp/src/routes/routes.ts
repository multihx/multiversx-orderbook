import { RouteNamesEnum } from 'localConstants';
import { Dashboard, Home } from 'pages';
import { RouteType } from 'types';

import { Exchange } from 'pages/Exchange/Exchange';
import Faucet from 'pages/Faucet/Index';

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  },
  // {
  //   path: RouteNamesEnum.dashboard,
  //   title: 'Dashboard',
  //   component: Dashboard
  // },

  {
    path: "/exchange",
    title: 'Exchange',
    component: Exchange
  },
  {
    path: "/faucet",
    title: 'Faucet',
    component: Faucet
  }
];
