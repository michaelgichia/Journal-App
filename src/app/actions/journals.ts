'use server'

export type IState = {
  errors?: {
    journalId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createJournal() {
  return {
    message: 'Journal created successfully!',
    success: true,
  }
}