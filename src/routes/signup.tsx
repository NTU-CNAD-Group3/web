import { SignUpForm } from '@/components/signup-form';

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-65px) grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src="/icon.png" alt="Image" className="absolute inset-0 h-full w-full bg-background object-cover" />
      </div>
    </div>
  );
}
