import type React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AppLinkProps extends RouterLinkProps {
  className?: string;
  children: React.ReactNode;
}

export function Link({ className, children, ...props }: AppLinkProps) {
  return (
    <RouterLink className={cn('text-primary hover:underline', className)} {...props}>
      {children}
    </RouterLink>
  );
}
