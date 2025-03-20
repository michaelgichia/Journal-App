import Form from '@/app/ui/journals/create-form';
import Breadcrumbs from '@/app/ui/journals/breadcrumbs';
import { fetchCategories } from '@/app/db/journal';

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Journals', href: '/dashboard' },
          {
            label: 'Create Journal',
            href: '/dashboard/journals/create',
            active: true,
          },
        ]}
      />
      <Form categories={categories} />
    </main>
  );
}