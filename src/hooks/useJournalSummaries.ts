import {useState, useEffect} from 'react'
import {DateFilter, JournalSummariesResponse} from '@/types/journal'

const SUMMARY_APIS = {
  entryFrequency: '/api/summary/entry-frequency',
  categoryDistribution: '/api/summary/category-distribution',
  aggregates: '/api/summary/aggregates',
  wordCountTrends: '/api/summary/word-count-trends',
  sentimentSummary: '/api/summary/sentiment-summary',
} as const

const buildQueryParams = (dateFilter: DateFilter) =>
  `?startDate=${dateFilter.startAt || ''}&endDate=${dateFilter.endAt || ''}`

export const useJournalSummaries = (
  dateFilter: DateFilter,
): JournalSummariesResponse => {
  const [data, setData] = useState<
    Omit<JournalSummariesResponse, 'isLoading' | 'error'>
  >({
    entries: [],
    categories: [],
    wordTrends: [],
    sentiments: [],
    summary: {
      totalEntries: 0,
      avgWordCount: 0,
      mostUsedCategory: '',
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const queryParams = buildQueryParams(dateFilter)

        // Fetch all data in parallel
        const [
          entriesRes,
          categoriesRes,
          summaryRes,
          wordTrendsRes,
          sentimentsRes,
        ] = await Promise.all([
          fetch(`${SUMMARY_APIS.entryFrequency}${queryParams}`),
          fetch(`${SUMMARY_APIS.categoryDistribution}${queryParams}`),
          fetch(`${SUMMARY_APIS.aggregates}${queryParams}`),
          fetch(`${SUMMARY_APIS.wordCountTrends}${queryParams}`),
          fetch(`${SUMMARY_APIS.sentimentSummary}${queryParams}`),
        ])

        // Parse responses independently, handling errors for each endpoint
        const parseResponse = async (response: Response, endpoint: string) => {
          if (!response.ok) {
            console.error(`Failed to fetch ${endpoint}: ${response.statusText}`)
            return null
          }
          try {
            return await response.json()
          } catch (err) {
            console.error(`Failed to parse ${endpoint} response:`, err)
            return null
          }
        }

        const [
          entriesData,
          categoriesData,
          summaryData,
          wordTrendsData,
          sentimentsData,
        ] = await Promise.all([
          parseResponse(entriesRes, 'entry frequency'),
          parseResponse(categoriesRes, 'category distribution'),
          parseResponse(summaryRes, 'aggregates'),
          parseResponse(wordTrendsRes, 'word count trends'),
          parseResponse(sentimentsRes, 'sentiment summary'),
        ])

        // Transform entries data if available
        const transformedEntries = entriesData?.map(
          ({
            entrydate,
            entrycount,
          }: {
            entrydate: string
            entrycount: number
          }) => ({
            day: entrydate,
            value: entrycount,
          }),
        ) || []

        // Update state with available data
        setData({
          entries: transformedEntries,
          categories: categoriesData || [],
          wordTrends: wordTrendsData || [],
          sentiments: sentimentsData || [],
          summary: summaryData || {
            totalEntries: 0,
            avgWordCount: 0,
            mostUsedCategory: '',
          },
        })
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('An error occurred')
        console.error(error.message)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaries()
  }, [dateFilter])

  return {
    ...data,
    isLoading,
    error,
  }
}
