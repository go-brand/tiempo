import { Link, type LinkProps } from '@tanstack/react-router';
import { buttonVariants, type ButtonProps } from 'fumadocs-ui/components/ui/button';
import { cn } from 'fumadocs-ui/lib/cn';

type ButtonLinkProps = LinkProps & ButtonProps & {
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
