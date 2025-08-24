import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../../components/Auth/LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    user: null,
    loading: false
  })
}));

describe('LoginForm', () => {
  const mockProps = {
    onToggleMode: jest.fn(),
    isSignUp: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in form by default', () => {
    render(<LoginForm {...mockProps} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders sign up form when isSignUp is true', () => {
    render(<LoginForm {...mockProps} isSignUp={true} />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('calls signIn when sign in form is submitted', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} />);

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('calls signUp when sign up form is submitted', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} isSignUp={true} />);

    await user.type(screen.getByLabelText('Display Name'), 'Test User');
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });

  it('calls signInWithGoogle when Google button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} />);

    await user.click(screen.getByText('Continue with Google'));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('displays error message when authentication fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} />);

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls onToggleMode when toggle button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} />);

    await user.click(screen.getByText('Create Account'));

    expect(mockProps.onToggleMode).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<LoginForm {...mockProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('shows loading state during authentication', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    
    render(<LoginForm {...mockProps} />);

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});