/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from './page';

// Mock the database calls
jest.mock('@/app/db/journal', () => ({
  fetchCategories: jest.fn().mockResolvedValue([
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' },
  ]),
}));

// Mock the components
jest.mock('@/app/ui/journals/create-form', () => {
  return function MockForm({ categories }: { categories: Array<{ id: string; name: string }> }) {
    return (
      <div data-testid="create-form">
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    );
  };
});

jest.mock('@/app/ui/journals/breadcrumbs', () => {
  return function MockBreadcrumbs({
    breadcrumbs,
  }: {
    breadcrumbs: Array<{ label: string; href: string; active?: boolean }>;
  }) {
    return (
      <nav data-testid="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className={crumb.active ? 'active' : ''}>
            {crumb.label}
          </span>
        ))}
      </nav>
    );
  };
});

describe('Create Journal Page', () => {
  it('renders the breadcrumbs with correct navigation', async () => {
    render(await Page());

    const breadcrumbs = screen.getByTestId('breadcrumbs');
    expect(breadcrumbs).toBeInTheDocument();
    expect(breadcrumbs).toHaveTextContent('Journals');
    expect(breadcrumbs).toHaveTextContent('Create Journal');
  });

  it('renders the create form with fetched categories', async () => {
    render(await Page());

    const form = screen.getByTestId('create-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveTextContent('Work');
    expect(form).toHaveTextContent('Personal');
  });
});