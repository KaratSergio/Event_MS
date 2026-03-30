import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/store/authStore';
import BackButton from '../ui/BackButton';
import {
  EnvelopeIcon, LockClosedIcon, ArrowRightIcon,
  CheckCircleIcon, EyeIcon, EyeSlashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();

  const isLogin = mode === 'login';
  const title = isLogin ? 'Sign in to your account' : 'Join the Event Management community';
  const buttonText = isLogin ? 'Sign In' : 'Create Account';
  const loadingText = isLogin ? 'Signing in...' : 'Creating account...';
  const linkText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const linkTo = isLogin ? '/auth/register' : '/auth/login';
  const linkAction = isLogin ? 'Create an account' : 'Sign in';

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  const passwordValidations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };

  const isPasswordValid = !isLogin ? Object.values(passwordValidations).every(Boolean) : true;
  const isFormValid = isValidEmail(email) && (isLogin ? true : isPasswordValid);

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setTouched({ email: true, password: true });

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isLogin) {
      if (!passwordValidations.minLength) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!passwordValidations.hasUppercase) {
        setError('Password must contain at least one uppercase letter');
        return;
      }
      if (!passwordValidations.hasLowercase) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!passwordValidations.hasNumber) {
        setError('Password must contain at least one number');
        return;
      }
      if (!passwordValidations.hasSpecialChar) {
        setError('Password must contain at least one special character (!@#$%^&*)');
        return;
      }
    }

    try {
      if (isLogin) {
        await login({ email, password });
        navigate('/events');
      } else {
        await register({ email, password });
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth/login', {
            state: { message: 'Registration successful! Please login.' }
          });
        }, 1500);
      }
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fillTestCredentials = (testEmail: string) => {
    if (isLogin) {
      setEmail(testEmail);
      setPassword('123456');
      setTouched({ email: true, password: true });
    }
  };

  const getEmailError = () => {
    if (!touched.email) return null;
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Please enter a valid email address';
    return null;
  };

  const emailError = getEmailError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6">
      <div className="max-w-md w-full">
        <BackButton to="/events" label="Back to Events" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-white" aria-hidden="true">EM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-sm text-gray-600 mt-2">{title}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Success Message */}
          {!isLogin && success && (
            <div
              className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"
              role="status"
              aria-live="polite"
            >
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Registration successful! Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
                    ${emailError && touched.email
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300'
                    }`}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading || (!isLogin && success)}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={!isLogin && touched.password && !isPasswordValid}
                  aria-describedby={!isLogin && touched.password && !isPasswordValid ? "password-requirements" : undefined}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={isLoading || (!isLogin && success)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!isLogin && success) || (touched.email && touched.password && !isFormValid)}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
                  {loadingText}
                </>
              ) : (
                <>
                  {buttonText}
                  <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Buttons - only for login mode */}
          {isLogin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" aria-hidden="true"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Quick Login with Test Accounts</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillTestCredentials('bob@g.com')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mr-2">
                    B
                  </div>
                  <span className="text-sm text-gray-700">bob@g.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillTestCredentials('jane@g.com')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-xs mr-2">
                    J
                  </div>
                  <span className="text-sm text-gray-700">jane@g.com</span>
                </button>
              </div>
            </div>
          )}

          {/* Auth Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {linkText}{' '}
            <Link
              to={linkTo}
              className="font-medium text-green-600 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              {linkAction}
            </Link>
          </p>

          {/* Password Requirements - only for register */}
          {!isLogin && (
            <div
              id="password-requirements"
              className={`mt-6 p-4 rounded-lg transition-colors ${touched.password && !isPasswordValid ? 'bg-red-50' : 'bg-gray-50'
                }`}
              role="region"
              aria-label="Password requirements"
            >
              <h4 className="text-xs font-medium text-gray-700 mb-2">Password requirements:</h4>
              <ul className="text-xs space-y-1">
                <li className="flex items-center">
                  <CheckCircleIcon className={`h-3 w-3 mr-2 shrink-0 ${passwordValidations.minLength ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <span className={touched.password && !passwordValidations.minLength ? 'text-red-600' : 'text-gray-500'}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className={`h-3 w-3 mr-2 shrink-0 ${passwordValidations.hasUppercase ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <span className={touched.password && !passwordValidations.hasUppercase ? 'text-red-600' : 'text-gray-500'}>
                    At least one uppercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className={`h-3 w-3 mr-2 shrink-0 ${passwordValidations.hasLowercase ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <span className={touched.password && !passwordValidations.hasLowercase ? 'text-red-600' : 'text-gray-500'}>
                    At least one lowercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className={`h-3 w-3 mr-2 shrink-0 ${passwordValidations.hasNumber ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <span className={touched.password && !passwordValidations.hasNumber ? 'text-red-600' : 'text-gray-500'}>
                    At least one number
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className={`h-3 w-3 mr-2 shrink-0 ${passwordValidations.hasSpecialChar ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <span className={touched.password && !passwordValidations.hasSpecialChar ? 'text-red-600' : 'text-gray-500'}>
                    At least one special character (!@#$%^&*)
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}