import {
  setupWeb3,
  switchOrAddChain,
  onBlockchainChanged,
  doConnectWithMetamask,
  isMetamaskConnected,
  onWalletChanged,
  getConnectedAddress 
} from "/helpers/setupWeb3"
import { useEffect, useState } from "react"

const useWeb3 = (chainId) => {
  const [ isWalletConnecting, setIsWalletConnecting ] = useState(false)
  const [ activeWeb3, setActiveWeb3 ] = useState(false)
  const [ activeChainId, setActiveChainId ] = useState(false)
  const [ address, setAddress ] = useState(false)
  const [ isSwitchChain, setIsSwitchChain ] = useState(false)
  
  const initOnWeb3Ready = async () => {
    if (activeWeb3 && (`${activeChainId}` == `${chainId}`)) {
      activeWeb3.eth.getAccounts().then((accounts) => {
        setAddress(accounts[0] || false)
      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      if (_isConnected) {
        connectWeb3()
      } else {
        setAddress(false)
      }
    }
  }
  useEffect(() => {
    initOnWeb3Ready()
  }, [ activeWeb3 ])
  
  const onConnect = async () => {
    initOnWeb3Ready()
  }
  
  useEffect(() => {
    onWalletChanged(onConnect)    
    onBlockchainChanged((chainData) => {
      initOnWeb3Ready()
    })
  }, [])
  
  const connectWeb3 = async () => {
    doConnectWithMetamask({
      onBeforeConnect: () => { setIsWalletConnecting(true) },
      onSetActiveChain: setActiveChainId,
      onConnected: async (cId, web3) => {
        setIsWalletConnecting(false)
        setActiveWeb3((`${cId}` == `${chainId}`) ? web3 : false)
        if (!web3) {
          setAddress(await getConnectedAddress())
        }
      },
      onError: (err) => {
        setIsWalletConnecting(false)
      },
    })
  }
  
  const isConnected = () => {
    return address !== false
  }
  
  const switchChainId = (newChainId) => {
    setIsSwitchChain(true)
    switchOrAddChain(newChainId || chainId).then((isSwitched) => {
      setIsSwitchChain(false)
    })
  }
  
  return {
    isWalletConnecting,
    isConnected,
    isSwitchChain,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  }
}


export default useWeb3