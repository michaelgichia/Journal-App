'use client'

import {ReactNode} from 'react'
import {Button} from '@/app/ui/button'

type PopConfirmProps = {
  title: string
  onCancel: () => void
  isOpen: boolean
  children: ReactNode
}

export default function PopConfirm({
  title,
  onCancel,
  isOpen,
  children,
}: PopConfirmProps) {
  if (!isOpen) return children

  return (
    <div className='relative inline-block'>
      {children}
      <div className='absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50'>
        <p className='text-sm mb-3'>{title}</p>
        <div className='flex justify-between gap-2'>
          <button
            onClick={onCancel}
            className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded !h-8'
          >
            Back
          </button>
          <Button className='!h-8' type='submit' variant='danger'>Confirm</Button>
        </div>
      </div>
    </div>
  )
}
