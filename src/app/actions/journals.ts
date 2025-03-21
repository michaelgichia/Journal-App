'use server'

import {sql} from '@vercel/postgres'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

import {auth} from '@/config/auth'
import {CreateJournalSchema} from '@/schema/journal'

export type IState = {
  errors?: {
    title?: string[]
    categoryId?: string[]
    content?: string[]
  }
  message?: string | null
  success: boolean | null
}

const CreateJournal = CreateJournalSchema.omit({userId: true})
const UpdateJournal = CreateJournalSchema.omit({userId: true})

export async function createJournal(
  _state: IState | undefined,
  formData: FormData,
) {
  const session = await auth()
  const userId = session?.user?.id

  // Validate form using Zod
  const result = CreateJournal.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    categoryId: formData.get('categoryId'),
  })

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const {title, content, categoryId} = result.data

  try {
    await sql`
    INSERT INTO Journals (user_id, title, content, category_id)
    VALUES (${userId}, ${title}, ${content}, ${categoryId})
    RETURNING id, user_id, title, content, category_id, created_at, updated_at
  `
  } catch {
    return {success: false, message: 'Failed to create a journal'}
  }

  // Revalidate the cache for the journal's page and redirect the user.
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateJournal(
  id: string,
  _state: IState | undefined,
  formData: FormData,
) {

  // Validate form using Zod
  const result = UpdateJournal.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    categoryId: formData.get('categoryId'),
  })

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }
  const {title, content, categoryId} = result.data

  const session = await auth()
  const userId = session?.user?.id

  try {
    await sql`
      UPDATE Journals
      SET title = ${title}, content = ${content}, category_id = ${categoryId}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id, user_id, title, content, category_id, created_at, updated_at
    `
  } catch {
    return {success: false, message: 'Failed to update journal'}
  }

  // Revalidate the cache for the journal's page and redirect the user.
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteJournal(id: string) {
  const session = await auth()
  const userId = session?.user?.id

  try {
    await sql`
      DELETE FROM Journals
      WHERE id = ${id} AND user_id = ${userId}
    `
  } catch (error) {
    console.error('Failed to delete journal:', error)
    return { success: false, message: 'Failed to delete journal' }
  }

  revalidatePath('/dashboard')
  return { success: true, message: 'Journal deleted successfully' }
}
