import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"
import FaIcon from "./FaIcon"
import iconButton from "./iconButton"
import isEvmAddress from "/helpers/isEvmAddress"
import { CHAIN_EXPLORER_LINK } from "/helpers/constants"

export default function AddressList(options) {
  const {
    labelEmpty,
    labelAddItem,
    chainId,
    onChange,
    buttons
  } = {
    buttons: null,
    ...options
  }

  const [ items, setItems ] = useState(options?.items ? [ ...options.items] : [])

  useEffect(() => {
    if (onChange) onChange(items)
  }, [items])

  const onAddItem = () => {
    items.push(``)
    setItems([...items])
  }
  
  const onChangeItem = (index, value) => {
    items[index] = value
    setItems([...items])
  }
  
  const onRemoveItem = (index) => {
    items.splice(index,1)
    setItems([...items])
  }
  
  return (
    <>
      <style jsx>
      {`
        .adminList {
          width: 100%;
        }
        .adminList UL {
          display: block;
          padding: 0px;
          list-style: none;
          margin: 0px;
        }
        .adminList UL LI {
          display: flex;
        }
        .adminList UL LI INPUT.hasError {
          background: #eeadad;
        }
        .adminList .actions {
          text-align: right;
          padding-top: 5px;
        }
        .adminList .empty {
          font-weight: bold;
          padding: 5px;
          text-align: center;
          border: 1px solid #FFF;
        }
      `}
      </style>
      <div className="adminList">
        {items.length > 0 ? (
          <ul>
            {items.map((item, itemIndex) => {
              return (
                <li key={itemIndex}>
                  <input type="text"
                    value={items[itemIndex]}
                    onChange={(e) => { onChangeItem(itemIndex, e.target.value) }}
                    className={(!isEvmAddress(items[itemIndex])) ? `hasError` : ``}
                  />
                  {iconButton({
                    icon: 'UpRightFromSquare',
                    title: 'Show in block explorer',
                    href: CHAIN_EXPLORER_LINK({ chainId, address: items[itemIndex] }),
                    disabled: !isEvmAddress(items[itemIndex]),
                    target: `_blank`
                  })}
                  {iconButton({
                    icon: `remove`,
                    title: `Remove item`,
                    onClick: () => { onRemoveItem(itemIndex) }
                  })}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="empty">{labelEmpty ? labelEmpty : `List is empty`}</div>
        )}
        <div className="actions">
          {buttons}
          <a className={styles.buttonWithIcon} onClick={onAddItem}>
            <FaIcon icon="add" />
            {labelAddItem ? labelAddItem : `Add new item`}
          </a>
        </div>
      </div>
    </>
  )
}