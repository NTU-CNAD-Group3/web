'use client';

import { Link } from '@/components/link';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, MoreHorizontal, Plus, Power, Server, Thermometer, WrenchIcon } from 'lucide-react';
import { Badge } from '@/components/external-ui/badge';
import { Button } from '@/components/external-ui/button';
import { Progress } from '@/components/external-ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/external-ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/external-ui/accordion';
import { RoomEditDialog } from '@/components/room-edit-dialog';
import { RackConfigDialog } from '@/components/rack-config-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/external-ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';

// Mock data - Room details
const roomsData = {
  'room-a': {
    id: 'room-a',
    name: 'Room A',
    datacenter: 'East Coast DC',
    status: 'operational',
    area: '1000 sq ft',
    maxRacks: 20,
    racks: 12,
    usedRacks: 12,
    power: {
      capacity: '200 kW',
      usage: '120 kW',
      usagePercent: 60,
    },
    cooling: {
      capacity: '150 tons',
      usage: '90 tons',
      usagePercent: 60,
    },
    temperature: '22°C',
    humidity: '45%',
    racksList: [
      {
        id: 'a-01',
        name: 'A-01',
        status: 'online',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '36U',
        servers: 12,
        power: '3.2 kW',
      },
      {
        id: 'a-02',
        name: 'A-02',
        status: 'online',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '28U',
        servers: 8,
        power: '2.8 kW',
      },
      {
        id: 'a-03',
        name: 'A-03',
        status: 'maintenance',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '12U',
        servers: 4,
        power: '1.5 kW',
      },
      {
        id: 'a-04',
        name: 'A-04',
        status: 'online',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '38U',
        servers: 15,
        power: '4.1 kW',
      },
    ],
  },
  'room-b': {
    id: 'room-b',
    name: 'Room B',
    datacenter: 'East Coast DC',
    status: 'operational',
    area: '800 sq ft',
    maxRacks: 15,
    racks: 8,
    usedRacks: 8,
    power: {
      capacity: '150 kW',
      usage: '90 kW',
      usagePercent: 60,
    },
    cooling: {
      capacity: '120 tons',
      usage: '70 tons',
      usagePercent: 58,
    },
    temperature: '23°C',
    humidity: '40%',
    racksList: [
      {
        id: 'b-01',
        name: 'B-01',
        status: 'online',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '30U',
        servers: 10,
        power: '2.9 kW',
      },
      {
        id: 'b-02',
        name: 'B-02',
        status: 'offline',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '0U',
        servers: 0,
        power: '0 kW',
      },
      {
        id: 'b-03',
        name: 'B-03',
        status: 'online',
        model: 'APC NetShelter SX 42U',
        capacity: '42U',
        usedCapacity: '32U',
        servers: 12,
        power: '3.4 kW',
      },
    ],
  },
};

// Mock data - Data centers for selection
const dataCenters = [
  { id: 'dc-001', name: 'East Coast DC' },
  { id: 'dc-002', name: 'West Coast DC' },
  { id: 'dc-003', name: 'Central DC' },
  { id: 'dc-004', name: 'European DC' },
];

interface RoomDetailsProps {
  roomId?: string;
}

export function RoomDetails({ roomId = 'room-a' }: RoomDetailsProps) {
  const [selectedDC, setSelectedDC] = useState<string>('dc-001');
  const [selectedRoom, setSelectedRoom] = useState<string>(roomId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roomData, setRoomData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Get rooms for the selected data center
  const getRoomsForDC = (dcId: string) => {
    // In a real app, this would fetch from an API
    if (dcId === 'dc-001') {
      return [
        { id: 'room-a', name: 'Room A' },
        { id: 'room-b', name: 'Room B' },
      ];
    } else if (dcId === 'dc-002') {
      return [{ id: 'room-c', name: 'Room C' }];
    } else if (dcId === 'dc-003') {
      return [{ id: 'room-d', name: 'Room D' }];
    } else {
      return [{ id: 'room-e', name: 'Room E' }];
    }
  };

  const [rooms, setRooms] = useState(getRoomsForDC(selectedDC));

  useEffect(() => {
    // Update rooms when data center changes
    setRooms(getRoomsForDC(selectedDC));
    // Reset selected room if not in the new data center
    if (!getRoomsForDC(selectedDC).some((r) => r.id === selectedRoom)) {
      setSelectedRoom(getRoomsForDC(selectedDC)[0]?.id || '');
    }
  }, [selectedRoom, selectedDC]);

  useEffect(() => {
    // In a real application, this would fetch from an API
    setRoomData(roomsData[selectedRoom as keyof typeof roomsData] || null);
  }, [selectedRoom, refreshKey]);

  if (!roomData) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <div className="w-48">
            <Select value={selectedDC} onValueChange={setSelectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select Data Center" />
              </SelectTrigger>
              <SelectContent>
                {dataCenters.map((dc) => (
                  <SelectItem key={dc.id} value={dc.id}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>Loading room data...</div>
      </div>
    );
  }

  const handleRoomUpdate = () => {
    toast({
      title: 'Room Information Updated',
      description: `Room ${roomData.name} information has been successfully updated.`,
    });
    setRefreshKey((prev) => prev + 1);
  };

  const handleRackUpdate = () => {
    toast({
      title: 'Rack Added',
      description: 'New rack has been successfully added to the room.',
    });
    setRefreshKey((prev) => prev + 1);
  };

  const handleRackRemove = (rackId: string) => {
    toast({
      title: 'Rack Removed',
      description: 'Rack has been removed from the room.',
    });
    // In a real application, this would call an API to delete the rack
    // Simulate removing a rack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRacks = roomData.racksList.filter((rack: any) => rack.id !== rackId);
    setRoomData({
      ...roomData,
      racksList: updatedRacks,
      racks: updatedRacks.length,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'online':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <WrenchIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
      case 'online':
        return 'Operational';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
      case 'online':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="flex space-x-2">
          <div className="w-48">
            <Select value={selectedDC} onValueChange={setSelectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select Data Center" />
              </SelectTrigger>
              <SelectContent>
                {dataCenters.map((dc) => (
                  <SelectItem key={dc.id} value={dc.id}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(roomData.status)}
          <h2 className="text-2xl font-bold">{roomData.name}</h2>
          {getStatusBadge(roomData.status)}
        </div>
        <RoomEditDialog
          roomId={roomData.id}
          onSave={handleRoomUpdate}
          initialData={{
            name: roomData.name,
            datacenter: roomData.datacenter,
            status: roomData.status,
            area: roomData.area,
            maxRacks: roomData.maxRacks.toString(),
            powerCapacity: roomData.power.capacity,
            coolingCapacity: roomData.cooling.capacity,
          }}
          trigger={<Button variant="outline">Edit Room</Button>}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Data Center</div>
          <div>{roomData.datacenter}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Area</div>
          <div>{roomData.area}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Racks</div>
          <div>
            {roomData.racks}/{roomData.maxRacks} racks
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Servers</div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <div>{roomData.racksList.reduce((acc: number, rack: any) => acc + rack.servers, 0)} servers</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Rack Capacity</div>
          <div className="text-sm text-muted-foreground">{(roomData.usedRacks / roomData.maxRacks) * 100}%</div>
        </div>
        <Progress value={(roomData.usedRacks / roomData.maxRacks) * 100} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Power Usage</div>
          <div className="text-sm text-muted-foreground">{roomData.power.usagePercent}%</div>
        </div>
        <Progress value={roomData.power.usagePercent} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {roomData.power.usage} / {roomData.power.capacity}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <Thermometer className="h-5 w-5 text-orange-500" />
          <div>
            <div className="text-sm font-medium">Temperature</div>
            <div>{roomData.temperature}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <Server className="h-5 w-5 text-blue-500" />
          <div>
            <div className="text-sm font-medium">Humidity</div>
            <div>{roomData.humidity}</div>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="racks">
          <AccordionTrigger>Racks List ({roomData.racksList.length})</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <RackConfigDialog
                  roomId={roomData.id}
                  onSave={handleRackUpdate}
                  trigger={
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Rack
                    </Button>
                  }
                />
              </div>

              {roomData.racksList.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No racks in this room</div>
              ) : (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {roomData.racksList.map((rack: any) => (
                    <div key={rack.id} className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(rack.status)}
                        <div>
                          <div className="font-medium">{rack.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {rack.model} ({rack.usedCapacity}/{rack.capacity})
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">{rack.servers} servers</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link to={`/rooms/${roomData.id}/racks/${rack.id}`} className="w-full">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RackConfigDialog
                                rackId={rack.id}
                                roomId={roomData.id}
                                onSave={handleRackUpdate}
                                initialData={{
                                  name: rack.name,
                                  model: rack.model,
                                  status: rack.status,
                                  capacity: rack.capacity,
                                }}
                                trigger={<div className="w-full">Edit</div>}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Power className="mr-2 h-4 w-4" />
                              Power Control
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <AlertDialog>
                                <AlertDialogTrigger className="w-full text-left">Remove Rack</AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove this rack from the room? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRackRemove(rack.id)} className="bg-red-500 hover:bg-red-600">
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">View Monitoring</Button>
        <Button>Manage Racks</Button>
      </div>
    </div>
  );
}
