/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SideNav from '../sidenav';

// Mock the NavLinks component
jest.mock('../nav-links', () => {
  return function MockNavLinks() {
    return <div data-testid="nav-links">Navigation Links</div>;
  };
});

// Mock the Power icon
jest.mock('@/app/ui/icons', () => ({
  Power: () => <span data-testid="power-icon" />,
}));

// Mock the auth configuration
jest.mock('@/config/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

import { signOut } from '@/config/auth';

describe('SideNav Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the navigation links', () => {
    render(<SideNav />);
    expect(screen.getByTestId('nav-links')).toBeInTheDocument();
  });

  it('renders the sign out button', () => {
    render(<SideNav />);
    const signOutButton = screen.getByRole('button');
    expect(signOutButton).toBeInTheDocument();
    expect(screen.getByTestId('power-icon')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('applies correct styling to sign out button', () => {
    render(<SideNav />);
    const signOutButton = screen.getByRole('button');
    expect(signOutButton).toHaveClass(
      'flex',
      'h-[48px]',
      'bg-gray-50',
      'w-full',
      'grow',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-md',
      'hover:bg-teal-50',
      'hover:text-teal-800'
    );
  });

  it('has server action for sign out', async () => {
    render(<SideNav />);
    const mockSignOut = signOut as jest.Mock;
    mockSignOut.mockImplementation(() => Promise.resolve());

    const form = screen.getByRole('button').closest('form');
    const formAction = form?.getAttribute('action');

    expect(formAction).toBeDefined();
    expect(typeof formAction).toBe('string');
  });

  it('renders with responsive layout classes', () => {
    render(<SideNav />);
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass(
      'flex',
      'grow',
      'flex-row',
      'justify-between',
      'space-x-2',
      'md:flex-col',
      'md:space-x-0',
      'md:space-y-2'
    );
  });
});