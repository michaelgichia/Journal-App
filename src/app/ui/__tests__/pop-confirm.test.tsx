/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PopConfirm from '../pop-confirm';

// Mock the Button component to avoid testing its implementation
jest.mock('../button', () => ({
  Button: ({ children, onClick, variant }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'danger';
  }) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('PopConfirm Component', () => {
  const defaultProps = {
    title: 'Are you sure?',
    onCancel: jest.fn(),
    isOpen: true,
    children: <button>Delete</button>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when closed', () => {
    render(<PopConfirm {...defaultProps} isOpen={false} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('renders confirmation dialog when open', () => {
    render(<PopConfirm {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onCancel when clicking Back button', () => {
    render(<PopConfirm {...defaultProps} />);
    fireEvent.click(screen.getByText('Back'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders with correct positioning classes', () => {
    render(<PopConfirm {...defaultProps} />);
    const dialog = screen.getByText('Are you sure?').closest('div');
    expect(dialog).toHaveClass('absolute', 'bottom-full', 'right-0');
  });

  it('renders danger variant for confirm button', () => {
    render(<PopConfirm {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveAttribute('data-variant', 'danger');
  });
});