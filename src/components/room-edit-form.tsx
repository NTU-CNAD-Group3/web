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

const roomFormSchema = z.object({
  name: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  datacenter: z.string().min(1, {
    message: "Please select a data center.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  area: z.string().min(1, {
    message: "Please enter the room area.",
  }),
  maxRacks: z.string().min(1, {
    message: "Please enter the maximum number of racks.",
  }),
  powerCapacity: z.string().min(1, {
    message: "Please enter the power capacity.",
  }),
  coolingCapacity: z.string().min(1, {
    message: "Please enter the cooling capacity.",
  }),
  notes: z.string().optional(),
})

type RoomFormValues = z.infer<typeof roomFormSchema>

// Default values for the form
const defaultValues: Partial<RoomFormValues> = {
  name: "",
  datacenter: "",
  status: "operational",
  area: "",
  maxRacks: "",
  powerCapacity: "",
  coolingCapacity: "",
  notes: "",
}

// Mock data - Data centers for selection
const dataCenters = [
  { id: "dc-001", name: "East Coast DC" },
  { id: "dc-002", name: "West Coast DC" },
  { id: "dc-003", name: "Central DC" },
  { id: "dc-004", name: "European DC" },
]

interface RoomEditFormProps {
  roomId?: string
  onSave?: () => void
  initialData?: Partial<RoomFormValues>
}

export function RoomEditForm({ roomId, onSave, initialData }: RoomEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: initialData || defaultValues,
  })

  async function onSubmit(data: RoomFormValues) {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Saving room data:", data)

    toast({
      title: roomId ? "Room Information Updated" : "Room Created",
      description: roomId
        ? `Room ${data.name} has been updated successfully.`
        : `Room ${data.name} has been created successfully.`,
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
                <FormLabel>Room Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room name" {...field} />
                </FormControl>
                <FormDescription>A unique identifier for the room, e.g., Room A</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datacenter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Center</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data center" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataCenters.map((dc) => (
                      <SelectItem key={dc.id} value={dc.name}>
                        {dc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The data center where this room is located</FormDescription>
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Current operational status of the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1000 sq ft" {...field} />
                </FormControl>
                <FormDescription>The physical area of the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="maxRacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Racks</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormDescription>Maximum number of racks this room can hold</FormDescription>
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
                  <Input placeholder="e.g., 200 kW" {...field} />
                </FormControl>
                <FormDescription>Total power capacity of the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coolingCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cooling Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 150 tons" {...field} />
                </FormControl>
                <FormDescription>Total cooling capacity of the room</FormDescription>
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
                <Textarea placeholder="Additional information about this room" className="resize-none" {...field} />
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
            {isLoading ? "Saving..." : roomId ? "Save Changes" : "Create Room"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
