import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-white transition-colors dark:bg-[#1A1B1E]">
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center p-4">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white md:text-6xl">
            A <span className="text-[#3B82F6]">fully featured</span> Microservice Data Center Management System
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400 md:text-xl">
            DataHub is a microservice-based data center management system that provides a complete solution for managing data centers.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="bg-[#3B82F6] px-8 text-white hover:bg-[#2563EB]">
              <Link to="/login">Get started</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-200 bg-transparent text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              <Link to="https://github.com/NTU-CNAD-Group3" className="flex items-center">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
