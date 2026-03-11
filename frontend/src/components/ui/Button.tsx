import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'join' | 'leave' | 'full' | 'ended' | 'disabled';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  join: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  leave: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  full: 'bg-red-100 text-red-600 cursor-not-allowed focus:ring-red-500',
  ended: 'bg-yellow-100 text-yellow-600 cursor-not-allowed focus:ring-gray-500',
  disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-gray-500',
};

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-4 py-2 text-sm sm:text-base',
  lg: 'px-6 py-3 text-base sm:text-lg',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'sm',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'right',
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
    const widthClass = fullWidth ? 'w-full' : '';
    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];
    const iconSize = iconSizes[size];

    const isDisabled = disabled || loading || variant === 'full' || variant === 'disabled';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className={`animate-spin ${iconSize} ${children ? 'mr-2' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={`${iconSize} ${children ? 'mr-2' : ''}`}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={`${iconSize} ${children ? 'ml-2' : ''}`}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const JoinButton = (props: ButtonProps) => <Button variant="join" {...props} />;
export const LeaveButton = (props: ButtonProps) => <Button variant="leave" {...props} />;
export const FullButton = (props: ButtonProps) => <Button variant="full" {...props} />;
export const EndedButton = (props: ButtonProps) => <Button variant="ended" {...props} />;
export const DisabledButton = (props: ButtonProps) => <Button variant="disabled" {...props} />;