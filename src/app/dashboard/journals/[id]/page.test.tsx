/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import Page from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the database calls
jest.mock('@/app/db/journal', () => ({
  fetchJournalById: jest.fn(),
}));

// Mock the icons
jest.mock('@/app/ui/icons', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
}));

import { fetchJournalById } from '@/app/db/journal';

describe('Journal Detail Page', () => {
  const mockJournal = {
    id: '1',
    title: 'Test Journal',
    content: 'Test content\nWith multiple lines',
    category: 'Work',
    createdAt: new Date('2024-03-23T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the journal details correctly', async () => {
    (fetchJournalById as jest.Mock).mockResolvedValue(mockJournal);

    render(
      await Page({
        params: Promise.resolve({ id: '1' }),
      })
    );

    // Check navigation elements
    expect(screen.getByText('← Back to Journals')).toHaveAttribute('href', '/dashboard');

    // Check journal content
    expect(screen.getByText('Test Journal')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();

    // Check content with whitespace preserved
    const content = screen.getByText((content) => content.includes('Test content') && content.includes('With multiple lines'));
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('whitespace-pre-wrap');

    expect(screen.getByText('23rd March 2024')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('calls notFound when journal is not found', async () => {
    (fetchJournalById as jest.Mock).mockResolvedValue(null);

    try {
      await Page({
        params: Promise.resolve({ id: 'non-existent' }),
      });
    } catch {
      // This is expected as notFound() throws an error
    }

    expect(notFound).toHaveBeenCalled();
  });

  it('handles error when fetching journal fails', async () => {
    const error = new Error('Failed to fetch journal');
    (fetchJournalById as jest.Mock).mockRejectedValue(error);

    await expect(
      Page({
        params: Promise.resolve({ id: '1' }),
      })
    ).rejects.toThrow('Failed to fetch journal');
  });
});