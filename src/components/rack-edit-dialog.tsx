"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/external-ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/external-ui/dialog"
import { RackEditForm } from "@/components/rack-edit-form"

interface RackEditDialogProps {
  rackId?: string
  trigger?: React.ReactNode
  onSave?: () => void
  initialData?: any
}

export function RackEditDialog({ rackId, trigger, onSave, initialData }: RackEditDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    setOpen(false)
    if (onSave) {
      onSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">編輯機架</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{rackId ? "編輯機架" : "添加新機架"}</DialogTitle>
          <DialogDescription>
            {rackId ? "修改機架的詳細信息和配置。完成後點擊保存。" : "添加新機架到數據中心。填寫所需信息後點擊保存。"}
          </DialogDescription>
        </DialogHeader>
        <RackEditForm rackId={rackId} onSave={handleSave} initialData={initialData} />
      </DialogContent>
    </Dialog>
  )
}
