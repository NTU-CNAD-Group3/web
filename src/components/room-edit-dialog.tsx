'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/external-ui/dialog';
import { RoomEditForm } from '@/components/room-edit-form';

interface RoomEditDialogProps {
  roomId?: string;
  trigger?: React.ReactNode;
  onSave?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function RoomEditDialog({ roomId, trigger, onSave, initialData }: RoomEditDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Edit Room</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{roomId ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          <DialogDescription>
            {roomId
              ? "Modify the room's details and configuration. Click save when done."
              : 'Add a new room to the data center. Fill in the required information and click save.'}
          </DialogDescription>
        </DialogHeader>
        <RoomEditForm roomId={roomId} onSave={handleSave} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
