import {Calendar, MoreVertical} from '@/app/ui/icons'
import {format} from 'date-fns'

import {Journal} from '@/types/journal'

type IProp = {
  journal: Journal
}

const formattedDate = (createdAt: Date) =>
  format(createdAt, 'do MM yy')

export default async function StoreCard({journal}: IProp) {

  const optionsOpen = false
  return (
    <div className='bg-white rounded-md shadow-sm border border-[#f6f3ee] flex flex-col relative'>
      {/* Options Menu Button */}
      <div className='absolute top-3 right-3 z-10'>
        <button className='p-1 rounded-full hover:bg-gray-100'>
          <MoreVertical className='h-5 w-5 text-gray-500' />
        </button>

        {/* Dropdown Menu */}
        {optionsOpen && (
          <div className='absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20'>
            <button className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
              Edit
            </button>
            <button className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
              Delete
            </button>
            <button className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
              Share
            </button>
          </div>
        )}
      </div>

      <div className='p-6 flex-1'>
        <div className='text-left'>
          <h2 className='text-2xl font-medium mb-2 pr-8'>{journal.title}</h2>
          <p className='text-[#878e88]'>ID: {journal.id}</p>
        </div>
      </div>
      <div className='bg-gray-100 p-3 flex justify-between items-center rounded-b-md'>
        <div className='flex items-center text-[#878e88]'>
          <Calendar className='h-4 w-4 mr-2' />
          <span>Added {formattedDate(journal.createdAt)}</span>
        </div>
        <div className='text-[#878e88] font-medium'>{journal.category}</div>
      </div>
    </div>
  )
}
