import * as React from 'react'
import type { SVGProps } from 'react'
const SvgDots = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 18" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9h.009M9.009 9h.009M13.018 9h.009" />
  </svg>
)
export default SvgDots
