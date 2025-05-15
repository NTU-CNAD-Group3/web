import type React from 'react';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { ServerIcon as ServerStack } from 'lucide-react';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold">
        <ServerStack className="h-6 w-6" />
        <span>DC Manager</span>
      </Link>
      <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link to="/datacenters" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Data Centers
      </Link>
      <Link to="/rooms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Rooms
      </Link>
      <Link to="/servers" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Servers
      </Link>
      <Link to="/monitoring" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Monitoring
      </Link>
      <Link to="/users" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Users
      </Link>
    </nav>
  );
}
