/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import WordCountTrendChart from '../word-count-trends';
import { Serie } from '@nivo/line';

// Mock the ResponsiveLine component
jest.mock('@nivo/line', () => ({
  ResponsiveLine: ({ data }: { data: Serie[] }) => (
    <div data-testid="line-chart">
      {data.map((serie) => (
        <div key={serie.id} data-testid={`line-serie-${serie.id}`}>
          {serie.data.length} data points
        </div>
      ))}
    </div>
  ),
}));

// Mock the Send icon
jest.mock('@/app/ui/icons', () => ({
  Send: () => <span data-testid="send-icon" />,
}));

// Mock the PieChartSkeleton component
jest.mock('@/app/ui/skeletons', () => ({
  PieChartSkeleton: () => <div data-testid="chart-skeleton">Loading...</div>,
}));

describe('WordCountTrendChart Component', () => {
  const mockWordTrends: Serie[] = [
    {
      id: 'word-count',
      data: [
        { x: '2024-03-01', y: 100 },
        { x: '2024-03-02', y: 150 },
        { x: '2024-03-03', y: 120 },
      ],
    },
  ];

  it('renders the component title and icon', () => {
    render(<WordCountTrendChart wordTrends={[]} loading={false} />);
    expect(screen.getByText('Word Count Trends Over Time')).toBeInTheDocument();
    expect(screen.getByTestId('send-icon')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading is true', () => {
    render(<WordCountTrendChart wordTrends={[]} loading={true} />);
    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('renders line chart when not loading', () => {
    render(<WordCountTrendChart wordTrends={mockWordTrends} loading={false} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-skeleton')).not.toBeInTheDocument();
  });

  it('renders correct number of data points', () => {
    render(<WordCountTrendChart wordTrends={mockWordTrends} loading={false} />);
    const serie = screen.getByTestId('line-serie-word-count');
    expect(serie.textContent).toBe('3 data points');
  });

  it('applies correct container styling', () => {
    render(<WordCountTrendChart wordTrends={mockWordTrends} loading={false} />);
    const container = screen.getByText('Word Count Trends Over Time').closest('div');
    expect(container?.parentElement).toHaveClass('shadow-sm', 'flex', 'flex-col', 'mb-8');
  });

  it('renders chart container with correct dimensions', () => {
    render(<WordCountTrendChart wordTrends={mockWordTrends} loading={false} />);
    const chartContainer = screen.getByTestId('line-chart').parentElement;
    expect(chartContainer).toHaveClass('h-[400px]', 'w-full', 'flex', 'items-center');
  });
});