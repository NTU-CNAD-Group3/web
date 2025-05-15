'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/external-ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/external-ui/form';
import { Input } from '@/components/external-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';
import { Textarea } from '@/components/external-ui/textarea';
import { useToast } from '@/hooks/use-toast';

const rackFormSchema = z.object({
  name: z.string().min(2, {
    message: '機架名稱至少需要2個字符',
  }),
  location: z.string().min(1, {
    message: '請選擇機架位置',
  }),
  model: z.string().min(1, {
    message: '請輸入機架型號',
  }),
  capacity: z.string().min(1, {
    message: '請輸入機架容量',
  }),
  powerCapacity: z.string().min(1, {
    message: '請輸入電源容量',
  }),
  notes: z.string().optional(),
});

type RackFormValues = z.infer<typeof rackFormSchema>;

// 模擬數據 - 機架詳情
const defaultValues: Partial<RackFormValues> = {
  name: 'A-01',
  location: 'A 排',
  model: 'Dell PowerEdge 42U',
  capacity: '42U',
  powerCapacity: '5.0 kW',
  notes: '主要用於網絡和應用服務器',
};

interface RackEditFormProps {
  rackId?: string;
  onSave?: () => void;
  initialData?: Partial<RackFormValues>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RackEditForm({ rackId, onSave, initialData }: RackEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RackFormValues>({
    resolver: zodResolver(rackFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: RackFormValues) {
    setIsLoading(true);

    // 模擬API調用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('保存機架數據:', data);

    toast({
      title: '機架信息已更新',
      description: `機架 ${data.name} 的信息已成功更新。`,
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
                <FormLabel>機架名稱</FormLabel>
                <FormControl>
                  <Input placeholder="輸入機架名稱" {...field} />
                </FormControl>
                <FormDescription>機架的唯一標識符，例如 A-01</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>位置</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇機架位置" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A 排">A 排</SelectItem>
                    <SelectItem value="B 排">B 排</SelectItem>
                    <SelectItem value="C 排">C 排</SelectItem>
                    <SelectItem value="D 排">D 排</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>機架在數據中心的物理位置</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>機架型號</FormLabel>
                <FormControl>
                  <Input placeholder="輸入機架型號" {...field} />
                </FormControl>
                <FormDescription>機架的製造商和型號</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>容量</FormLabel>
                <FormControl>
                  <Input placeholder="輸入機架容量" {...field} />
                </FormControl>
                <FormDescription>機架的總容量，例如 42U</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="powerCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電源容量</FormLabel>
              <FormControl>
                <Input placeholder="輸入電源容量" {...field} />
              </FormControl>
              <FormDescription>機架的最大電源容量，例如 5.0 kW</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備註</FormLabel>
              <FormControl>
                <Textarea placeholder="輸入關於此機架的任何附加信息" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>任何關於此機架的附加信息或說明</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSave} type="button">
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : '保存更改'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
