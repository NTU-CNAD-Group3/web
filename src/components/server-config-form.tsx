"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/external-ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/external-ui/form"
import { Input } from "@/components/external-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/external-ui/select"
import { useToast } from "@/hooks/use-toast"

const serverFormSchema = z.object({
  name: z.string().min(2, {
    message: "服務器名稱至少需要2個字符",
  }),
  model: z.string().min(1, {
    message: "請輸入服務器型號",
  }),
  status: z.string({
    required_error: "請選擇服務器狀態",
  }),
  position: z.string().min(1, {
    message: "請輸入機架位置",
  }),
  size: z.string().min(1, {
    message: "請輸入服務器大小",
  }),
  ip: z.string().optional(),
})

type ServerFormValues = z.infer<typeof serverFormSchema>

// 模擬數據 - 服務器詳情
const defaultValues: Partial<ServerFormValues> = {
  name: "",
  model: "",
  status: "online",
  position: "",
  size: "2",
  ip: "",
}

interface ServerConfigFormProps {
  serverId?: string
  rackId?: string
  onSave?: () => void
  initialData?: Partial<ServerFormValues>
}

export function ServerConfigForm({ serverId, rackId, onSave, initialData }: ServerConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: initialData || defaultValues,
  })

  async function onSubmit(data: ServerFormValues) {
    setIsLoading(true)

    // 模擬API調用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("保存服務器數據:", data)

    toast({
      title: serverId ? "服務器信息已更新" : "服務器已添加",
      description: serverId ? `服務器 ${data.name} 的信息已成功更新。` : `服務器 ${data.name} 已成功添加到機架。`,
    })

    setIsLoading(false)

    if (onSave) {
      onSave()
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
                <FormLabel>服務器名稱</FormLabel>
                <FormControl>
                  <Input placeholder="輸入服務器名稱" {...field} />
                </FormControl>
                <FormDescription>服務器的唯一標識符，例如 WEB-SRV-01</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>型號</FormLabel>
                <FormControl>
                  <Input placeholder="輸入服務器型號" {...field} />
                </FormControl>
                <FormDescription>服務器的製造商和型號</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>狀態</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇服務器狀態" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online">在線</SelectItem>
                    <SelectItem value="offline">離線</SelectItem>
                    <SelectItem value="maintenance">維護中</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>服務器的當前運行狀態</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP 地址</FormLabel>
                <FormControl>
                  <Input placeholder="輸入 IP 地址（可選）" {...field} />
                </FormControl>
                <FormDescription>服務器的 IP 地址（可選）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>機架位置</FormLabel>
                <FormControl>
                  <Input placeholder="輸入機架位置（U 編號）" {...field} />
                </FormControl>
                <FormDescription>服務器在機架中的位置，例如 36（表示從底部數第36個U位置）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>大小</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇服務器大小" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1U</SelectItem>
                    <SelectItem value="2">2U</SelectItem>
                    <SelectItem value="4">4U</SelectItem>
                    <SelectItem value="8">8U</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>服務器佔用的機架單位數量</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSave} type="button">
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : serverId ? "保存更改" : "添加服務器"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
