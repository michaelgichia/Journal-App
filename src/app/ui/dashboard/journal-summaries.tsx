'use client'

import {useEffect, useState} from 'react'
import {SummaryCardsSkeleton} from '@/app/ui/skeletons'
import {subYears} from 'date-fns'

import Datepicker from '@/app/ui/datepicker'
import SummariesCard from './summaries-card'
import {Search} from '@/app/ui/icons'

interface Summary {
  totalEntries: number
  avgWordCount: number
  mostUsedCategory: string
}

interface DateFilter {
  startAt: string | null
  endAt: string | null
}

export default function JournalSummaries() {
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startAt: subYears(new Date(), 1).toISOString(),
    endAt: new Date().toISOString(),
  })
  const [summary, setSummary] = useState<Summary>({
    totalEntries: 0,
    avgWordCount: 0,
    mostUsedCategory: '',
  })

  async function fetchSummary(
    startDate: string | null,
    endDate: string | null,
  ) {
    if (!startDate || !endDate) return
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

  useEffect(() => {
    const startDate = dateFilter.startAt
    const endDate = dateFilter.endAt
    fetchSummary(startDate, endDate).catch((error) =>
      console.error(error.message),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async () => {
    await fetchSummary(dateFilter.startAt, dateFilter.endAt)
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
        <div className='flex flex-col w-full justify-center'>
          <span>Start date</span>
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
        </div>
        <div className='flex flex-col w-full'>
          <span>End date</span>
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
        </div>
        <button onClick={handleSubmit} className='mt-4 h-14 w-14'>
          <span className='sr-only'>Search</span>
          <Search />
        </button>
      </div>
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
