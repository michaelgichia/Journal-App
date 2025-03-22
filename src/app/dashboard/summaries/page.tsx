'use client'

import {useState, useEffect} from 'react'
import {subYears} from 'date-fns'
import {CalendarDatum} from '@nivo/calendar'
import {Serie} from '@nivo/line'

import JournalSummaries from '@/app/ui/dashboard/journal-summaries'
import EntriesFrequency from '@/app/ui/dashboard/journal-frequency'
import Datepicker from '@/app/ui/datepicker'
import {Search} from '@/app/ui/icons'
import {CategoryDistribution, DateFilter, Summary} from '@/types/journal'
import CategoryPieChart from '@/app/ui/dashboard/category-distribution'
import WordCountTrendChart from '@/app/ui/dashboard/word-count-trends'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<CalendarDatum[]>([])
  const [categories, setCategories] = useState<CategoryDistribution[]>([])
  const [wordTrends, setWordTrends] = useState<Serie[]>([])
  const [summary, setSummary] = useState<Summary>({
    totalEntries: 0,
    avgWordCount: 0,
    mostUsedCategory: '',
  })
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startAt: subYears(new Date(), 1).toISOString(),
    endAt: new Date().toISOString(),
  })

  console.log({ wordTrends })


  useEffect(() => {
    const startDate = dateFilter.startAt
    const endDate = dateFilter.endAt
    fetchSummary(startDate, endDate).catch((error) =>
      console.error(error.message),
    )
    fetchEntriesFrequency(startDate, endDate).catch((error) =>
      console.error(error.message),
    )
    fetchCatsDistributions(startDate, endDate).catch((error) =>
      console.error(error.message),
    )
    fetchWordTrends(startDate, endDate).catch((error) =>
      console.error(error.message),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchCatsDistributions(
    startDate: string | null,
    endDate: string | null,
  ) {
    if (!startDate || !endDate) return
    setLoading(true)
    const res = await fetch(
      `/api/summary/category-distribution?startDate=${startDate}&endDate=${endDate}`,
    )
    if (!res.ok) {
      throw new Error('Failed to fetch summary')
    }
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  async function fetchEntriesFrequency(
    startDate: string | null,
    endDate: string | null,
  ) {
    if (!startDate || !endDate) return
    setLoading(true)
    const res = await fetch(
      `/api/summary/entry-frequency?startDate=${startDate}&endDate=${endDate}`,
    )
    if (!res.ok) {
      throw new Error('Failed to fetch summary')
    }
    const data = await res.json()
    setEntries(
      data.map(
        ({entrydate, entrycount}: {entrydate: string; entrycount: number}) => ({
          day: entrydate,
          value: entrycount,
        }),
      ),
    )
    setLoading(false)
  }

  async function fetchSummary(
    startDate: string | null,
    endDate: string | null,
  ) {
    if (!startDate || !endDate) return
    setLoading(true)
    const res = await fetch(
      `/api/summary/aggregates?startDate=${startDate}&endDate=${endDate}`,
    )
    if (!res.ok) {
      throw new Error('Failed to fetch summary')
    }
    const data = await res.json()
    setSummary(data)
    setLoading(false)
  }

  async function fetchWordTrends(
    startDate: string | null,
    endDate: string | null,
  ) {
    if (!startDate || !endDate) return
    setLoading(true)
    const res = await fetch(
      `/api/summary/word-count-trends?startDate=${startDate}&endDate=${endDate}`,
    )
    if (!res.ok) {
      throw new Error('Failed to fetch summary')
    }
    const data = await res.json()
    setWordTrends(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    await fetchSummary(dateFilter.startAt, dateFilter.endAt)
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
        <button onClick={handleSubmit} className='mt-4 h-14 w-14'>
          <span className='sr-only'>Search</span>
          <Search />
        </button>
      </div>
      <div className='max-w-7xl mx-auto mt-6'>
        <JournalSummaries loading={loading} summary={summary} />
      </div>
      <EntriesFrequency entries={entries} loading={loading} />
      <CategoryPieChart categories={categories} loading={loading} />
      <WordCountTrendChart wordTrends={wordTrends} loading={loading} />
    </div>
  )
}
