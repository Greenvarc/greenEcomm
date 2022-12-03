import Link from 'next/link'
import React from 'react'

function DropdownLink(props) {
    let {href,children,...rest}=props
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}

export default DropdownLink
