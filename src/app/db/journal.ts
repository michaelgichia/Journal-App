'use server'

import {sql} from '@vercel/postgres'
import {JournalField} from '@/types/journal'

export async function fetchCategories() {
  try {
    const categories = await sql<JournalField>`
      SELECT id, name, type, created_at
      FROM Categories
      ORDER BY name ASC;
      `
    return categories.rows
  } catch {
    throw new Error('Failed to fetch all categories.')
  }
}
