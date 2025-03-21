import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
}

export function Button({ children, className, variant = 'primary', ...rest }: ButtonProps) {
  const buttonStyles = clsx(
    'flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    {
      'bg-teal-800 hover:bg-teal-600 focus-visible:outline-teal-800 active:bg-teal-600': variant === 'primary',
      'bg-red-800 hover:bg-red-600 focus-visible:outline-red-800 active:bg-red-600': variant === 'danger',
    },
    className,
  );

  return (
    <button {...rest} className={buttonStyles}>
      {children}
    </button>
  );
}