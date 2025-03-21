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

const formattedDate = (createdAt: Date) => format(createdAt, 'MMM do, yyyy')

export default function Card({journal}: IProp) {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteJournalWithId = deleteJournal.bind(null, journal.id)
  const [, formAction, isPending] = useActionState(deleteJournalWithId, {
    message: '',
    success: false,
  })

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative group min-h-[200px] flex flex-col'>
      {/* Options Menu Button */}
      <div className='absolute top-3 right-3 z-10 group/menu'>
        <button className='p-1 rounded-full hover:bg-gray-100'>
          <MoreVertical className='h-5 w-5 text-gray-500' />
        </button>

        {/* Dropdown Menu */}
        <div className='absolute -right-1 top-5 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 invisible group-hover/menu:visible'>
          <Link
            href={`/dashboard/journals/${journal.id}/edit`}
            className='block w-full text-left px-4 py-2 hover:bg-gray-50'
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
                className='block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 disabled:opacity-50'
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </PopConfirm>
          </form>
        </div>
      </div>

      <div className='flex-1'>
        <Link href={`/dashboard/journals/${journal.id}`}>
          <h2 className='text-xl font-medium text-gray-900 mb-2 pr-8 hover:text-teal-700'>
            {journal.title}
          </h2>
        </Link>
        <div>
          <p className='text-gray-600 text-sm line-clamp-4 mb-1'>{journal.content}</p>
          <Link
            href={`/dashboard/journals/${journal.id}`}
            className='text-sm text-teal-600 hover:text-teal-700 hover:underline underline-offset-4'
          >
            Read More
          </Link>
        </div>
      </div>

      <div className='flex items-center justify-between text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100'>
        <span className='font-medium'>{journal.category}</span>
        <div className='flex items-center'>
          <Calendar className='h-4 w-4 mr-1.5' />
          <span className='font-medium'>{formattedDate(journal.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
