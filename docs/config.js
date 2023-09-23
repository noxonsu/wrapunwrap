window.WRAP_CONFIG = {
  native: {
    name: 'XZO',
    symbol: 'XZO',
    decimals: 18
  },
  network: {
    slub: 'xzo_mainnet',
    chainName: 'Exzo Network',
    chainId: '0x4CD',
    networkVersion: 1229,
    rpcUrls: ['https://evm.exzo.network'],
    blockExplorerUrls: ['https://evm.exzoscan.io/'],
    multicall: '0x2250191beF1EC106CFbAdbE9f3E926B7066a94d7',
  },
  wrapContract: `0xb48344E930106cED3413BA69669CaD8b6DD4e1A5`,
  logoLink: 'https://bridge.exzo.network/',
  menuItems: [
    {
      title: 'Router',
      href: 'https://bridge.exzo.network/#/v2/mergeswap'
    },
    {
      title: 'Pool',
      href: 'https://bridge.exzo.network/#/pool'
    },
    {
      title: 'Wrap/Unwrap',
      href: '#',
      active: true
    }
  ],
  design: {
    title: 'Wrap / UnWrap XZO',
    /*
    bodyBgColor: 'gray',
    bodyFgColor: 'red',
    headBgColor: 'green',
    buttonBgColor: 'red',
    buttonFgColor: 'white',
    buttonHoverBgColor: 'pink',
    buttonHoverFgColor: 'green',
    buttonDisabledBgColor: 'gray',
    buttonDisabledFgColor: 'red',
    cardBgColor: 'blue',
    cardBorderColor: 'pink',
    tabsBorderColor: 'red',
    tabsActiveBgColor: 'green',
    tabsActiveFgColor: 'red',
    tabsHoverBgColor: 'pink',
    tabsHoverFgColor: 'red',
    tabsBgColor: 'red',
    tabsFgColor: 'blue',
    infoColor: 'pink',
    errorColor: 'white'
    */
  }
}