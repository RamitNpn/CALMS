'use client'

import { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: { label: string; value: string }[]
}

export default function Select({ label, options, error, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}

      <select
        className={clsx('border px-3 py-2 rounded-md', error && 'border-red-500')}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}