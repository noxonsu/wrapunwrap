import FaIcon from "./FaIcon"
import { CHAIN_EXPLORER_LINK } from "/helpers/constants"

export default function BlockScanLink(options) {
  const {
    chainId,
    address,
    hash,
  } = options
  
  return (
    <>
      <style jsx>
        {`
          A {
            color: #a6c8f1;
          }
          A:hover {
            color: #FFFFFF;
          }
          span {
            margin-left: 10px;
            vertical-align: middle;
          }
        `}
      </style>
      <a href={CHAIN_EXPLORER_LINK({ chainId, address, hash})} target="_blank">
        {address || hash}
        <span>
          <FaIcon icon="UpRightFromSquare" />
        </span>
      </a>
    </>
  )
}