'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/external-ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/external-ui/form';
import { Input } from '@/components/external-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';
import { Checkbox } from '@/components/external-ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  role: z.string({
    required_error: 'Please select a role.',
  }),
  department: z.string().min(1, {
    message: 'Please enter a department.',
  }),
  status: z.string({
    required_error: 'Please select a status.',
  }),
  permissions: z.object({
    manageDataCenters: z.boolean().default(false),
    manageRooms: z.boolean().default(false),
    manageRacks: z.boolean().default(false),
    manageServers: z.boolean().default(false),
    viewReports: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Default values for the form
const defaultValues: Partial<UserFormValues> = {
  name: '',
  email: '',
  role: 'user',
  department: '',
  status: 'active',
  permissions: {
    manageDataCenters: false,
    manageRooms: false,
    manageRacks: false,
    manageServers: false,
    viewReports: false,
    manageUsers: false,
  },
};

interface UserRoleFormProps {
  userId?: string;
  onSave?: () => void;
  initialData?: Partial<UserFormValues>;
}

export function UserRoleForm({ userId, onSave, initialData }: UserRoleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Set default permissions based on role
  const handleRoleChange = (value: string) => {
    form.setValue('role', value);

    if (value === 'administrator') {
      form.setValue('permissions', {
        manageDataCenters: true,
        manageRooms: true,
        manageRacks: true,
        manageServers: true,
        viewReports: true,
        manageUsers: true,
      });
    } else {
      form.setValue('permissions', {
        manageDataCenters: false,
        manageRooms: false,
        manageRacks: true,
        manageServers: true,
        viewReports: true,
        manageUsers: false,
      });
    }
  };

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Saving user data:', data);

    toast({
      title: userId ? 'User Updated' : 'User Created',
      description: userId ? `User ${data.name} has been updated successfully.` : `User ${data.name} has been created successfully.`,
    });

    setIsLoading(false);

    if (onSave) {
      onSave();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormDescription>The user's full name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormDescription>The user's email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={handleRoleChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The user's role in the system</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Enter department" {...field} />
                </FormControl>
                <FormDescription>The user's department</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The user's account status</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Permissions</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="permissions.manageDataCenters"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Manage Data Centers</FormLabel>
                    <FormDescription>Can create, edit, and delete data centers</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions.manageRooms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Manage Rooms</FormLabel>
                    <FormDescription>Can create, edit, and delete rooms</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions.manageRacks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Manage Racks</FormLabel>
                    <FormDescription>Can create, edit, and delete racks</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions.manageServers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Manage Servers</FormLabel>
                    <FormDescription>Can create, edit, and delete servers</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions.viewReports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>View Reports</FormLabel>
                    <FormDescription>Can view and export reports</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions.manageUsers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Manage Users</FormLabel>
                    <FormDescription>Can create, edit, and delete users</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSave} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : userId ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
