import {SummaryCardsSkeleton} from '@/app/ui/skeletons'
import SummariesCard from './summaries-card'
import {JournalSummary} from '@/types/journal'

type IProps = {
  summary: JournalSummary
  loading: boolean
}

export default function JournalSummaries({summary, loading}: IProps) {
  if (loading)
    return (
      <div className='mb-8'>
        <SummaryCardsSkeleton />
      </div>
    )

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <SummariesCard
          title='Total Entries'
          value={summary?.totalEntries}
          type='totalEntries'
        />
        <SummariesCard
          title='Average Word Count'
          value={summary?.avgWordCount}
          type='avgWordCount'
        />
        <SummariesCard
          title='Most Use Category'
          value={summary?.mostUsedCategory}
          type='mostUsedCategory'
        />
      </div>
    </>
  )
}
