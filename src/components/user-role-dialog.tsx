'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/external-ui/dialog';
import { UserRoleForm } from '@/components/user-role-form';

interface UserRoleDialogProps {
  userId?: string;
  trigger?: React.ReactNode;
  onSave?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function UserRoleDialog({ userId, trigger, onSave, initialData }: UserRoleDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Edit User</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{userId ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {userId
              ? "Modify the user's details and permissions. Click save when done."
              : 'Add a new user to the system. Fill in the required information and click save.'}
          </DialogDescription>
        </DialogHeader>
        <UserRoleForm userId={userId} onSave={handleSave} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
