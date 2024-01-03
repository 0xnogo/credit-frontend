export interface ToggleButtonData {
  display: string;
  value: number;
  route: string;
}

export const stakeRoutes: ToggleButtonData[] = [
  {
    display: '$CREDIT',
    value: 0,
    route: '/stake/credit',
  },
  {
    display: 'LP Pool',
    value: 1,
    route: '/stake/lp-pool',
  },
  {
    display: 'Genesis Token',
    value: 2,
    route: '/stake/genesis-token',
  },
];
