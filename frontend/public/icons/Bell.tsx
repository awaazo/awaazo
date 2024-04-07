import * as React from 'react'
import type { SVGProps } from 'react'
const SvgBell = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 19" {...props}>
    <path
      fill="#currentColor"
      fillRule="evenodd"
      d="M9.142 14.164c4.738 0 6.93-.608 7.141-3.048 0-2.438-1.528-2.281-1.528-5.272 0-2.337-2.215-4.995-5.613-4.995-3.4 0-5.614 2.658-5.614 4.995C3.528 8.835 2 8.678 2 11.116c.213 2.45 2.404 3.048 7.142 3.048Z"
      clipRule="evenodd"
    />
    <path stroke="#currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.375} d="M11.15 16.692c-1.146 1.273-2.934 1.288-4.091 0" />
  </svg>
)
export default SvgBell
