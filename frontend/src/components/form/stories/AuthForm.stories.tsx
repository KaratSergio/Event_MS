import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../AuthForm';

const meta: Meta<typeof AuthForm> = {
  title: 'Form/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-4 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthForm>;

export const Login: Story = {
  args: {
    mode: 'login',
  },
};

export const Register: Story = {
  args: {
    mode: 'register',
  },
};

export const LoginWithError: Story = {
  args: {
    mode: 'login',
  },
  decorators: [
    (Story) => {
      const [showError, setShowError] = useState(true);
      return (
        <div>
          <button
            onClick={() => setShowError(!showError)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Toggle Error
          </button>
          {showError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
              Invalid email or password
            </div>
          )}
          <Story />
        </div>
      );
    },
  ],
};

export const RegisterWithError: Story = {
  args: {
    mode: 'register',
  },
  decorators: [
    (Story) => {
      const [showError, setShowError] = useState(true);
      return (
        <div>
          <button
            onClick={() => setShowError(!showError)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Toggle Error
          </button>
          {showError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
              Registration failed. Please try again.
            </div>
          )}
          <Story />
        </div>
      );
    },
  ],
};

export const LoginLoading: Story = {
  args: {
    mode: 'login',
  },
  decorators: [
    (Story) => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <div>
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Toggle Loading
          </button>
          <div className="relative">
            <Story />
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      );
    },
  ],
};

export const RegisterLoading: Story = {
  args: {
    mode: 'register',
  },
  decorators: [
    (Story) => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <div>
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Toggle Loading
          </button>
          <div className="relative">
            <Story />
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      );
    },
  ],
};

export const RegisterSuccess: Story = {
  args: {
    mode: 'register',
  },
  decorators: [
    (Story) => {
      const [showSuccess, setShowSuccess] = useState(true);
      return (
        <div>
          <button
            onClick={() => setShowSuccess(!showSuccess)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Toggle Success
          </button>
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-sm text-green-700">
              Registration successful! Redirecting to login...
            </div>
          )}
          <Story />
        </div>
      );
    },
  ],
};

export const PasswordValidationDemo: Story = {
  args: {
    mode: 'register',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <strong>Password requirements:</strong>
          <ul className="mt-2 space-y-1">
            <li>• At least 8 characters</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
            <li>• At least one special character (!@#$%^&amp;*)</li>
          </ul>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const LoginTestAccounts: Story = {
  args: {
    mode: 'login',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
          <strong>Test accounts:</strong>
          <div className="mt-2 space-y-1">
            <div>• bob@g.com / 123456</div>
            <div>• jane@g.com / 123456</div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const MobileLogin: Story = {
  args: {
    mode: 'login',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileRegister: Story = {
  args: {
    mode: 'register',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletLogin: Story = {
  args: {
    mode: 'login',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const TabletRegister: Story = {
  args: {
    mode: 'register',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: any) => {
      setLoading(true);
      setError('');
      setSuccess(false);

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.email === 'error@example.com') {
        setError(mode === 'login' ? 'Invalid email or password' : 'Registration failed');
      } else {
        if (mode === 'register') {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          alert(`Logged in as ${data.email}`);
        }
      }

      setLoading(false);
    };

    return (
      <div>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Login Mode
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 rounded ${mode === 'register' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Register Mode
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm">
          <strong>Demo instructions:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Use any email + any password (register requires strong password)</li>
            <li>• Use <code className="bg-white px-1">error@example.com</code> to trigger error</li>
            <li>• Registration requires: 8+ chars, A-Z, a-z, 0-9, !@#$%^&amp;*</li>
          </ul>
        </div>

        <AuthForm mode={mode} />
      </div>
    );
  },
};