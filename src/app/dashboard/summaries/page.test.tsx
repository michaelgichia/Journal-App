/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { subYears } from 'date-fns';
import Page from './page';

// Import types
import type { JournalSummary, JournalEntry, CategoryCount, WordTrend, SentimentCount } from '@/types/journal';

// Mock the custom hook
jest.mock('@/hooks/useJournalSummaries', () => ({
  useJournalSummaries: jest.fn(),
}));

// Mock the UI components
jest.mock('@/app/ui/dashboard/journal-summaries', () => ({
  __esModule: true,
  default: ({ loading, summary }: { loading: boolean; summary: JournalSummary }) => (
    <div data-testid="journal-summaries">
      {loading ? 'Loading...' : JSON.stringify(summary)}
    </div>
  ),
}));

jest.mock('@/app/ui/dashboard/journal-frequency', () => ({
  __esModule: true,
  default: ({ loading, entries }: { loading: boolean; entries: JournalEntry[] }) => (
    <div data-testid="entries-frequency">
      {loading ? 'Loading...' : JSON.stringify(entries)}
    </div>
  ),
}));

jest.mock('@/app/ui/dashboard/category-distribution', () => ({
  __esModule: true,
  default: ({ loading, categories }: { loading: boolean; categories: CategoryCount[] }) => (
    <div data-testid="category-distribution">
      {loading ? 'Loading...' : JSON.stringify(categories)}
    </div>
  ),
}));

jest.mock('@/app/ui/dashboard/word-count-trends', () => ({
  __esModule: true,
  default: ({ loading, wordTrends }: { loading: boolean; wordTrends: WordTrend[] }) => (
    <div data-testid="word-count-trends">
      {loading ? 'Loading...' : JSON.stringify(wordTrends)}
    </div>
  ),
}));

jest.mock('@/app/ui/dashboard/sentiment-summary', () => ({
  __esModule: true,
  default: ({ loading, sentiments }: { loading: boolean; sentiments: SentimentCount[] }) => (
    <div data-testid="sentiment-summary">
      {loading ? 'Loading...' : JSON.stringify(sentiments)}
    </div>
  ),
}));

jest.mock('@/app/ui/datepicker', () => ({
  __esModule: true,
  default: ({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) => (
    <input
      type="date"
      data-testid={`datepicker-${name}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Import the mock function type
import { useJournalSummaries } from '@/hooks/useJournalSummaries';

describe('Summaries Page', () => {
  const mockUseJournalSummaries = useJournalSummaries as jest.Mock;
  const FIXED_DATE = '2024-01-01T00:00:00.000Z';
  const RealDate = global.Date;
  const mockDate = new Date(FIXED_DATE);

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Mock Date constructor and now()
    global.Date = jest.fn((...args: unknown[]) => {
      if (args.length === 0) {
        return mockDate;
      }
      return new RealDate(...args as [number, number, number, number, number, number, number]);
    }) as unknown as typeof Date;
    global.Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    global.Date = RealDate;
    jest.restoreAllMocks();
  });

  it('renders the page title', () => {
    mockUseJournalSummaries.mockReturnValue({
      entries: [],
      categories: [],
      wordTrends: [],
      sentiments: [],
      summary: {},
      isLoading: false,
      error: null,
    });

    render(<Page />);
    expect(screen.getByText('Summaries')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    mockUseJournalSummaries.mockReturnValue({
      entries: [],
      categories: [],
      wordTrends: [],
      sentiments: [],
      summary: {},
      isLoading: true,
      error: null,
    });

    render(<Page />);
    expect(screen.getAllByText('Loading...')).toHaveLength(5); // One for each chart component
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to fetch data';
    mockUseJournalSummaries.mockReturnValue({
      entries: [],
      categories: [],
      wordTrends: [],
      sentiments: [],
      summary: {},
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<Page />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('updates date filter when date inputs change', () => {
    mockUseJournalSummaries.mockReturnValue({
      entries: [],
      categories: [],
      wordTrends: [],
      sentiments: [],
      summary: {},
      isLoading: false,
      error: null,
    });

    render(<Page />);

    const startDate = '2023-01-01';
    const endDate = '2023-12-31';

    const startDatePicker = screen.getByTestId('datepicker-startAt');
    const endDatePicker = screen.getByTestId('datepicker-endAt');

    fireEvent.change(startDatePicker, { target: { value: startDate } });
    fireEvent.change(endDatePicker, { target: { value: endDate } });

    // Verify that useJournalSummaries was called with updated date filter
    expect(mockUseJournalSummaries).toHaveBeenCalledWith({
      startAt: startDate,
      endAt: endDate,
    });
  });

  it('initializes with default date range of last year to now', () => {
    mockUseJournalSummaries.mockReturnValue({
      entries: [],
      categories: [],
      wordTrends: [],
      sentiments: [],
      summary: {},
      isLoading: false,
      error: null,
    });

    render(<Page />);

    // Get the first call arguments to useJournalSummaries
    const [dateFilter] = mockUseJournalSummaries.mock.calls[0];

    // Parse the dates from the filter
    const startDate = new Date(dateFilter.startAt);
    const endDate = new Date(dateFilter.endAt);

    // Expected dates
    const expectedEndDate = new Date(FIXED_DATE);
    const expectedStartDate = subYears(expectedEndDate, 1);

    // Compare the dates
    expect(startDate.getTime()).toBe(expectedStartDate.getTime());
    expect(endDate.getTime()).toBe(expectedEndDate.getTime());
  });

  it('renders all chart components when data is available', () => {
    const mockData = {
      entries: [{ date: '2023-01-01', count: 1 }],
      categories: [{ name: 'Work', count: 5 }],
      wordTrends: [{ date: '2023-01', count: 100 }],
      sentiments: [{ sentiment: 'positive', count: 10 }],
      summary: { totalEntries: 50 },
      isLoading: false,
      error: null,
    };

    mockUseJournalSummaries.mockReturnValue(mockData);

    render(<Page />);

    expect(screen.getByTestId('journal-summaries')).toHaveTextContent(JSON.stringify(mockData.summary));
    expect(screen.getByTestId('entries-frequency')).toHaveTextContent(JSON.stringify(mockData.entries));
    expect(screen.getByTestId('category-distribution')).toHaveTextContent(JSON.stringify(mockData.categories));
    expect(screen.getByTestId('word-count-trends')).toHaveTextContent(JSON.stringify(mockData.wordTrends));
    expect(screen.getByTestId('sentiment-summary')).toHaveTextContent(JSON.stringify(mockData.sentiments));
  });
});