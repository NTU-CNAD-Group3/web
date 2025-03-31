import { Link } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';

export default function ErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center bg-background transition-colors">
      <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <h2 className="mb-8 text-2xl font-semibold text-gray-600 dark:text-gray-300">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center text-gray-500 dark:text-gray-400"> Sorry we can’t find what you’re looking for.</p>
      <Link to="/" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full max-w-xs border-2'}>
        Click here to go back
      </Link>
    </div>
  );
}
