/**
 * Sentiment Summary API Route
 *
 * This route provides a summary of sentiment across all journal entries within a specified date range.
 * It counts the occurrences of each sentiment and returns the data in a format suitable for visualization.
 *
 * @module sentiment-summary
 */

import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'
import {EmotionCategory} from '@/types/journal'

/**
 * GET handler for sentiment summary
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Fetches all journal entries within the specified date range
 * 3. Groups entries by sentiment and counts occurrences
 * 4. Returns the data in a format suitable for a pie chart
 *
 * @param {NextRequest} req - The incoming request containing date range parameters
 * @param {Object} req.nextUrl.searchParams - URL search parameters
 * @param {string} req.nextUrl.searchParams.startDate - Start date in YYYY-MM-DD format
 * @param {string} req.nextUrl.searchParams.endDate - End date in YYYY-MM-DD format (exclusive)
 *
 * @returns {Promise<NextResponse>} Response containing the sentiment summary or error
 * @returns {Object} Response body structure:
 *   - Success (200): Array of sentiment objects
 *     ```typescript
 *     {
 *       sentiment: string;    // Capitalized sentiment value
 *       occurrence_count: number;  // Number of occurrences
 *     }[]
 *     ```
 *   - Error (401): Unauthorized
 *     ```typescript
 *     { error: string }
 *     ```
 *   - Error (500): Server error
 *     ```typescript
 *     { error: string }
 *     ```
 *
 * @throws {Error} When authentication fails or processing errors occur
 *
 * @example
 * // Request
 * GET /api/summary/sentiment-summary?startDate=2024-01-01&endDate=2024-02-01
 *
 * // Success Response
 * [
 *   { sentiment: "Happy", occurrence_count: 5 },
 *   { sentiment: "Sad", occurrence_count: 2 },
 *   { sentiment: "Neutral", occurrence_count: 3 }
 * ]
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

    // Fetch sentiment data grouped by emotion
    const {rows} = await sql`
      SELECT
        INITCAP(sentiment) AS sentiment,
        COUNT(*) AS occurrence_count
      FROM journals
      WHERE
        user_id = ${userId}
        AND created_at >= ${startDate}::date
        AND created_at < ${endDate}::date
      GROUP BY INITCAP(sentiment)
    `

    const sentiments: EmotionCategory[] = rows.map((row) => ({
      id: row.sentiment,
      value: Number(row.occurrence_count),
    }))

    return NextResponse.json(sentiments)
  } catch (error) {
    console.error('Error fetching sentiment summary:', error)
    return NextResponse.json(
      {error: 'Failed to fetch sentiment summary'},
      {status: 500},
    )
  }
}

export const config = {
  runtime: 'nodejs',
}
