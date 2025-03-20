import Form from '@/app/ui/journals/create-form';
import Breadcrumbs from '@/app/ui/journals/breadcrumbs';

export default async function Page() {

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
      <Form />
    </main>
  );
}