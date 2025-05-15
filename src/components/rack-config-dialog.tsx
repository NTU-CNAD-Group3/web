'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/external-ui/dialog';
import { RackConfigForm } from '@/components/rack-config-form';

interface RackConfigDialogProps {
  rackId?: string;
  roomId?: string;
  trigger?: React.ReactNode;
  onSave?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function RackConfigDialog({ rackId, roomId, trigger, onSave, initialData }: RackConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Configure Rack</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{rackId ? 'Edit Rack' : 'Add New Rack'}</DialogTitle>
          <DialogDescription>
            {rackId
              ? "Modify the rack's details and configuration. Click save when done."
              : 'Add a new rack to the room. Fill in the required information and click save.'}
          </DialogDescription>
        </DialogHeader>
        <RackConfigForm rackId={rackId} roomId={roomId} onSave={handleSave} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
