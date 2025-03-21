import {fetchJournal} from '@/app/db/journal'

import Card from '@/app/ui/journals/card'

export default async function ListJournals() {
  const journals = await fetchJournal()
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {journals.map((journal) => (
        <Card key={journal.id} journal={journal} />
      ))}
    </div>
  )
}
