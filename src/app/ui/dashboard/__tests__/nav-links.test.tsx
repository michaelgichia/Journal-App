/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NavLinks from '../nav-links';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, ...props }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    key?: string | number;
  }) {
    return <a {...props}>{children}</a>;
  };
});

// Mock icons
jest.mock('@/app/ui/icons', () => ({
  Book: () => <span data-testid="book-icon" />,
  BarChart2: () => <span data-testid="chart-icon" />,
}));

import { usePathname } from 'next/navigation';

describe('NavLinks Component', () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it('renders all navigation links', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<NavLinks />);

    expect(screen.getByText('Your Journal')).toBeInTheDocument();
    expect(screen.getByText('Summaries')).toBeInTheDocument();
    expect(screen.getByTestId('book-icon')).toBeInTheDocument();
    expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
  });

  it('applies active styles to current route', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<NavLinks />);

    const journalLink = screen.getByText('Your Journal').closest('a');
    const summariesLink = screen.getByText('Summaries').closest('a');

    expect(journalLink).toHaveClass('bg-teal-50', 'text-teal-800');
    expect(summariesLink).not.toHaveClass('bg-teal-50', 'text-teal-800');
  });

  it('applies active styles to summaries route when selected', () => {
    mockUsePathname.mockReturnValue('/dashboard/summaries');
    render(<NavLinks />);

    const journalLink = screen.getByText('Your Journal').closest('a');
    const summariesLink = screen.getByText('Summaries').closest('a');

    expect(summariesLink).toHaveClass('bg-teal-50', 'text-teal-800');
    expect(journalLink).not.toHaveClass('bg-teal-50', 'text-teal-800');
  });

  it('renders links with correct href attributes', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<NavLinks />);

    const journalLink = screen.getByText('Your Journal').closest('a');
    const summariesLink = screen.getByText('Summaries').closest('a');

    expect(journalLink).toHaveAttribute('href', '/dashboard');
    expect(summariesLink).toHaveAttribute('href', '/dashboard/summaries');
  });
});