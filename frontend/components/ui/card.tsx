'use client'

import { ReactNode } from 'react'

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {children}
    </div>
  )
}