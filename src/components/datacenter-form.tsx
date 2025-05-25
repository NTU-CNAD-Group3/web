import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/external-ui/input';
import { Button } from '@/components/external-ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/external-ui/form';

const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

type FormValues = z.infer<typeof schema>;

export function DataCenterForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/DC`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔐 Important if using cookie-based sessions
        body: JSON.stringify({ name: data.name }),
      });

      if (res.status === 403) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to create a data center.',
          variant: 'destructive',
        });
        return;
      }

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to create data center');
      }

      toast({
        title: 'Success',
        description: `Data center "${data.name}" created successfully.`,
      });

      navigate('/datacenters');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Center Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/datacenters')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
