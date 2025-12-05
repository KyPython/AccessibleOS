import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { Eye, EyeOff } from '../Icons/Icons';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onToggleMode: () => void;
  isSignUp: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isSignUp }) => {
  const { login, signup, resetPassword, loading, error } = useAuth();
  const { announceToScreenReader } = useAccessibility();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isResetMode, setIsResetMode] = useState(false);

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6)
      return 'Password must be at least 6 characters long';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    if (!isResetMode) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) errors.password = passwordError;

      if (isSignUp) {
        if (!formData.displayName) {
          errors.displayName = 'Display name is required';
        }

        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      announceToScreenReader('Please fix the form errors and try again');
      return;
    }

    try {
      if (isResetMode) {
        await resetPassword(formData.email);
        announceToScreenReader('Password reset email sent successfully');
        setIsResetMode(false);
      } else if (isSignUp) {
        await signup(formData.email, formData.password, formData.displayName);
        announceToScreenReader('Account created successfully');
      } else {
        await login(formData.email, formData.password);
        announceToScreenReader('Logged in successfully');
      }
    } catch (err) {
      announceToScreenReader(
        `Error: ${err instanceof Error ? err.message : 'Authentication failed'}`
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getFormTitle = () => {
    if (isResetMode) return 'Reset Password';
    return isSignUp ? 'Create Account' : 'Sign In';
  };

  const getSubmitButtonText = () => {
    if (isResetMode) return 'Send Reset Email';
    return isSignUp ? 'Create Account' : 'Sign In';
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className="heading-2">{getFormTitle()}</h1>
          <p className="body-base text-muted">
            {isResetMode
              ? 'Enter your email to receive password reset instructions'
              : isSignUp
              ? 'Create your AccessibleOS account'
              : 'Welcome back to AccessibleOS'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          {isSignUp && !isResetMode && (
            <Input
              label="Display Name"
              type="text"
              value={formData.displayName}
              onChange={e => handleInputChange('displayName', e.target.value)}
              error={validationErrors.displayName}
              required
              autoComplete="name"
              aria-describedby="displayName-help"
            />
          )}

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            error={validationErrors.email}
            required
            autoComplete="email"
            aria-describedby="email-help"
          />

          {!isResetMode && (
            <>
              <div className={styles.passwordField}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  error={validationErrors.password}
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {isSignUp && (
                <div className={styles.passwordField}>
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    error={validationErrors.confirmPassword}
                    required
                    autoComplete="new-password"
                    aria-describedby="confirmPassword-help"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className={styles.submitButton}
          >
            {getSubmitButtonText()}
          </Button>

          {!isSignUp && !isResetMode && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setIsResetMode(true)}
            >
              Forgot your password?
            </button>
          )}
        </form>

        <div className={styles.footer}>
          {isResetMode ? (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setIsResetMode(false)}
            >
              Back to sign in
            </button>
          ) : (
            <p className="body-small text-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className={styles.linkButton}
                onClick={onToggleMode}
              >
                {isSignUp ? 'Sign in' : 'Create account'}
              </button>
            </p>
          )}
        </div>

        <div className={styles.demoInfo}>
          <p className="body-small text-muted">
            Demo credentials: demo@accessibleos.com / demo123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
