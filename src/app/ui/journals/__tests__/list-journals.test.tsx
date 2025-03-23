/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ListJournals from '../list-journals';
import { Journal } from '@/types/journal';
import { fetchJournal } from '@/app/db/journal';

// Mock the Card component
jest.mock('@/app/ui/journals/card', () => {
  return function MockCard({ journal }: { journal: Journal }) {
    return (
      <div data-testid={`journal-card-${journal.id}`}>
        <h2>{journal.title}</h2>
        <p>{journal.content}</p>
      </div>
    );
  };
});

// Mock the fetchJournal function
jest.mock('@/app/db/journal', () => ({
  fetchJournal: jest.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'First Journal',
      content: 'First journal content',
      category: 'Personal',
      category_id: 'personal-123',
      createdAt: new Date('2024-03-20T12:00:00.000Z'),
      updatedAt: '2024-03-20T12:00:00.000Z',
      userId: 'user-123',
    },
    {
      id: '2',
      title: 'Second Journal',
      content: 'Second journal content',
      category: 'Work',
      category_id: 'work-123',
      createdAt: new Date('2024-03-21T12:00:00.000Z'),
      updatedAt: '2024-03-21T12:00:00.000Z',
      userId: 'user-123',
    },
  ])),
}));

describe('ListJournals Component', () => {
  it('renders a grid container', async () => {
    const { container } = render(await ListJournals());
    const grid = container.firstChild;
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6',
      'mt-8'
    );
  });

  it('renders journal cards for each journal', async () => {
    render(await ListJournals());

    expect(screen.getByTestId('journal-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('journal-card-2')).toBeInTheDocument();
    expect(screen.getByText('First Journal')).toBeInTheDocument();
    expect(screen.getByText('Second Journal')).toBeInTheDocument();
  });

  it('handles empty journal list', async () => {
    const mockFetchJournal = fetchJournal as jest.Mock;
    mockFetchJournal.mockImplementationOnce(() => Promise.resolve([]));

    const { container } = render(await ListJournals());
    const grid = container.firstChild;

    expect(grid).toBeEmptyDOMElement();
  });

  it('handles non-array response gracefully', async () => {
    const mockFetchJournal = fetchJournal as jest.Mock;
    mockFetchJournal.mockImplementationOnce(() => Promise.resolve(null));

    const { container } = render(await ListJournals());
    const grid = container.firstChild;

    expect(grid).toBeEmptyDOMElement();
  });
});