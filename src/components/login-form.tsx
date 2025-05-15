import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setError('');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          setError(result.message || 'Login failed.');
        } else {
          const session = await response.json();
          console.log('✅ Session:', session); // 🔍 Log the session

          // Optionally store session info
          // localStorage.setItem('token', session.token);

          // 🔁 Redirect to /main
          navigate('/main');
        }
      } catch (err) {
        console.error('❌ Network error:', err);
        setError('Network error. Please try again.');
      }
    },
    [form, navigate],
  );

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={form.email} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forget_password" className="ml-auto text-sm underline underline-offset-4">
              Forget your password?
            </Link>
          </div>
          <Input id="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
