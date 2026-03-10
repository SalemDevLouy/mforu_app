import { Card } from '@heroui/react'

interface DashCardProps {
  title: string
  value: number
  icon?: string
}

export function DashCard({ title, value, icon }: Readonly<DashCardProps>) {
  return (
    <Card className="p-4 border-r-4 border-blue-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide"> {title}</p>
              <p className="text-2xl font-bold text-blue-600">{value}</p>
            </div>
            <span className="text-3xl">{icon}</span>
          </div>
    </Card>
  )
}
