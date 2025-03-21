import {notFound} from 'next/navigation'
import Link from 'next/link'
import {Calendar} from '@/app/ui/icons'
import {format} from 'date-fns'

import {fetchJournalById} from '@/app/db/journal'

const formattedDate = (createdAt: Date) => format(createdAt, 'do MMMM yyyy')

export default async function Page(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const id = params.id
  const journal = await fetchJournalById(id)

  if (!journal) {
    notFound()
  }

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-12 lg:px-24'>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/dashboard'
            className='text-sm text-gray-600 hover:text-gray-800 mb-4 inline-block'
          >
            ← Back to Journals
          </Link>
          <h1 className='text-4xl font-medium mb-4'>{journal.title}</h1>
          <div className='flex items-center text-gray-600 text-sm'>
            <span className='font-medium mr-4'>{journal.category}</span>
            <Calendar className='h-4 w-4 mr-1.5' />
            <span>{formattedDate(journal.createdAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div className='prose prose-lg max-w-none'>
          <p className='whitespace-pre-wrap'>{journal.content}</p>
        </div>
      </div>
    </main>
  )
}