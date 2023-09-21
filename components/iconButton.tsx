import FaIcon from "./FaIcon"
import styles from "../styles/Home.module.css"

export default function iconButton(options) {
  const {
    href,
    title,
    icon,
    onClick,
    target,
    disabled
  } = {
    href: ``,
    title: ``,
    disabled: false,
    icon: `up-right-from-square`,
    onClick: () => {},
    ...options,
  }

  const aAttrs = {
    className: `${styles.iconButton} ${(disabled) ? 'disabled' : ''}`,
    alt: title,
    title,
  }
  if (href && !disabled) aAttrs.href = href
  if (target) aAttrs.target = target
 
  return (
    <>
      <style jsx>
        {`
          .disabled {
            background: #414141;
            color: #888484;
          }
        `}
      </style>
      <a {...aAttrs} onClick={(disabled) ? () => {} : onClick}>
        <FaIcon icon={icon} />
      </a>
    </>
  )
}