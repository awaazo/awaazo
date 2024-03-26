import * as React from 'react'
import type { SVGProps } from 'react'
const SvgTime = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 18" {...props}>
    <path fill="#fff" d="M9 18A9 9 0 1 0 9 0a9 9 0 0 0 0 18Z" />
    <path fill="#fff" d="M9 5.538V9l3.517 4.098" />
    <path stroke="#393939" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5.538V9l3.517 4.098" />
  </svg>
)
export default SvgTime
