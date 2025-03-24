/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SentimentSummaryChart from '../sentiment-summary';
import { EmotionCategory } from '@/types/journal';

// Mock the ResponsivePie component
jest.mock('@nivo/pie', () => ({
  ResponsivePie: ({ data }: { data: Array<{ id: string; value: number }> }) => (
    <div data-testid="pie-chart">
      {data.map((item) => (
        <div key={item.id} data-testid={`pie-segment-${item.id}`}>
          {item.value}
        </div>
      ))}
    </div>
  ),
}));

// Mock the Target icon
jest.mock('@/app/ui/icons', () => ({
  Target: () => <span data-testid="target-icon" />,
}));

// Mock the PieChartSkeleton component
jest.mock('@/app/ui/skeletons', () => ({
  PieChartSkeleton: () => <div data-testid="pie-chart-skeleton">Loading...</div>,
}));

describe('SentimentSummaryChart Component', () => {
  const mockSentiments: EmotionCategory[] = [
    { id: 'joy', value: 5 },
    { id: 'sadness', value: 0 },
    { id: 'anger', value: 3 },
  ];

  it('renders the component title and icon', () => {
    render(<SentimentSummaryChart sentiments={[]} loading={false} />);
    expect(screen.getByText('Sentiment Summary')).toBeInTheDocument();
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading is true', () => {
    render(<SentimentSummaryChart sentiments={[]} loading={true} />);
    expect(screen.getByTestId('pie-chart-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('renders pie chart when not loading', () => {
    render(<SentimentSummaryChart sentiments={mockSentiments} loading={false} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart-skeleton')).not.toBeInTheDocument();
  });

  it('adjusts zero values to small number for visibility', () => {
    render(<SentimentSummaryChart sentiments={mockSentiments} loading={false} />);

    // Joy should keep its original value
    const joySegment = screen.getByTestId('pie-segment-joy');
    expect(joySegment.textContent).toBe('5');

    // Sadness should be adjusted to 0.05
    const sadnessSegment = screen.getByTestId('pie-segment-sadness');
    expect(sadnessSegment.textContent).toBe('0.05');
  });

  it('applies correct container styling', () => {
    render(<SentimentSummaryChart sentiments={mockSentiments} loading={false} />);
    const container = screen.getByText('Sentiment Summary').closest('div');
    expect(container?.parentElement).toHaveClass('shadow-sm', 'flex', 'flex-col', 'mb-8');
  });

  it('renders chart container with correct dimensions', () => {
    render(<SentimentSummaryChart sentiments={mockSentiments} loading={false} />);
    const chartContainer = screen.getByTestId('pie-chart').parentElement;
    expect(chartContainer).toHaveClass('h-[400px]', 'w-full', 'flex', 'items-center');
  });
});