'use client'

import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({
  children,
  loading,
  variant = 'primary',
  className,
  ...props
}: Props) {
  return (
    <button
      disabled={loading || props.disabled}
      className={clsx(
        'px-4 py-2 text-[13px] rounded font-medium transition',
        variant === 'primary' && 'bg-black text-white',
        variant === 'secondary' && 'bg-gray-200 text-black',
        variant === 'danger' && 'bg-red-600 text-white',
        'disabled:opacity-50',
        className
      )}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}