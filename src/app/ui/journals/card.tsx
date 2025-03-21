'use client'

import {Calendar, MoreVertical} from '@/app/ui/icons'
import {format} from 'date-fns'
import Link from 'next/link'
import {useActionState, useState} from 'react'

import {deleteJournal} from '@/app/actions/journals'
import PopConfirm from '@/app/ui/pop-confirm'
import {Journal} from '@/types/journal'

type IProp = {
  journal: Journal
}

const formattedDate = (createdAt: Date) => format(createdAt, 'do MM yy')

export default function Card({journal}: IProp) {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteJournalWithId = deleteJournal.bind(null, journal.id)
  const [, formAction, isPending] = useActionState(deleteJournalWithId, {
    message: '',
    success: false,
  })

  return (
    <div className='bg-white rounded-md shadow-md border border-[#f6f3ee] flex flex-col relative group'>
      {/* Options Menu Button */}
      <div className='absolute top-3 right-3 z-10'>
        <button className='p-1 rounded-full hover:bg-[#f6f3ee] group-hover:opacity-100 opacity-0 transition-opacity'>
          <MoreVertical className='h-5 w-5 text-gray-500' />
        </button>

        {/* Dropdown Menu */}
        <div className='absolute -right-1 top-5 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 invisible group-hover:visible'>
          <Link
            href={`/dashboard/journals/${journal.id}/edit`}
            className='block w-full text-left px-4 py-2 hover:bg-[#f6f3ee]'
          >
            Edit
          </Link>
          <form action={formAction}>
            <PopConfirm
              title='Are you sure to delete the journal?'
              onCancel={() => setShowConfirm(false)}
              isOpen={showConfirm}
            >
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className='block w-full text-left px-4 py-2 hover:bg-[#f6f3ee] text-red-600 disabled:opacity-50'
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </PopConfirm>
          </form>
        </div>
      </div>

      <Link
        href={`/dashboard/journals/${journal.id}`}
        className='flex-1 flex flex-col'
      >
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
      </Link>
    </div>
  )
}
