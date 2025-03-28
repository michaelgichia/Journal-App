import {Inbox, TrendingUp, Layers} from '@/app/ui/icons'

const iconMap = {
  totalEntries: Inbox,
  mostUsedCategory: TrendingUp,
  avgWordCount: Layers,
}

export default function SummariesCard({
  title,
  value,
  type,
}: {
  title: string
  value: number | string
  type: 'totalEntries' | 'avgWordCount' | 'mostUsedCategory'
}) {
  const Icon = iconMap[type]

  return (
    <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
      <div className='flex p-4'>
        {Icon ? <Icon className='h-5 w-5 text-gray-700' /> : null}
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p className='truncate rounded-xl bg-white px-4 py-8 text-center text-2xl'>
        {value}
      </p>
    </div>
  )
}
