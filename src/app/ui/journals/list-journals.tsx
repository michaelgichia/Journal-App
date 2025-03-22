import {fetchJournal} from '@/app/db/journal'
import {Journal} from '@/types/journal'
import Card from '@/app/ui/journals/card'

export default async function ListJournals() {
  const response = await fetchJournal()
  const journals = Array.isArray(response) ? response : []

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {journals.map((journal: Journal) => (
        <Card key={journal.id} journal={journal} />
      ))}
    </div>
  )
}
