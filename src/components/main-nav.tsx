import type React from 'react';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { ServerIcon as ServerStack } from 'lucide-react';
import { Upload } from 'lucide-react';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold">
        <ServerStack className="h-6 w-6" />
        <span>DataHub</span>
      </Link>
      <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link to="/overview" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Overview
      </Link>
      <Link to="/datacenters" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Operation
      </Link>
      <Link to="/search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Search
      </Link>
      <Link to="/expand" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Expand
      </Link>
      <Link to="/import" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Upload className="mr-1 h-3 w-3" />
        Import
      </Link>
    </nav>
  );
}
