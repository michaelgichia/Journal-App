import {Plus} from '@/app/ui/icons'
import Link from 'next/link'

export default async function Page() {
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-2xl'>Journals</h1>
      </div>
      <div className='mt-4 flex items-center justify-end gap-2 md:mt-8'>
        <Link
          href='/dashboard/journals/create'
          className='flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
        >
          <span className='hidden md:block'>Create Journal</span>{' '}
          <Plus className='h-5 md:ml-4' />
        </Link>
      </div>
    </div>
  )
}
