import * as React from 'react'
import type { SVGProps } from 'react'
const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 18 18" {...props}>
    <path fill="#fff" d="M13.404 2.702C11.447-.9 6.553-.9 4.596 2.702L.688 9.9C-1.268 13.5 1.178 18 5.092 18h7.816c3.913 0 6.36-4.5 4.404-8.101l-3.908-7.197Z" />
    <path
      fill="#393939"
      d="M7.983 6.476c0-.497.38-.9.847-.9.468 0 .848.403.848.9v.9l-.382 4.054a.48.48 0 0 1-.466.448.48.48 0 0 1-.465-.448l-.382-4.054v-.9ZM9.678 13.678c0 .498-.38.9-.848.9-.468 0-.847-.402-.847-.9 0-.497.38-.9.847-.9.468 0 .848.403.848.9Z"
    />
  </svg>
)
export default SvgWarning
