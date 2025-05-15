'use client';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Card, CardContent } from '@/components/external-ui/card';
import { Badge } from '@/components/external-ui/badge';
import { AlertCircle, CheckCircle2, Info, Server, Thermometer, WrenchIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/external-ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';

// Mock data - Data centers, rooms and racks
const dataCenters = [
  {
    id: 'dc-001',
    name: 'East Coast DC',
    rooms: [
      {
        id: 'room-a',
        name: 'Room A',
        racks: [
          { id: 'a-01', name: 'A-01', status: 'online', usage: 85, temperature: 'Normal', servers: 12, u: 42 },
          { id: 'a-02', name: 'A-02', status: 'online', usage: 70, temperature: 'Normal', servers: 8, u: 42 },
          { id: 'a-03', name: 'A-03', status: 'maintenance', usage: 30, temperature: 'Normal', servers: 4, u: 42 },
          { id: 'a-04', name: 'A-04', status: 'online', usage: 90, temperature: 'High', servers: 15, u: 42 },
        ],
      },
      {
        id: 'room-b',
        name: 'Room B',
        racks: [
          { id: 'b-01', name: 'B-01', status: 'online', usage: 65, temperature: 'Normal', servers: 10, u: 42 },
          { id: 'b-02', name: 'B-02', status: 'offline', usage: 0, temperature: 'Normal', servers: 0, u: 42 },
          { id: 'b-03', name: 'B-03', status: 'online', usage: 75, temperature: 'Normal', servers: 12, u: 42 },
        ],
      },
    ],
  },
  {
    id: 'dc-002',
    name: 'West Coast DC',
    rooms: [
      {
        id: 'room-c',
        name: 'Room C',
        racks: [
          { id: 'c-01', name: 'C-01', status: 'online', usage: 50, temperature: 'Normal', servers: 7, u: 42 },
          { id: 'c-02', name: 'C-02', status: 'online', usage: 60, temperature: 'Normal', servers: 9, u: 42 },
          { id: 'c-03', name: 'C-03', status: 'online', usage: 40, temperature: 'Normal', servers: 6, u: 42 },
          { id: 'c-04', name: 'C-04', status: 'maintenance', usage: 20, temperature: 'Normal', servers: 3, u: 42 },
        ],
      },
    ],
  },
  {
    id: 'dc-003',
    name: 'Central DC',
    rooms: [
      {
        id: 'room-d',
        name: 'Room D',
        racks: [
          { id: 'd-01', name: 'D-01', status: 'online', usage: 80, temperature: 'Normal', servers: 14, u: 42 },
          { id: 'd-02', name: 'D-02', status: 'online', usage: 75, temperature: 'Normal', servers: 12, u: 42 },
        ],
      },
    ],
  },
];

interface RackDetailsProps {
  rackId: string;
  dataCenterId: string;
  roomId: string;
}

function RackDetails({ rackId, dataCenterId, roomId }: RackDetailsProps) {
  // Find rack information
  const dataCenter = dataCenters.find((dc) => dc.id === dataCenterId);
  const room = dataCenter?.rooms.find((r) => r.id === roomId);
  const rackInfo = room?.racks.find((r) => r.id === rackId);

  if (!rackInfo) {
    return <div>Rack information not found</div>;
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Rack {rackInfo.name} Details</h4>
      <p>Status: {getStatusText(rackInfo.status)}</p>
      <p>Usage: {rackInfo.usage}%</p>
      <p>Servers: {rackInfo.servers}</p>
      <p>Temperature: {rackInfo.temperature}</p>
    </div>
  );
}

export function RoomVisualization() {
  const [selectedDC, setSelectedDC] = useState<string>('dc-001');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRack, setSelectedRack] = useState<string | null>(null);
  const [view, setView] = useState<'2d' | 'top'>('2d');
  const { toast } = useToast();

  const dataCenter = dataCenters.find((dc) => dc.id === selectedDC);
  const rooms = dataCenter?.rooms || [];

  const handleRackClick = (rackId: string, roomId: string) => {
    setSelectedRoom(roomId);
    setSelectedRack(rackId === selectedRack ? null : rackId);

    // Find rack information
    const room = rooms.find((r) => r.id === roomId);
    const rackInfo = room?.racks.find((r) => r.id === rackId);

    const getStatusText = (status: string) => {
      switch (status) {
        case 'online':
          return 'Online';
        case 'offline':
          return 'Offline';
        case 'maintenance':
          return 'Maintenance';
        default:
          return 'Unknown';
      }
    };

    if (rackInfo) {
      toast({
        title: `Rack ${rackInfo.name}`,
        description: `Status: ${getStatusText(rackInfo.status)} | Usage: ${rackInfo.usage}% | Servers: ${rackInfo.servers}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <WrenchIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="w-full md:w-48">
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
          <div className="flex space-x-2">
            <Button variant={view === '2d' ? 'default' : 'outline'} size="sm" onClick={() => setView('2d')}>
              2D View
            </Button>
            <Button variant={view === 'top' ? 'default' : 'outline'} size="sm" onClick={() => setView('top')}>
              Top View
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Offline</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Maintenance</span>
          </div>
        </div>
      </div>

      {view === '2d' && (
        <div className="grid grid-cols-1 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="space-y-2">
              <h3 className="font-medium">{room.name}</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {room.racks.map((rack) => (
                  <TooltipProvider key={rack.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex h-96 w-32 cursor-pointer flex-col rounded-md border transition-all ${
                            selectedRack === rack.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleRackClick(rack.id, room.id)}
                        >
                          <div className="border-b bg-muted p-2 text-center text-sm font-medium">{rack.name}</div>
                          <div className="flex flex-1 flex-col space-y-1 overflow-hidden p-1">
                            {Array.from({ length: Math.ceil((rack.usage / 100) * rack.u) }).map((_, i) => (
                              <div key={i} className={`h-2 rounded-sm ${getUsageColor(rack.usage)}`}></div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between border-t p-2">
                            <div className={`h-3 w-3 rounded-full ${getStatusColor(rack.status)}`}></div>
                            <div className="text-xs">{rack.usage}%</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-bold">{rack.name}</div>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(rack.status)}
                            <span>{getStatusText(rack.status)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Server className="h-4 w-4" />
                            <span>{rack.servers} servers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4" />
                            <span>Temperature: {rack.temperature}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'top' && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="space-y-2">
                <h3 className="font-medium">{room.name}</h3>
                <div className="flex space-x-4">
                  {room.racks.map((rack) => (
                    <TooltipProvider key={rack.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border transition-all ${
                              selectedRack === rack.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleRackClick(rack.id, room.id)}
                            style={{
                              backgroundColor:
                                rack.status === 'offline'
                                  ? '#fee2e2'
                                  : rack.status === 'maintenance'
                                    ? '#fef3c7'
                                    : rack.usage >= 90
                                      ? '#fecaca'
                                      : rack.usage >= 70
                                        ? '#fed7aa'
                                        : '#d1fae5',
                            }}
                          >
                            <div className="font-bold">{rack.name}</div>
                            <div className="text-sm">{rack.usage}%</div>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {rack.servers} servers
                              </Badge>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-bold">{rack.name}</div>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(rack.status)}
                              <span>{getStatusText(rack.status)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Server className="h-4 w-4" />
                              <span>{rack.servers} servers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-4 w-4" />
                              <span>Temperature: {rack.temperature}</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRack && selectedRoom && (
        <Card>
          <CardContent className="p-4">
            <RackDetails rackId={selectedRack} dataCenterId={selectedDC} roomId={selectedRoom} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
