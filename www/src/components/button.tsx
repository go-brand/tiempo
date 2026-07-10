import { Link, type LinkProps } from '@tanstack/react-router';
import { buttonVariants, type ButtonProps } from 'fumadocs-ui/components/ui/button';
import { twMerge } from 'tailwind-merge';

type ButtonLinkProps = Omit<LinkProps, 'className' | 'children'> &
  Pick<ButtonProps, 'variant' | 'size'> & {
    className?: string;
    children: React.ReactNode;
  };

export function Button({
  variant = 'primary',
  size,
  className,
  children,
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
