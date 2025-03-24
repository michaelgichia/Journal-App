import {fetchJournal} from '@/app/db/journal'
import {Journal} from '@/types/journal'
import Card from '@/app/ui/journals/card'

export default async function ListJournals() {
  const response = await fetchJournal()
  const journals = Array.isArray(response) ? response : []

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {journals.length > 0 &&
          journals.map((journal: Journal) => (
            <Card key={journal.id} journal={journal} />
          ))}
      </div>
      {journals.length === 0 && (
        <div className='h-[400px] w-full w-full flex items-center justify-center'>
          <p className='text-gray-500'>
            <span>No journals available. Create a journal and it will appear here.</span>
          </p>
        </div>
      )}
    </>
  )
}
