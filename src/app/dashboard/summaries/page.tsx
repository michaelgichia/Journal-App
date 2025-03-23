'use client'

import { useState } from 'react'
import { subYears } from 'date-fns'
import { DateFilter } from '@/types/journal'
import { useJournalSummaries } from '@/hooks/useJournalSummaries'

import JournalSummaries from '@/app/ui/dashboard/journal-summaries'
import EntriesFrequency from '@/app/ui/dashboard/journal-frequency'
import Datepicker from '@/app/ui/datepicker'
import CategoryPieChart from '@/app/ui/dashboard/category-distribution'
import WordCountTrendChart from '@/app/ui/dashboard/word-count-trends'
import SentimentSummaryChart from '@/app/ui/dashboard/sentiment-summary'

export default function Page() {
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startAt: subYears(new Date(), 1).toISOString(),
    endAt: new Date().toISOString(),
  })

  const {
    entries,
    categories,
    wordTrends,
    sentiments,
    summary,
    isLoading,
    error,
  } = useJournalSummaries(dateFilter)

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-3xl'>Summaries</h1>
      </div>

      <div className='flex flex-1 gap-4 p-4 bg-gray-50 rounded-sm mb-8 mt-4'>
        <div className='flex flex-col w-full justify-center'>
          <span>Start date</span>
          <Datepicker
            name='startAt'
            value={dateFilter.startAt || ''}
            onChange={(value) => {
              setDateFilter((prev) => ({
                ...prev,
                startAt: value || '',
              }))
            }}
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>End date</span>
          <Datepicker
            name='endAt'
            value={dateFilter.endAt || ''}
            onChange={(value) => {
              setDateFilter((prev) => ({
                ...prev,
                endAt: value || '',
              }))
            }}
          />
        </div>
      </div>

      <div className='max-w-7xl mx-auto mt-6'>
        <JournalSummaries loading={isLoading} summary={summary} />
      </div>

      <EntriesFrequency entries={entries} loading={isLoading} />

      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
        <CategoryPieChart categories={categories} loading={isLoading} />
        <WordCountTrendChart wordTrends={wordTrends} loading={isLoading} />
      </div>

      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
        <SentimentSummaryChart sentiments={sentiments} loading={isLoading} />
        <div /> {/** placeholder */}
      </div>
    </div>
  )
}
