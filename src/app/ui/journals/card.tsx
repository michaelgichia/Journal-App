'use client'

import {Calendar, MoreVertical} from '@/app/ui/icons'
import {format} from 'date-fns'
import Link from 'next/link'
import {useState} from 'react'

import {deleteJournal} from '@/app/actions/journals'
import {Journal} from '@/types/journal'

type IProp = {
  journal: Journal
}

const formattedDate = (createdAt: Date) => format(createdAt, 'do MM yy')

export default function Card({journal}: IProp) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteJournal(journal.id)
      if (!result.success) {
        alert(result.message)
      }
    } catch (error: unknown) {
      console.error('Failed to delete journal:', error)
      alert('Failed to delete journal')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

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
          <button
            onClick={() => setShowConfirm(true)}
            className='block w-full text-left px-4 py-2 hover:bg-[#f6f3ee] text-red-600'
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black opacity-100 flex items-center justify-center z-50'>
          <div className='bg-white !opacity-100 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 z-100'>
            <h3 className='text-lg font-medium mb-4'>Delete Journal</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this journal? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => setShowConfirm(false)}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
