/**
 * Category Distribution API Route
 *
 * This route analyzes the distribution of journal entries across different
 * categories within a specified date range. It provides insights into
 * which categories are most frequently used in journaling.
 *
 * @module category-distribution
 */

import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'

/**
 * Represents the distribution of entries across a category
 * @typedef {Object} CategoryDistribution
 * @property {string} id - The name of the category
 * @property {number} value - The number of entries in this category
 */
type CategoryDistribution = {
  id: string // Category name
  value: number // Number of entries in this category
}

/**
 * GET handler for category distribution
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Calculates the number of entries per category
 * 3. Returns the distribution data sorted by frequency
 *
 * @param {NextRequest} req - The incoming request containing date range parameters
 * @returns {Promise<NextResponse>} Response containing the category distribution or error
 * @throws {Error} When authentication fails or processing errors occur
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const searchParams = req.nextUrl.searchParams
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!startDate || !endDate) {
    return NextResponse.json(
      {error: 'startDate and endDate are required'},
      {status: 400},
    )
  }

  try {
    const {rows} = await sql`
      SELECT
        c.name AS category_name,
        COUNT(j.id) AS entry_count
      FROM categories c
      LEFT JOIN journals j
        ON j.category_id = c.id
        AND j.created_at BETWEEN ${startDate} AND ${endDate}
      GROUP BY c.name
      ORDER BY entry_count DESC
    `

    const distribution: CategoryDistribution[] = rows.map((row) => ({
      id: row.category_name,
      value: Number(row.entry_count),
    }))

    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching category distribution:', error)
    return NextResponse.json(
      {error: 'Failed to fetch category distribution'},
      {status: 500},
    )
  }
}

export const config = {
  runtime: 'nodejs',
};
