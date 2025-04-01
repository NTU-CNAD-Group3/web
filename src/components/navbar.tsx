import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Github, Search } from 'lucide-react';
import { useTheme } from '@/provider/theme-provider';

import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex w-1/4 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/icon.png" alt="DataHub" className="h-8 w-8" />
            <span className="hidden text-lg font-semibold text-accent-foreground sm:block">DataHub</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex w-1/2 flex-1 items-center justify-center px-4">
          <button
            onClick={() => setOpen(true)}
            className="relative inline-flex h-10 w-full max-w-md items-center justify-start rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">Search documentation...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Documentation</CommandItem>
                <CommandItem>Components</CommandItem>
                <CommandItem>Themes</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>

        {/* Right: GitHub & Theme */}
        <div className="flex w-1/4 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="https://github.com/NTU-CNAD-Group3" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <span className="sr-only">Toggle theme</span>
            {theme === 'light' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
