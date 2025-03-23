'use client'

import Link from 'next/link'
import {useActionState} from 'react'

import {createJournal, IState} from '@/app/actions/journals'
import {Button} from '@/app/ui/button'
import {Category} from '@/types/journal'

type IProps = {
  categories: Category[]
}

export default function Form({categories}: IProps) {
  const initialState: IState = {message: null, errors: {}, success: null}
  const [state, formAction, isPending] = useActionState(
    createJournal,
    initialState,
  )

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {state?.success && state?.message && (
          <div className='mb-4 p-4 rounded-md bg-green-50 text-green-700'>
            {state.message}
          </div>
        )}
        {!state?.success && state?.message && (
          <div className='mb-4 p-4 rounded-md bg-red-50 text-red-700'>
            {state.message}
          </div>
        )}
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
            maxLength={100}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white'
          />
          <div id='title-error' aria-live='polite' aria-atomic='true'>
            {state?.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='category' className='mb-2 block text-sm font-medium'>
            Select category
          </label>
          <select
            id='category'
            name='categoryId'
            required
            aria-describedby='category-error'
            className='peer block w-full px-4 py-2.5 cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white placeholder:text-gray-500'
          >
            <option value='' disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div id='category-error' aria-live='polite' aria-atomic='true'>
            {state?.errors?.categoryId &&
              state.errors.categoryId.map((error: string) => (
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
              required
              maxLength={5000}
              rows={10}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 bg-white'
            />
          </div>
          <div id='content-error' aria-live='polite' aria-atomic='true'>
            {state?.errors?.content &&
              state.errors.content.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
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
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Creating Journal...' : 'Create Journal'}
        </Button>
      </div>
    </form>
  )
}
