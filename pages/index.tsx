import type { NextPage } from "next"

import FaIcon from "/components/FaIcon"
import { BigNumber } from 'bignumber.js'
import { useEffect, useState } from "react"
import useWeb3 from "/helpers/useWeb3"

import { CHAIN_INFO } from "/helpers/constants"
import callContractMethod from "/helpers/callContractMethod"

import fetchBalance from "/helpers/fetchBalance"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import { toWei, fromWei } from "/helpers/wei"
import WrapTokenAbi from "/contracts/WrapTokenAbi.json"

import { getAssets } from "/helpers/getAssets"

const addNotify = (msg, style) => {
  console.log('>>> NOTIFY', style, msg)
}

const parseError = (error) => {
  let metamaskError = false
  try {
    metamaskError = error.message.replace(`Internal JSON-RPC error.`,``)
    metamaskError = JSON.parse(metamaskError)
  } catch (e) {}
  const errMsg = (metamaskError && metamaskError.message) ? metamaskError.message : error.message
  return errMsg
}
const doWrap = (options) => {
  const {
    activeWeb3,
    chainId,
    wrapContract,
    amount
  } = options
  
  
}

const Wrap: NextPage = (props) => {
  const {
    WRAP_CONFIG
  } = props
  
  const TABS = {
    WRAP: 'WRAP',
    UNWRAP: 'UNWRAP'
  }


  const WORK_CHAIN_ID = WRAP_CONFIG?.network?.networkVersion
  const WRAP_CONTRACT = WRAP_CONFIG?.wrapContract

  const {
    isWalletConnecting,
    isConnected,
    isSwitchChain,
    address: connectedAddress,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  } = useWeb3(WORK_CHAIN_ID)
  
  const chain = CHAIN_INFO(WORK_CHAIN_ID)
  const [ activeTab, setActiveTab ] = useState(TABS.WRAP)

  const [ wrapContract, setWrapContract ] = useState(false)
  
  const [ error, setError ] = useState(false)
  const [ amount, setAmount ] = useState(0)
  
  const [ gasLimit, setGasLimit ] = useState(0)
  const [ gasPrice, setGasPrice ] = useState(0)
  const [ needForGas, setNeedForGas ] = useState(0)
  
  const [ needUpdate, setNeedUpdate ] = useState(false)

  useEffect(() => {
    const _v = new BigNumber(gasLimit).multipliedBy(gasPrice).toFixed(0)
    setNeedForGas(_v)
  }, [ gasLimit, gasPrice ])

  useEffect(() => {
    if (activeWeb3) {
      activeWeb3.eth.getGasPrice().then((price) => {
        setGasPrice(new BigNumber(price).multipliedBy(1.5).toString())
      }).catch((err) => {})
    }
  }, [ amount, activeWeb3 ])
  
  useEffect(() => {
    if (activeWeb3 && amount && Number(amount) > 0) {
      setError(false)
      callContractMethod({
        activeWeb3,
        contract: wrapContract,
        method: (activeTab == TABS.WRAP) ? 'deposit' : 'withdraw',
        args: (activeTab == TABS.WRAP) ? [] : [ toWei(amount, wrappedInfo.decimals).toString() ],
        weiAmount: (activeTab == TABS.WRAP) ? toWei(amount, chain.nativeCurrency.decimals).toString() : false,
        calcGasLimit: true
      }).then((answer) => {
        setGasLimit(answer)
      }).catch((err) => {
        setError(parseError(err))
      })
    }
  }, [ activeWeb3, amount ])
  
  const [ nativeBalance, setNativeBalance ] = useState(0)
  const [ wrappedInfo, setWrappedInfo ] = useState(false)
  
  useEffect(() => {
    if (activeWeb3 && WORK_CHAIN_ID && WRAP_CONTRACT) {
      const contract = new activeWeb3.eth.Contract(WrapTokenAbi, WRAP_CONTRACT)
      setWrapContract(contract)
    }
  }, [activeWeb3, WORK_CHAIN_ID, WRAP_CONTRACT])


  const _fetchBalance = () => {
    fetchBalance({
      chainId: WORK_CHAIN_ID,
      address: connectedAddress
    }).then((balance) => {
      setNativeBalance(balance)
    })
  }

  useEffect(() => {
    if (connectedAddress) {
      _fetchBalance()
    }
  }, [ connectedAddress ])

  const _fetchTokensListInfo = () => {
    fetchTokensListInfo({
      erc20list: [ WRAP_CONTRACT ],
      chainId: WORK_CHAIN_ID,
      balanceFor: connectedAddress
    }).then((info) => {
      setWrappedInfo(info[WRAP_CONTRACT])
    })
  }
  useEffect(() => {
    if (WORK_CHAIN_ID && WRAP_CONTRACT) {
      _fetchTokensListInfo()
    }
  }, [ WORK_CHAIN_ID, WRAP_CONTRACT, connectedAddress ])
  
  useEffect(() => {
    if (needUpdate) {
      setNeedUpdate()
      _fetchBalance()
      _fetchTokensListInfo()
    }
  }, [ needUpdate ])
  const [ isMax, setIsMax ] = useState(false)
  
  useEffect(() => {
    if (isMax && Number(amount) > 0 && Number(needForGas) > 0 && activeTab == TABS.WRAP) {
      setIsMax(false)
      const newAmount = fromWei(
          new BigNumber(
            toWei(amount, chain.nativeCurrency.decimals).toString()
          ).minus(needForGas).toString(),
          chain.nativeCurrency.decimals
        ).toString()

      setAmount(
        newAmount
      )
    } else {
      setIsMax(false)
    }
  }, [amount, isMax, needForGas, gasPrice, activeTab ])

  const handleSetMax = () => {
    if (activeTab == TABS.WRAP) {
      setAmount(fromWei(nativeBalance, chain.nativeCurrency.decimals).toString())
      setIsMax(true)
    } else {
      setAmount(fromWei(wrappedInfo.balanceOf, wrappedInfo.decimals).toString())
    }
  }
  
  
  const [ isSubmit, setIsSubmit ] = useState(false)
  
  const onSubmit = () => {
    setIsSubmit(true)
    callContractMethod({
      activeWeb3,
      contract: wrapContract,
      method: (activeTab == TABS.WRAP) ? 'deposit' : 'withdraw',
      args: (activeTab == TABS.WRAP) ? [] : [ toWei(amount, wrappedInfo.decimals).toString() ],
      weiAmount: (activeTab == TABS.WRAP) ? toWei(amount, chain.nativeCurrency.decimals).toString() : false,
      onSuccess: () => {
        setNeedUpdate(true)
        setIsSubmit(false)
      }
    }).then((answer) => { }).catch((err) => {
      setIsSubmit(false)
      console.log('>>> fail', err)
    })
  }

  useEffect(() => {
    setAmount(0)
  }, [ activeTab ])

  const needChangeChain = (`${activeChainId}` != `${WORK_CHAIN_ID}`) || !activeChainId

  const DESIGN = WRAP_CONFIG?.design
  const REDES = {
    'BODY': {
      'background-color': DESIGN?.bodyBgColor,
    },
    'H1, H2, BODY': {
      'color': DESIGN?.bodyFgColor,
    },
    '.header': {
      'background-color': DESIGN?.headBgColor,
    },
    'BUTTON.button': {
      'background-color': DESIGN?.buttonBgColor,
      'color': DESIGN?.buttonFgColor
    },
    'BUTTON.button:hover': {
      'background-color': DESIGN?.buttonHoverBgColor,
      'color': DESIGN?.buttonHoverFgColor
    },
    'BUTTON.button:disabled, BUTTON.button:disabled:hover': {
      'background-color': DESIGN?.buttonDisabledBgColor,
      'color': DESIGN?.buttonDisabledFgColor
    },
    '.cardHolder': {
      'background-color': DESIGN?.cardBgColor,
      'border-color': DESIGN?.cardBorderColor
    },
    '.tabsHolder BUTTON': {
      'background-color': DESIGN?.tabsBgColor,
      'color': DESIGN?.tabsFgColor
    },
    '.tabsHolder BUTTON:hover': {
      'background-color': DESIGN?.tabsHoverBgColor,
      'color': DESIGN?.tabsHoverFgColor
    },
    '.tabsHolder BUTTON.active': {
      'background-color': DESIGN?.tabsActiveBgColor,
      'color': DESIGN?.tabsActiveFgColor
    },
    '.tabsHolder BUTTON.active:hover': {
      'background-color': DESIGN?.tabsActiveBgColor,
      'color': DESIGN?.tabsActiveFgColor
    },
    '.balanceInfo': {
      'color': DESIGN?.infoColor,
    },
    '.errorHolder': {
      'color': DESIGN?.errorColor,
    },
    '.formHolder': {
      'border-color': DESIGN?.tabsBorderColor,
    }
  }
  let cssRules = ``

  Object.keys(REDES).forEach((selector) => {
    let selectorRules = []
    Object.keys(REDES[selector]).forEach((rule) => {
      if (REDES[selector][rule] !== undefined) {
        selectorRules.push(`${rule}: ${REDES[selector][rule]}`)
      }
    })
    cssRules = `
      ${cssRules}
      ${selector} {
        ${selectorRules.join(';')}
      }
    `;
  })

  return (
    <>
      {DESIGN && (
        <style>
          {`
            ${cssRules}
          `}
        </style>
      )}
      <div className="header">
        <div className="logoMenu">
          <a href={WRAP_CONFIG?.logoLink} className="logo">
            <img src={getAssets('logo.svg', 'logo')} />
          </a>
          {WRAP_CONFIG?.menuItems?.length > 0 && (
            <div className="menu">
              {WRAP_CONFIG.menuItems.map(({ title, href, active }, key) => {
                return (
                  <a key={key} href={(active) ? '' : href} className={(active) ? 'active' : ''}>{title}</a>
                )
              })}
            </div>
          )}
        </div>
        {connectedAddress && !needChangeChain ? (
          <button className="button">
            <FaIcon icon="wallet" />
            {connectedAddress.substr(0,4)}{`...`}{connectedAddress.substr(-4,4)}
          </button>
        ) : (
          <>
            {activeChainId && needChangeChain ? (
              <button className="button" onClick={() => { switchChainId() }}>
                <FaIcon icon="share-alt" />
                {`Switch network`}
              </button>
            ) : (
              <button className="button" onClick={() => { connectWeb3() }}>
                <FaIcon icon="wallet" />
                {`Connect`}
              </button>
            )}
          </>
        )}
      </div>
      <h1>
        {WRAP_CONFIG?.design?.title ||  `Wraper`}
      </h1>
      <div className="cardHolder">
        <div className="tabsHolder">
          <button
            className={activeTab == TABS.WRAP ? 'active' : ''}
            onClick={() => { setActiveTab(TABS.WRAP) }}
          >
            {`Wrap ${chain?.nativeCurrency?.symbol || 'ETH'}`}
          </button>
          <button
            className={activeTab == TABS.UNWRAP ? 'active' : ''}
            onClick={() => { setActiveTab(TABS.UNWRAP) }}
          >
            {`Unwrap w${chain?.nativeCurrency?.symbol || 'ETH'}`}
          </button>
        </div>
        <div className="formHolder">
          {connectedAddress && !needChangeChain ? (
            <>
              <div className="infoHolder">
                {activeTab == TABS.WRAP && (
                  <div className="balanceInfo">
                    {`Balance: `}
                    {Number(Number(fromWei(nativeBalance, chain.nativeCurrency.decimals)).toFixed(8))}
                    {` `}
                    {chain.nativeCurrency.symbol}
                  </div>
                )}
                {activeTab == TABS.UNWRAP && wrappedInfo && wrappedInfo.balanceOf && (
                  <div className="balanceInfo">
                    {`Balance: `}
                    {Number(Number(fromWei(wrappedInfo.balanceOf, wrappedInfo.decimals)).toFixed(8))}
                    {` `}
                    {wrappedInfo.symbol}
                  </div>
                )}
                {/*<TokenInfo deposit={action === 'deposit'} />*/}
              </div>
              <div className="inputHolder">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value) }}
                />
                <button className="button" onClick={handleSetMax}>
                  {`Set Max`}
                </button>
              </div>
              <div className="infoHolder">
                {needForGas && (
                  <div className="balanceInfo">
                    {`Fee: `}
                    {fromWei(new BigNumber(needForGas).toFixed(0), chain.nativeCurrency.decimals).toString()}
                    {` `}
                    {chain.nativeCurrency.symbol}
                  </div>
                )}
              </div>
              <div className="errorHolder">{error}</div>
              <div className="submitHolder">
                <button className="button" onClick={onSubmit} disabled={!amount || (Number(amount) == 0) || isSubmit || (error) ? true : false}>
                  {isSubmit ? (
                    <>
                      {activeTab == TABS.WRAP ? 'Wrapping...' : 'UnWrapping'}
                    </>
                  ) : (
                    <>
                      {activeTab == TABS.WRAP ? 'Wrap' : 'UnWrap'}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {activeChainId && needChangeChain ? (
                <>
                  <h2>
                    {`Switch network for `}
                    {activeTab == TABS.WRAP ? 'wrap' : 'unwrap'}
                    {` `}
                    {`${chain?.nativeCurrency?.symbol || 'ETH'}`}
                  </h2>
                  <div className="buttonHolder">
                    <button className="button" onClick={() => { switchChainId() }}>
                      <FaIcon icon="share-alt" />
                      {`Switch network`}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>
                    {`Connect your wallet for `}
                    {activeTab == TABS.WRAP ? 'wrap' : 'unwrap'}
                    {` `}
                    {`${chain?.nativeCurrency?.symbol || 'ETH'}`}
                  </h2>
                  <div className="buttonHolder">
                    <button className="button" onClick={() => { connectWeb3() }}>
                      <FaIcon icon="wallet" />
                      {`Connect`}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Wrap;
