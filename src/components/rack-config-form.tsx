"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/external-ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/external-ui/form"
import { Input } from "@/components/external-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/external-ui/select"
import { Textarea } from "@/components/external-ui/textarea"
import { useToast } from "@/hooks/use-toast"

const rackFormSchema = z.object({
  name: z.string().min(2, {
    message: "Rack name must be at least 2 characters.",
  }),
  model: z.string().min(1, {
    message: "Please enter the rack model.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  capacity: z.string().min(1, {
    message: "Please enter the rack capacity.",
  }),
  powerCapacity: z.string().min(1, {
    message: "Please enter the power capacity.",
  }),
  location: z.string().min(1, {
    message: "Please enter the rack location within the room.",
  }),
  notes: z.string().optional(),
})

type RackFormValues = z.infer<typeof rackFormSchema>

// Default values for the form
const defaultValues: Partial<RackFormValues> = {
  name: "",
  model: "APC NetShelter SX 42U",
  status: "online",
  capacity: "42U",
  powerCapacity: "5.0 kW",
  location: "",
  notes: "",
}

interface RackConfigFormProps {
  rackId?: string
  roomId?: string
  onSave?: () => void
  initialData?: Partial<RackFormValues>
}

export function RackConfigForm({ rackId, roomId, onSave, initialData }: RackConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<RackFormValues>({
    resolver: zodResolver(rackFormSchema),
    defaultValues: initialData || defaultValues,
  })

  async function onSubmit(data: RackFormValues) {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Saving rack data:", data)

    toast({
      title: rackId ? "Rack Information Updated" : "Rack Created",
      description: rackId
        ? `Rack ${data.name} has been updated successfully.`
        : `Rack ${data.name} has been created successfully.`,
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
                <FormLabel>Rack Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rack name" {...field} />
                </FormControl>
                <FormDescription>A unique identifier for the rack, e.g., A-01</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Position within the room" {...field} />
                </FormControl>
                <FormDescription>The rack's position within the room (e.g., Row 1, Position 3)</FormDescription>
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
                <FormLabel>Rack Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rack model" {...field} />
                </FormControl>
                <FormDescription>The manufacturer and model of the rack</FormDescription>
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
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Current operational status of the rack</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rack capacity" {...field} />
                </FormControl>
                <FormDescription>Total capacity of the rack, e.g., 42U</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="powerCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter power capacity" {...field} />
                </FormControl>
                <FormDescription>Maximum power capacity of the rack, e.g., 5.0 kW</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional information about this rack" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Any additional information or special considerations</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSave} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : rackId ? "Save Changes" : "Create Rack"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
