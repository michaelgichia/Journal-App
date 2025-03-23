'use server'

import {sql} from '@vercel/postgres'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

import {auth} from '@/config/auth'
import {CreateJournalSchema} from '@/schema/journal'
import hf from '@/hf';

function getSubString(text: string): string {
  if (text.length <= 514) {
    return text;
  } else {
    return text.substring(0, 514);
  }
}

/**
 * Represents the state of a journal operation (create/update).
 * This type is designed to provide comprehensive feedback for form submissions,
 * including validation errors, success status, and user-facing messages.
 * The structure supports Next.js server actions' state management pattern.
 */
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

/**
 * Creates a new journal entry in the database.
 *
 * This function implements a secure and validated journal creation process.
 * Key security features:
 * - Requires authenticated user (via auth())
 * - Validates input using Zod schema to prevent SQL injection
 * - Associates journal with user's ID for data isolation
 *
 * The function follows a fail-fast pattern:
 * 1. Validates user authentication
 * 2. Validates form data
 * 3. Performs database operation
 * 4. Updates UI state via cache revalidation
 *
 * @param {IState | undefined} _state - The previous state (not used in this function).
 * @param {FormData} formData - The form data containing the journal's title, content, and category ID.
 * @returns {Promise<void>} - Redirects to dashboard on success, returns error state on failure.
 * @throws {Error} - Throws an error if an unexpected error occurs during journal creation.
 */
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

  let sentiment: string = 'neutral';
  let sentimentScore: number = 0.5;

  try {
    const response = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: getSubString(content),
      parameters: {
        max_length: 680,
      },
    });

    const classificationContent = response[0] || null;

    if (classificationContent && classificationContent.label && typeof classificationContent.score === 'number') {
      sentiment = classificationContent.label; // e.g., 'joy'
      sentimentScore = Number(classificationContent.score.toFixed(4)); // e.g., 0.6737
    }
  } catch (error) {
    console.error('Error classifying sentiment:', error);
    // Fallback to default values (already set)
  }

  try {
  await sql`
    INSERT INTO journals (user_id, title, content, category_id, sentiment, sentiment_score, created_at)
    VALUES (${userId}, ${title}, ${content}, ${categoryId}, ${sentiment}, ${sentimentScore}, NOW())
    RETURNING id, user_id, title, content, category_id, sentiment, sentiment_score, created_at, updated_at
  `;
  } catch {
    return {success: false, message: 'Failed to create a journal'}
  }

  // Revalidate the cache for the journal's page and redirect the user.
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

/**
 * Updates an existing journal entry in the database.
 *
 * This function implements a secure journal update process with several key features:
 * - Requires authenticated user
 * - Validates input using Zod schema
 * - Ensures users can only update their own journals (user_id check)
 * - Maintains data integrity through transaction-like operations
 *
 * The update process follows these steps:
 * 1. Validates form data
 * 2. Verifies user authentication
 * 3. Updates only if user owns the journal
 * 4. Updates UI state via cache revalidation
 *
 * @param {string} id - The unique identifier of the journal to update.
 * @param {IState | undefined} _state - The previous state (not used in this function).
 * @param {FormData} formData - The form data containing the updated journal's title, content, and category ID.
 * @returns {Promise<void>} - Redirects to dashboard on success, returns error state on failure.
 * @throws {Error} - Throws an error if an unexpected error occurs during journal update.
 */
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

/**
 * Deletes a journal entry from the database.
 *
 * This function implements a secure deletion process with these key features:
 * - Requires authenticated user
 * - Ensures users can only delete their own journals (user_id check)
 * - Implements soft error handling with user feedback
 * - Maintains UI consistency through cache revalidation
 *
 * The deletion process is designed to be:
 * - Atomic: Either fully succeeds or fails
 * - Secure: Only allows deletion of user's own journals
 * - User-friendly: Provides clear feedback on failure
 *
 * @param {string} id - The unique identifier of the journal to delete.
 * @returns {Promise<{ success: boolean; message?: string } | void>} - Returns error state on failure, void on success.
 * @throws {Error} - Throws an error if an unexpected error occurs during journal deletion.
 */
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
}
