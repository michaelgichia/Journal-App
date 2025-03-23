/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '../breadcrumbs';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, ...props }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return <a {...props}>{children}</a>;
  };
});

describe('Breadcrumbs Component', () => {
  const mockBreadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Journals', href: '/journals', active: false },
    { label: 'Create', href: '/journals/create', active: true },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Journals')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders correct number of separators', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(mockBreadcrumbs.length - 1);
  });

  it('applies correct styling to active breadcrumb', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);

    const activeItem = screen.getByText('Create').closest('li');
    const inactiveItem = screen.getByText('Home').closest('li');

    expect(activeItem).toHaveClass('text-gray-900');
    expect(inactiveItem).toHaveClass('text-gray-500');
  });

  it('renders correct links with href attributes', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);

    const homeLink = screen.getByText('Home').closest('a');
    const journalsLink = screen.getByText('Journals').closest('a');
    const createLink = screen.getByText('Create').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(journalsLink).toHaveAttribute('href', '/journals');
    expect(createLink).toHaveAttribute('href', '/journals/create');
  });

  it('sets correct aria attributes', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);

    const nav = screen.getByRole('navigation');
    const activeItem = screen.getByText('Create').closest('li');

    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    expect(activeItem).toHaveAttribute('aria-current', 'true');
  });

  it('applies responsive text size classes', () => {
    render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('flex', 'text-xl', 'md:text-2xl');
  });
});