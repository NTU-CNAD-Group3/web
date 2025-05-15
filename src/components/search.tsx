import { Input } from '@/components/external-ui/input';
import { SearchIcon } from 'lucide-react';

export function Search() {
  return (
    <div className="relative w-64">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder="Search..." className="w-full pl-8" />
    </div>
  );
}
