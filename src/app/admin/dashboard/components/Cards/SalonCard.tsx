import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { ApiSalon } from '../../types'

function getStatusColor(status?: string | null): "success" | "warning" | "danger" | "default" {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'نشط':
      return 'success'
    case 'inactive':
    case 'غير نشط':
      return 'danger'
    case 'pending':
    case 'معلق':
      return 'warning'
    default:
      return 'default'
  }
}

export default function SalonCard({ salon }: { salon: ApiSalon }) {
  const initials = salon.name
    ? salon.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
    : '?'

  return (
    <Card className="border border-default-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      {/* Colored top accent bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-primary to-primary/50 rounded-t-xl" />

      <CardBody className="p-5 space-y-4">
        {/* Header: avatar + name + status */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-default-900 truncate">
              {salon.name}
            </h3>
            <p className="text-xs text-default-400 mt-0.5 flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{salon.site ?? '—'}</span>
            </p>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={getStatusColor(salon.owner?.status)}
            className="flex-shrink-0"
          >
            {salon.owner?.status ?? '—'}
          </Chip>
        </div>

        <Divider />

        {/* Info rows */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-default-400 w-5 text-center">�</span>
            <span className="text-default-500">المالك:</span>
            <span className="text-default-700 font-medium">{salon.owner?.name ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-default-400 w-5 text-center">�📞</span>
            <span className="text-default-500">الهاتف:</span>
            <span className="text-default-700 font-medium">{salon.owner?.phone ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-default-400 w-5 text-center">🆔</span>
            <span className="text-default-500">المعرّف:</span>
            <span className="text-default-400 font-mono text-xs">{salon.salon_id}</span>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-5 pb-4 pt-0 gap-2">
        <Link href={`/admin/dashboard/accounting/${salon.salon_id}`} className="flex-1">
          <Button color="primary" size="sm" className="w-full font-medium">
            التقارير المالية
          </Button>
        </Link>

      </CardFooter>
    </Card>
  )
}
