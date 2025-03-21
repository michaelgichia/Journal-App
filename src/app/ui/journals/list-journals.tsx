import {fetchJournal} from '@/app/db/journal'

import Card from '@/app/ui/journals/card'

export default async function ListJournals() {
  const journals = await fetchJournal()
  console.log('[[journals]]', journals)

  return (
    <div className='mt-6 flow-root'>
      {journals.map((journal) => (
        <Card key={journal.id} journal={journal} />
      ))}
    </div>
  )
}
