import JournalSummaries from '@/app/ui/dashboard/journal-summaries'

export default async function Page() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-3xl'>Summaries</h1>
      </div>
      <div className='max-w-7xl mx-auto mt-6'>
        <JournalSummaries />
      </div>
    </div>
  )
}
