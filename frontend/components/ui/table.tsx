'use client'

import { ReactNode } from 'react'

type Column<T> = {
  header: string
  accessor: (row: T) => ReactNode
}

type Props<T> = {
  data: T[]
  columns: Column<T>[]
}

export default function Table<T>({ data, columns }: Props<T>) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="border p-2 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j} className="border p-2">
                {col.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}