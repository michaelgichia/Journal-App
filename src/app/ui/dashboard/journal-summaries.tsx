'use client'

import {useEffect, useState} from 'react'
import {SummaryCardsSkeleton} from '@/app/ui/skeletons'

import Datepicker from '@/app/ui/datepicker'
import SummariesCard from './summaries-card'

interface Summary {
  totalEntries: number
  avgWordCount: number
  mostUsedCategory: string
}

interface DateFilter {
  startAt: string | null
  endAt: string | null
}

export default function JournalSummaries({
  dateRange,
}: {
  dateRange: {startDate: Date; endDate: Date}
}) {
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startAt: null,
    endAt: null,
  })
  const [summary, setSummary] = useState<Summary>({
    totalEntries: 0,
    avgWordCount: 0,
    mostUsedCategory: '',
  })

  useEffect(() => {
    async function fetchSummary() {
      const startDate = dateRange.startDate.toISOString()
      const endDate = dateRange.endDate.toISOString()
      setLoading(true)
      const res = await fetch(
        `/api/summary/aggregates?startDate=${startDate}&endDate=${endDate}&userId=31e907cd-b8e4-4a19-a0b2-10ef22d8b4d1`,
      )
      if (!res.ok) {
        throw new Error('Failed to fetch summary')
      }
      const data = await res.json()
      setSummary(data)
      setLoading(false)
    }
    fetchSummary().catch((error) => console.error(error.message))
  }, [dateRange])

  const handleSubmit = () => {
    console.log('HELLO', dateFilter)
    return
  }

  if (loading)
    return (
      <div className='mb-8'>
        <SummaryCardsSkeleton />
      </div>
    )

  return (
    <>
      <div className='flex flex-1 gap-4 p-4 bg-gray-50 rounded-sm mb-8'>
        <Datepicker
          name='startAt'
          value={dateFilter.startAt}
          onChange={(value) => {
            setDateFilter((prev) => ({
              ...prev,
              startAt: value,
            }))
          }}
        />
        <Datepicker
          name='endAt'
          value={dateFilter.endAt}
          onChange={(value) => {
            setDateFilter((prev) => ({
              ...prev,
              endAt: value,
            }))
          }}
        />
        <button onClick={handleSubmit}>submit</button>
      </div>

      <div className='grid gap-6 sm:grid-cols-3 grid-cols-3 mb-8'>
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
