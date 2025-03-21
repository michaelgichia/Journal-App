import {notFound} from 'next/navigation'

import Form from '@/app/ui/journals/edit-form'
import Breadcrumbs from '@/app/ui/journals/breadcrumbs'
import {fetchCategories, fetchJournalById} from '@/app/db/journal'

export default async function Page(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const id = params.id

  const [journal, categories] = await Promise.all([
    fetchJournalById(id),
    fetchCategories(),
  ])

  if (!journal) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {label: 'Journals', href: '/dashboard'},
          {
            label: 'Edit Journal',
            href: `/dashboard/journals/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form categories={categories} journal={journal} />
    </main>
  )
}
