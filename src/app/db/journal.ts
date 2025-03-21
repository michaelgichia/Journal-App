'use server'

import {sql} from '@vercel/postgres'
import {Journal, Category} from '@/types/journal'

/**
 * Fetches all categories from the database.
 *
 * This function implements a simple but efficient category retrieval system:
 * - Orders categories alphabetically for consistent UI presentation
 * - Returns only necessary fields (id, name, type, created_at)
 * - Implements error handling to prevent silent failures
 *
 * The alphabetical ordering is chosen to:
 * - Improve user experience in dropdowns and lists
 * - Maintain consistent ordering across page refreshes
 * - Support efficient binary search in UI components
 *
 * @returns {Promise<Category[]>} - Array of categories ordered by name
 * @throws {Error} - Throws a descriptive error if database query fails
 */
export async function fetchCategories() {
  try {
    const categories = await sql<Category>`
      SELECT id, name, type, created_at
      FROM Categories
      ORDER BY name ASC;
      `
    return categories.rows
  } catch {
    throw new Error('Failed to fetch all categories.')
  }
}

/**
 * Fetches all journals with their associated category information.
 *
 * This function implements a JOIN-based query to:
 * - Combine journal and category data in a single query
 * - Reduce the number of database round trips
 * - Maintain referential integrity through JOIN
 *
 * Key design decisions:
 * - Uses table alias (je) for better query readability
 * - Orders by creation date for chronological presentation
 * - Returns normalized field names (e.g., "category" instead of "name")
 * - Includes only necessary fields for performance
 *
 * @returns {Promise<Journal[]>} - Array of journals with their category information
 * @throws {Error} - Throws a descriptive error if database query fails
 */
export async function fetchJournal() {
  try {
    const journals = await sql<Journal>`
      SELECT
        je.id,
        je.title,
        je.content,
        je.category_id,
        c.name AS "category",
        je.created_at AS "createdAt"
      FROM Journals je
      JOIN Categories c ON je.category_id = c.id
      ORDER BY je.created_at ASC
    `;
    return journals.rows;
  } catch {
    throw new Error('Failed to fetch all journals.');
  }
}

/**
 * Fetches a single journal by its ID with associated category information.
 *
 * This function implements a targeted retrieval system:
 * - Uses parameterized query for security (prevents SQL injection)
 * - Returns a single journal or undefined if not found
 * - Maintains consistent data structure with fetchJournal()
 *
 * Performance considerations:
 * - Uses indexed id field for fast lookups
 * - Includes JOIN for category data to prevent N+1 queries
 * - Returns normalized field names for consistent API
 *
 * @param {string} id - The unique identifier of the journal to fetch
 * @returns {Promise<Journal | undefined>} - The journal with its category information, or undefined if not found
 * @throws {Error} - Throws a descriptive error if database query fails
 */
export async function fetchJournalById(id: string) {
  try {
    const journal = await sql<Journal>`
      SELECT
        je.id,
        je.title,
        je.content,
        je.category_id,
        c.name AS "category",
        je.created_at AS "createdAt"
      FROM Journals je
      JOIN Categories c ON je.category_id = c.id
      WHERE je.id = ${id}
    `;
    return journal.rows[0];
  } catch {
    throw new Error('Failed to fetch journal.');
  }
}
