/**
 * Entry Frequency API Route
 *
 * This route provides daily journal entry frequency data within a specified
 * date range. It helps users track their journaling consistency and identify
 * patterns in their writing habits.
 *
 * @module entry-frequency
 */

import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'

/**
 * GET handler for entry frequency
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Counts the number of entries per day
 * 3. Returns the frequency data sorted by date
 *
 * @param {NextRequest} req - The incoming request containing date range parameters
 * @returns {Promise<NextResponse>} Response containing the entry frequency data or error
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
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS entryDate,
        CAST(COUNT(*) AS INTEGER) AS entryCount
      FROM journals
      WHERE
        user_id = ${userId}
        AND created_at >= ${startDate}::date
        AND created_at < ${endDate}::date
      GROUP BY DATE(created_at)
      ORDER BY entryDate
    `

    return NextResponse.json(rows, {status: 200})
  } catch (error) {
    console.error('Error fetching entry frequency:', error)
    return NextResponse.json(
      {error: 'Failed to fetch entry frequency'},
      {status: 500},
    )
  }
}

export const config = {
  runtime: 'nodejs',
};