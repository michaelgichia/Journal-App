'use client'

import Link from 'next/link'
import {useActionState} from 'react'

import {createJournal, IState} from '@/app/actions/journals'
import {Button} from '@/app/ui/button'

export default function Form() {
  const initialState: IState = {message: null, errors: {}}
  const [state, formActions] = useActionState<IState | undefined>(
    createJournal,
    initialState,
  )

  return (
    <form action={formActions}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <div className='mb-4'>
          <label htmlFor='title' className='block text-sm font-medium mb-2'>
            Title
          </label>
          <input
            id='title'
            name='title'
            type='text'
            placeholder='Enter title'
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='category' className='mb-2 block text-sm font-medium'>
            Select category
          </label>
          <select
            id='category'
            name='categoryId'
            aria-describedby='category-error'
            className='peer block w-full px-4 py-2.5 cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white placeholder:text-gray-500'
          >
            <option value='' disabled>
              Select a category
            </option>
          </select>
          <div id='journal-error' aria-live='polite' aria-atomic='true'>
            {state?.errors?.journalId &&
              state.errors.journalId.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='content' className='mb-2 block text-sm font-medium'>
            Content
          </label>
          <div className='relative mt-2 rounded-md'>
            <textarea
              id='content'
              name='content'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white'
            />
          </div>
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancel
        </Link>
        <Button type='submit'>Create Journal</Button>
      </div>
    </form>
  )
}
