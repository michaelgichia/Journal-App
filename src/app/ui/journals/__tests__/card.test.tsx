/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../card';
import { Journal } from '@/types/journal';

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

// Mock icons
jest.mock('@/app/ui/icons', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  MoreVertical: () => <span data-testid="more-icon" />,
}));

// Mock PopConfirm component
jest.mock('@/app/ui/pop-confirm', () => {
  return function MockPopConfirm({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
    return isOpen ? (
      <div data-testid="pop-confirm">
        <div data-testid="confirm-dialog">Are you sure to delete the journal?</div>
        {children}
      </div>
    ) : (
      children
    );
  };
});

// Mock journal actions
jest.mock('@/app/actions/journals', () => ({
  deleteJournal: jest.fn(() => Promise.resolve()),
}));

// Mock useActionState hook
const mockUseActionState = jest.fn(() => [null, jest.fn(), false]);
jest.mock('react', () => {
  const originalModule = jest.requireActual('react');
  return {
    ...originalModule,
    useState: originalModule.useState,
    useActionState: () => mockUseActionState(),
  };
});

describe('Card Component', () => {
  const mockDate = new Date('2024-03-20T12:00:00.000Z');
  const mockJournal: Journal = {
    id: '1',
    title: 'Test Journal',
    content: 'This is a test journal content that might be very long and need truncation.',
    category: 'Personal',
    category_id: 'personal-123',
    createdAt: mockDate,
    updatedAt: mockDate.toISOString(),
    userId: 'user-123',
  };

  beforeEach(() => {
    mockUseActionState.mockReturnValue([null, jest.fn(), false]);
  });

  it('renders journal title and content', () => {
    render(<Card journal={mockJournal} />);

    expect(screen.getByText('Test Journal')).toBeInTheDocument();
    expect(screen.getByText(/This is a test journal content/)).toBeInTheDocument();
  });

  it('renders formatted date with icon', () => {
    render(<Card journal={mockJournal} />);

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    expect(screen.getByText('Mar 20th, 2024')).toBeInTheDocument();
  });

  it('renders category', () => {
    render(<Card journal={mockJournal} />);
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('shows options menu on hover', () => {
    render(<Card journal={mockJournal} />);

    const menuButton = screen.getByRole('button', { name: '' });
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByTestId('more-icon')).toBeInTheDocument();
  });

  it('renders edit and delete options', () => {
    render(<Card journal={mockJournal} />);

    const editLink = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');

    expect(editLink).toHaveAttribute('href', '/dashboard/journals/1/edit');
    expect(deleteButton).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete is clicked', () => {
    render(<Card journal={mockJournal} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('Are you sure to delete the journal?')).toBeInTheDocument();
  });

  it('renders read more link with correct href', () => {
    render(<Card journal={mockJournal} />);

    const readMoreLink = screen.getByText('Read More');
    expect(readMoreLink).toHaveAttribute('href', '/dashboard/journals/1');
  });

  it('applies correct styling to the card container', () => {
    render(<Card journal={mockJournal} />);

    const container = screen.getByText('Test Journal').closest('div');
    expect(container?.parentElement).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-sm',
      'border',
      'border-gray-100',
      'p-4',
      'relative',
      'group',
      'min-h-[200px]',
      'flex',
      'flex-col'
    );
  });

  it('shows loading state during deletion', async () => {
    mockUseActionState.mockReturnValue([null, jest.fn(), true]);
    render(<Card journal={mockJournal} />);

    const deleteButton = screen.getByText('Deleting...');
    expect(deleteButton).toHaveClass('disabled:opacity-50');
    expect(deleteButton).toBeDisabled();
  });
});