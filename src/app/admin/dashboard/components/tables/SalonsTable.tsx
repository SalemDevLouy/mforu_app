import React from 'react'
import Link from 'next/link'
import { Button } from '@heroui/button'
import { ApiSalon } from '../../types'

interface SalonsTableProps {
  salons: ApiSalon[]
}

export default function SalonsTable({ salons }: Readonly<SalonsTableProps>) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-default-200">
          <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">اسم الصالون</th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">الموقع</th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">الهاتف</th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">المعرف</th>
          <th className="text-center py-3 px-4 text-sm font-semibold text-default-700">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {salons.map((s) => (
          <tr key={s.salon_id} className="border-b border-default-100 hover:bg-default-50 transition-colors">
            <td className="py-3 px-4">
              <p className="font-medium text-default-900">{s.name}</p>
              <p className="text-xs text-default-500">{s.owner?.name ?? '—'}</p>
            </td>
            <td className="py-3 px-4 text-sm text-default-700">{s.site ?? '—'}</td>
            <td className="py-3 px-4 text-sm text-default-700">{s.owner?.phone ?? '—'}</td>
            <td className="py-3 px-4 text-xs text-default-700 font-mono">{s.salon_id}</td>
            <td className="py-3 px-4">
              <div className="flex items-center justify-center gap-2">
                <Link href={`/admin/dashboard/accounting/${s.salon_id}`}>
                  <Button color="primary" size="sm" variant="flat">دخول</Button>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

