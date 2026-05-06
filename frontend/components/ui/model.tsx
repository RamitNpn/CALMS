'use client'

import { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[500px] p-4 rounded-lg">
        <div className="flex justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose}>X</button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}