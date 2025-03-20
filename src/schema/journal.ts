import { z } from 'zod'

export const CreateJournalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export type CreateJournalInput = z.infer<typeof CreateJournalSchema>