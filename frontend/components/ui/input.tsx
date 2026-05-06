'use client'

import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export default function Input({ label, error, className, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}

      <input
        className={clsx(
          'border px-3 py-2 rounded-md outline-none focus:ring',
          error && 'border-red-500',
          className
        )}
        {...props}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}