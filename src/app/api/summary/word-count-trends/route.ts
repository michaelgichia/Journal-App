/**
 * Word Count Trends API Route
 *
 * This route provides word count analytics for journal entries over time.
 * It calculates the total word count for each day's entries, enabling
 * visualization of writing patterns and volume trends.
 *
 * @module word-count-trends
 */

import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'

/**
 * Represents a single data point in the word count trend
 * @typedef {Object} WordCountTrend
 * @property {string} x - The date of the entries
 * @property {number} y - The total word count for that date
 */
type WordCountTrend = {
  x: string
  y: number
}

/**
 * Represents a series of word count trends for visualization
 * @typedef {Object} WordCountSeries
 * @property {string} id - The identifier for the series
 * @property {WordCountTrend[]} data - Array of word count trends
 */
type WordCountSeries = {
  id: string
  data: WordCountTrend[]
}

/**
 * GET handler for word count trends
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Calculates daily word counts for the specified date range
 * 3. Returns the data in a format suitable for visualization
 *
 * @param {NextRequest} req - The incoming request containing date range parameters
 * @returns {Promise<NextResponse>} Response containing the word count trends or error
 * @throws {Error} When authentication fails or processing errors occur
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const searchParams = req.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const {rows} = await sql`
      SELECT
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS entry_date,
        SUM(
          LENGTH(content) - LENGTH(REGEXP_REPLACE(content, '\s+', '', 'g')) + 1
        ) AS word_count
      FROM journals
      WHERE
        user_id = ${userId}
        AND created_at >= ${startDate}::date
        AND created_at < ${endDate}::date
      GROUP BY DATE(created_at)
      ORDER BY entry_date
    `

    const trendData: WordCountTrend[] = rows.map((row) => ({
      x: row.entry_date,
      y: Number(row.word_count) || 0,
    }))

    const series: WordCountSeries[] = [
      {
        id: 'word_count',
        data: trendData,
      },
    ]

    return NextResponse.json(series)
  } catch (error) {
    console.error('Error fetching word count trends:', error)
    return NextResponse.json(
      {error: 'Failed to fetch word count trends'},
      {status: 500},
    )
  }
}

export const config = {
  runtime: 'nodejs',
};