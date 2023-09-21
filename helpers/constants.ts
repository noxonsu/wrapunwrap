export const accountUnlockedStorageKey = 'ff-deploy-account-unlocked'

const WRAP_CONFIG = (typeof window !== 'undefined' && window.WRAP_CONFIG) ? window.WRAP_CONFIG : false

export const CURRENCIES = {
  ...((WRAP_CONFIG) ? {
    [`${WRAP_CONFIG?.native?.symbol}`] : {
      ...WRAP_CONFIG?.native
    }
  } : {})
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const MULTICALL_CONTRACTS = {
  ...((WRAP_CONFIG) ? {
    [`${WRAP_CONFIG?.network?.networkVersion}`]: WRAP_CONFIG?.network?.multicall
  } : {})
}

export const AVAILABLE_NETWORKS_INFO = [
  ...((WRAP_CONFIG) ? [{
    ...WRAP_CONFIG?.network,
    nativeCurrency: WRAP_CONFIG?.native,
  }] : []),
];

export const CHAIN_EXPLORER_LINK = (options) => {
  const {
    address,
    hash,
    chainId,
  } = options
  const chainInfo = CHAIN_INFO(chainId)
  if (chainInfo) {
    if (address) return `${chainInfo.blockExplorerUrls[0]}/address/${address}`
    if (hash) return `${chainId.blockExplorerUrls[0]}/tx/${hash}`
  } else {
    return ``
  }
}
export const CHAINS_LIST = (() => {
  const ret = Object.keys(AVAILABLE_NETWORKS_INFO).map((k) => {
    return {
      id: AVAILABLE_NETWORKS_INFO[k].networkVersion,
      title: AVAILABLE_NETWORKS_INFO[k].chainName,
    }
  })
  ret.unshift({
    id: 0,
    title: `Select Blockchain`,
  })
  return ret
})()

export const CHAIN_INFO = (chainId) => {
  const exists = AVAILABLE_NETWORKS_INFO.filter((chainInfo) => {
    return `${chainInfo.networkVersion}` == `${chainId}`
  })

  return exists.length
    ? exists[0]
    : {
      networkVersion: chainId,
      chainName: `Unknown`,
      nativeCurrency: {
        name: "Unknown",
        symbol: 'Unknown',
        decimals: 18
      }
    }
} 