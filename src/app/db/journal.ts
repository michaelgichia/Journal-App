'use server'

import {sql} from '@vercel/postgres'
import {Journal, Category} from '@/types/journal'

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
