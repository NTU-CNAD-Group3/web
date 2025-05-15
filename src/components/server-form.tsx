'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/external-ui/form';
import { Input } from '@/components/external-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const serverFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Server name must be at least 2 characters.',
  }),
  model: z.string().min(1, {
    message: 'Please enter the server model.',
  }),
  status: z.string({
    required_error: 'Please select a status.',
  }),
  size: z.string().min(1, {
    message: 'Please select the server size.',
  }),
  datacenter: z.string().min(1, {
    message: 'Please select a data center.',
  }),
  room: z.string().min(1, {
    message: 'Please select a room.',
  }),
  rack: z.string().min(1, {
    message: 'Please select a rack.',
  }),
  position: z.string().min(1, {
    message: 'Please enter the position in the rack.',
  }),
  ip: z.string().optional(),
  hostname: z.string().optional(),
  os: z.string().optional(),
  cpu: z.string().optional(),
  memory: z.string().optional(),
  storage: z.string().optional(),
  managementIp: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

type ServerFormValues = z.infer<typeof serverFormSchema>;

// Default values for the form
const defaultValues: Partial<ServerFormValues> = {
  name: '',
  model: '',
  status: 'online',
  size: '2',
  datacenter: '',
  room: '',
  rack: '',
  position: '',
  ip: '',
  hostname: '',
  os: '',
  cpu: '',
  memory: '',
  storage: '',
  managementIp: false,
  notes: '',
};

// Mock data for dropdowns
const dataCenters = [
  { id: 'dc-001', name: 'East Coast DC' },
  { id: 'dc-002', name: 'West Coast DC' },
  { id: 'dc-003', name: 'Central DC' },
  { id: 'dc-004', name: 'European DC' },
];

interface ServerFormProps {
  serverId?: string;
  onSave?: () => void;
  initialData?: Partial<ServerFormValues>;
}

export function ServerForm({ serverId, onSave, initialData }: ServerFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDC, setSelectedDC] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get rooms for the selected data center
  const getRoomsForDC = (dcId: string) => {
    // In a real app, this would fetch from an API
    if (dcId === 'East Coast DC') {
      return [
        { id: 'room-a', name: 'Room A' },
        { id: 'room-b', name: 'Room B' },
      ];
    } else if (dcId === 'West Coast DC') {
      return [{ id: 'room-c', name: 'Room C' }];
    } else if (dcId === 'Central DC') {
      return [{ id: 'room-d', name: 'Room D' }];
    } else if (dcId === 'European DC') {
      return [{ id: 'room-e', name: 'Room E' }];
    } else {
      return [];
    }
  };

  // Get racks for the selected room
  const getRacksForRoom = (roomId: string) => {
    // In a real app, this would fetch from an API
    if (roomId === 'Room A') {
      return [
        { id: 'a-01', name: 'A-01' },
        { id: 'a-02', name: 'A-02' },
        { id: 'a-03', name: 'A-03' },
        { id: 'a-04', name: 'A-04' },
      ];
    } else if (roomId === 'Room B') {
      return [
        { id: 'b-01', name: 'B-01' },
        { id: 'b-02', name: 'B-02' },
        { id: 'b-03', name: 'B-03' },
      ];
    } else if (roomId === 'Room C') {
      return [
        { id: 'c-01', name: 'C-01' },
        { id: 'c-02', name: 'C-02' },
        { id: 'c-03', name: 'C-03' },
        { id: 'c-04', name: 'C-04' },
      ];
    } else if (roomId === 'Room D') {
      return [
        { id: 'd-01', name: 'D-01' },
        { id: 'd-02', name: 'D-02' },
      ];
    } else if (roomId === 'Room E') {
      return [
        { id: 'e-01', name: 'E-01' },
        { id: 'e-02', name: 'E-02' },
      ];
    } else {
      return [];
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rooms, setRooms] = useState(getRoomsForDC(selectedDC));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [racks, setRacks] = useState(getRacksForRoom(selectedRoom));

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Update rooms when data center changes
  const handleDataCenterChange = (value: string) => {
    setSelectedDC(value);
    form.setValue('datacenter', value);
    form.setValue('room', '');
    form.setValue('rack', '');
    setRooms(getRoomsForDC(value));
    setRacks([]);
  };

  // Update racks when room changes
  const handleRoomChange = (value: string) => {
    setSelectedRoom(value);
    form.setValue('room', value);
    form.setValue('rack', '');
    setRacks(getRacksForRoom(value));
  };

  async function onSubmit(data: ServerFormValues) {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Saving server data:', data);

    toast({
      title: serverId ? 'Server Updated' : 'Server Created',
      description: serverId ? `Server ${data.name} has been updated successfully.` : `Server ${data.name} has been created successfully.`,
    });

    setIsLoading(false);

    if (onSave) {
      onSave();
    } else {
      navigate('/servers');
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
                <FormLabel>Server Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter server name" {...field} />
                </FormControl>
                <FormDescription>A unique identifier for the server, e.g., WEB-SRV-01</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter server model" {...field} />
                </FormControl>
                <FormDescription>The manufacturer and model of the server</FormDescription>
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
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Current operational status of the server</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select server size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1U</SelectItem>
                    <SelectItem value="2">2U</SelectItem>
                    <SelectItem value="4">4U</SelectItem>
                    <SelectItem value="8">8U</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The physical size of the server in rack units</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="datacenter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Center</FormLabel>
                <Select onValueChange={handleDataCenterChange} defaultValue={field.value}>
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
                <FormDescription>The data center where the server is located</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <Select onValueChange={handleRoomChange} defaultValue={field.value} disabled={!selectedDC}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                  </FormControl>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
