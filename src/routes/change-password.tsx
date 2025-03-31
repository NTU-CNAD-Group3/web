import { ChangePasswordForm } from '@/components/change-password';

export default function ChangePasswordPage() {
  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src="/icon.png" alt="Image" className="absolute inset-0 h-full w-full bg-background object-cover" />
      </div>
    </div>
  );
}
