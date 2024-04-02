import * as React from 'react'
import type { SVGProps } from 'react'
const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 18" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1.017 2.017C0 3.034 0 4.67 0 7.943v2.314c0 3.273 0 4.91 1.017 5.926C2.034 17.2 3.67 17.2 6.943 17.2H14.4c.12 0 .18 0 .23-.002a3.471 3.471 0 0 0 3.368-3.369c.002-.05.002-.11.002-.229h-5.4a2.7 2.7 0 1 1 0-5.4H18v-.257c0-3.273 0-4.91-1.017-5.926C15.966 1 14.33 1 11.057 1H6.943C3.67 1 2.033 1 1.017 2.017ZM4.5 4.343a1.157 1.157 0 0 0 0 2.314h2.7a1.157 1.157 0 0 0 0-2.314H4.5Z"
      clipRule="evenodd"
    />
    <path stroke="currentColor" strokeLinecap="round" strokeWidth={2.314} d="M13.016 10.547h-.868" />
  </svg>
)
export default SvgWallet
