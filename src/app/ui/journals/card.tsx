import {Calendar, MoreVertical} from '@/app/ui/icons'
import {format} from 'date-fns'
import Link from 'next/link'

import {Journal} from '@/types/journal'

type IProp = {
  journal: Journal
}

const formattedDate = (createdAt: Date) => format(createdAt, 'do MM yy')

export default function Card({journal}: IProp) {
  return (
    <div className='bg-white rounded-md shadow-md border border-[#f6f3ee] flex flex-col relative'>
      {/* Options Menu Button */}
      <div className='absolute top-3 right-3 z-10 group'>
        <button className='p-1 rounded-full hover:bg-[#f6f3ee]'>
          <MoreVertical className='h-5 w-5 text-gray-500' />
        </button>

        {/* Dropdown Menu */}
        <div className='absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 invisible group-hover:visible'>
          <Link
            href={`/dashboard/journals/${journal.id}/edit`}
            className='block w-full text-left px-4 py-2 hover:bg-[#f6f3ee]'
          >
            Edit
          </Link>
          <button className='block w-full text-left px-4 py-2 hover:bg-[#f6f3ee]'>
            Delete
          </button>
        </div>
      </div>

      <div className='p-6 flex-1 flex min-h-[160px]'>
        <h2 className='text-2xl font-medium mb-2 pr-8'>{journal.title}</h2>
      </div>
      <div className='bg-[#f6f3ee] p-3 flex justify-between items-center rounded-b-md text-sm'>
        <div className='text-zinc-700 font-medium'>{journal.category}</div>
        <div className='flex items-center text-zinc-700'>
          <Calendar className='h-3 w-3 mr-1.5' />
          <span>{formattedDate(journal.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
