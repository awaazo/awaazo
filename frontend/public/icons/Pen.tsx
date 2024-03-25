import * as React from 'react'
import type { SVGProps } from 'react'
const SvgPen = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 18" {...props}>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="m14.772 7.746 1.73-1.73c.497-.497.745-.745.886-1.009a2 2 0 0 0 0-1.878c-.14-.264-.389-.512-.886-1.01-.496-.496-.745-.744-1.009-.885a2 2 0 0 0-1.878 0c-.264.14-.512.389-1.01.886l-1.752 1.753a10.59 10.59 0 0 0 3.92 3.873ZM9.4 5.326l-6.652 6.652c-.425.425-.637.638-.777.9-.14.26-.199.555-.317 1.144l-.59 2.948c-.066.332-.099.499-.004.593.094.095.26.062.593-.005l2.948-.59c.59-.117.884-.176 1.145-.316s.474-.352.899-.777l6.67-6.67a12.595 12.595 0 0 1-3.915-3.878Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPen
