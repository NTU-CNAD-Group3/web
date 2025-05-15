'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/external-ui/dialog';
import { ServerConfigForm } from '@/components/server-config-form';

interface ServerConfigDialogProps {
  serverId?: string;
  rackId?: string;
  trigger?: React.ReactNode;
  onSave?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function ServerConfigDialog({ serverId, rackId, trigger, onSave, initialData }: ServerConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">配置服務器</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{serverId ? '編輯服務器' : '添加新服務器'}</DialogTitle>
          <DialogDescription>
            {serverId ? '修改服務器的詳細信息和配置。完成後點擊保存。' : '添加新服務器到機架。填寫所需信息後點擊保存。'}
          </DialogDescription>
        </DialogHeader>
        <ServerConfigForm serverId={serverId} rackId={rackId} onSave={handleSave} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
