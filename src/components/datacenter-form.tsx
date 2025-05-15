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
import { useNavigate } from 'react-router-dom'

const dataCenterFormSchema = z.object({
  name: z.string().min(2, {
    message: "Data center name must be at least 2 characters.",
  }),
  location: z.string().min(1, {
    message: "Please enter a location.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  address: z.string().min(1, {
    message: "Please enter an address.",
  }),
  powerCapacity: z.string().min(1, {
    message: "Please enter power capacity.",
  }),
  coolingCapacity: z.string().min(1, {
    message: "Please enter cooling capacity.",
  }),
  notes: z.string().optional(),
})

type DataCenterFormValues = z.infer<typeof dataCenterFormSchema>

// Default values for the form
const defaultValues: Partial<DataCenterFormValues> = {
  name: "",
  location: "",
  status: "operational",
  address: "",
  powerCapacity: "",
  coolingCapacity: "",
  notes: "",
}

interface DataCenterFormProps {
  dataCenterId?: string
  onSave?: () => void
  initialData?: Partial<DataCenterFormValues>
}

export function DataCenterForm({ dataCenterId, onSave, initialData }: DataCenterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<DataCenterFormValues>({
    resolver: zodResolver(dataCenterFormSchema),
    defaultValues: initialData || defaultValues,
  })

  async function onSubmit(data: DataCenterFormValues) {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Removed unnecessary console.log statement to prevent logging in production

    toast({
      title: dataCenterId ? "Data Center Updated" : "Data Center Created",
      description: dataCenterId
        ? `Data center ${data.name} has been updated successfully.`
        : `Data center ${data.name} has been created successfully.`,
    })

    setIsLoading(false)

    if (onSave) {
      onSave()
    } else {
      navigate("/datacenters")
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
                  <Input placeholder="Enter data center name" {...field} />
                </FormControl>
                <FormDescription>A unique identifier for the data center</FormDescription>
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
                  <Input placeholder="City, State/Country" {...field} />
                </FormControl>
                <FormDescription>The geographic location of the data center</FormDescription>
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
                <FormDescription>Current operational status of the data center</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormDescription>Physical address of the data center</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="powerCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 500 kW" {...field} />
                </FormControl>
                <FormDescription>Total power capacity of the data center</FormDescription>
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
                  <Input placeholder="e.g., 400 tons" {...field} />
                </FormControl>
                <FormDescription>Total cooling capacity of the data center</FormDescription>
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
                <Textarea
                  placeholder="Additional information about this data center"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Any additional information or special considerations</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate("/datacenters")} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : dataCenterId ? "Save Changes" : "Create Data Center"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
