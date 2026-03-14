import { Card } from '@heroui/react'
import type { ReactNode } from 'react'

interface DashCardProps {
  title: string
  value: ReactNode
  icon?: ReactNode
}

export function DashCard({ title, value, icon }: Readonly<DashCardProps>) {
  return (
    <Card className="p-4 border-r-4 border-blue-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide"> {title}</p>
          <p className="text-2xl font-bold text-blue-600">{value}</p>
        </div>
        {icon ? <span className="text-3xl text-blue-500">{icon}</span> : null}
      </div>
    </Card>
  )
}
