import type { AppProps } from "next/app"
import Head from 'next/head'
import "/styles/anyswap.css"
import styles from "../styles/Home.module.css"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { getAssets } from "/helpers/"
import { getUnixTimestamp } from "../helpers/getUnixTimestamp"

import NotifyHolder from "../components/NotifyHolder"
import { useRef } from "react"

let confirmWindowOnConfirm = () => {}
let confirmWindowOnCancel = () => {}

const defaultConfirmWindowLabels = {
  title: `Message`,
  message: `Confirm`,
  ok: `Ok`,
  cancel: `Cancel`,
} 

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  /* Confirm window */
  const [ isConfirmWindowOpened, setIsConfirmWindowOpened ] = useState(false)
  const [ confirmWindowLabels, setConfirmWindowLabels ] = useState(defaultConfirmWindowLabels)
  const [ isConfirmWindowOk, setIsConfirmWindowOk ] = useState(false)


  const onConfirmWindowConfirm = () => {
    setIsConfirmWindowOpened(false)
    confirmWindowOnConfirm()
  }
  const onConfirmWindowCancel = () => {
    setIsConfirmWindowOpened(false)
    confirmWindowOnCancel()
  }
  const openConfirmWindow = (options = {}) => {
    const {
      onConfirm,
      onCancel,
    } = options

    console.log(options)
    confirmWindowOnConfirm = (onConfirm) ? onConfirm : () => {}
    confirmWindowOnCancel = (onCancel) ? onCancel : () => {}
    setIsConfirmWindowOk(options.isOk)
    setConfirmWindowLabels({
      title: options.title || defaultConfirmWindowLabels.title,
      message: options.message || defaultConfirmWindowLabels.message,
      ok: options.okLabel || defaultConfirmWindowLabels.ok,
      cancel: options.cancelLabel || defaultConfirmWindowLabels.cancel,
    })
    setIsConfirmWindowOpened(true)
  
  }
  /* -------------- */
  const notifyHolder = new NotifyHolder({})
  const addNotify = (msg, style = `info`) => {
    notifyHolder.addItem({
      msg,
      style,
      time: getUnixTimestamp(),
      utx: getUnixTimestamp(),
    })
  }

  const [ isConfigLoaded, setIsConfigLoaded ] = useState(false)
  const [ WRAP_CONFIG, SET_WRAP_CONFIG ] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.WRAP_CONFIG) {
      console.log('>> CFG LOADED')
      setIsConfigLoaded(true)
      SET_WRAP_CONFIG(window.WRAP_CONFIG)
    }
  }, [])
  return (
    <div>
      <Head>
        <title>{`Wrap / Unwrap tool`}</title>
        <script src={`/_MYAPP/config.js`} />
        <style global>
          {`
            .svg-inline--fa {
              display: var(inline-block);
              height: 1em;
              overflow: visible;
              vertical-align: -0.125em;
            }
            svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
              overflow: visible;
              box-sizing: content-box;
            }

            .someOwnClass {
              background: red;
            }
          `}
        </style>
      </Head>
      {!WRAP_CONFIG ? (
        <div>Loading</div>
      ) : (
        <Component
          {...pageProps }
          WRAP_CONFIG={WRAP_CONFIG}
          openConfirmWindow={openConfirmWindow}
          addNotify={addNotify}
        />
      )}
      {notifyHolder.render()}
      {/* ---- Confirm block ---- */}
      { isConfirmWindowOpened && (
        <div className={styles.confirmWindow}>
          <div>
            <h3>{confirmWindowLabels.title}</h3>
            <span>{confirmWindowLabels.message}</span>
            <div>
              <button className={`${styles.mainButton} primaryButton`} onClick={onConfirmWindowConfirm}>
                {confirmWindowLabels.ok}
              </button>
              {!isConfirmWindowOk && (
                <button className={`${styles.mainButton} primaryButton`} onClick={onConfirmWindowCancel}>
                  {confirmWindowLabels.cancel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApp;
