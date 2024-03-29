import * as React from 'react'
import type { SVGProps } from 'react'
const SvgOneDot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 27 23" {...props}>
    <path
      fill="url(#Property_1=1_svg__a)"
      d="M0 18.524v-.003c.029-1.748.527-3.38 1.132-4.976 1.325-3.492 3.215-6.61 5.818-9.227 1.417-1.427 2.999-2.613 4.938-3.138 3.283-.889 6.606.75 7.52 4.252.533 2.04.025 3.916-1.153 5.606-.562.807-1.152 1.593-1.697 2.413-1.196 1.802-1.67 3.818-1.561 5.994.05.974-.267 1.773-1.028 2.307-1.473 1.03-3.442.087-3.806-1.726-.145-.72-1.185-2.334-2.469-2.334-1.285 0-2.255.38-2.851 2.402-.423 1.43-1.631 2.178-2.978 1.848C.755 21.67.291 20.822.09 19.759c-.074-.402-.062-.823-.09-1.235Z"
    />
    <path fill="url(#Property_1=1_svg__b)" d="M21.574 22.176c2.52 0 4.562-2.08 4.562-4.645 0-2.565-2.042-4.645-4.562-4.645-2.519 0-4.561 2.08-4.561 4.645 0 2.566 2.042 4.645 4.561 4.645Z" />
    <defs>
      <linearGradient id="Property_1=1_svg__a" x1={13.068} x2={5.303} y1={0.942} y2={27.071} gradientUnits="userSpaceOnUse">
        <stop offset={0.091} stopColor="#fff" />
        <stop offset={1} stopColor="#D1D9DE" />
      </linearGradient>
      <linearGradient id="Property_1=1_svg__b" x1={13.068} x2={5.303} y1={0.942} y2={27.071} gradientUnits="userSpaceOnUse">
        <stop offset={0.091} stopColor="#fff" />
        <stop offset={1} stopColor="#D1D9DE" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgOneDot
