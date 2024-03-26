import * as React from 'react'
import type { SVGProps } from 'react'
const SvgLike = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 19 18" {...props}>
    <path
      fill="currentColor"
      d="M9.624 17.846a32.933 32.933 0 0 1-5.695-4.697 12.103 12.103 0 0 1-2.727-4.551C.178 5.244 1.37 1.41 4.697.273c1.756-.58 3.667-.224 5.135.958 1.47-1.18 3.38-1.537 5.136-.958 3.327 1.138 4.527 4.97 3.503 8.325a12.109 12.109 0 0 1-2.711 4.551 33.235 33.235 0 0 1-5.696 4.697L9.84 18l-.216-.154Z"
    />
  </svg>
)
export default SvgLike
