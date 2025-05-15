'use client';

import { useState } from 'react';
import { Link } from '@/components/link';
import { Button } from '@/components/external-ui/button';
import { Card, CardContent, CardFooter } from '@/components/external-ui/card';
import { Badge } from '@/components/external-ui/badge';
import { Building2, MoreHorizontal, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/external-ui/dropdown-menu';
import { Progress } from '@/components/external-ui/progress';
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

// Mock data for data centers
const dataCenters = [
  {
    id: 'dc-001',
    name: 'East Coast DC',
    location: 'New York, NY',
    status: 'operational',
    rooms: 4,
    servers: 48,
    capacity: {
      total: 120,
      used: 48,
    },
    power: {
      capacity: '500 kW',
      usage: '210 kW',
      usagePercent: 42,
    },
  },
  {
    id: 'dc-002',
    name: 'West Coast DC',
    location: 'San Francisco, CA',
    status: 'operational',
    rooms: 3,
    servers: 36,
    capacity: {
      total: 90,
      used: 36,
    },
    power: {
      capacity: '400 kW',
      usage: '180 kW',
      usagePercent: 45,
    },
  },
  {
    id: 'dc-003',
    name: 'Central DC',
    location: 'Dallas, TX',
    status: 'maintenance',
    rooms: 2,
    servers: 24,
    capacity: {
      total: 60,
      used: 24,
    },
    power: {
      capacity: '300 kW',
      usage: '120 kW',
      usagePercent: 40,
    },
  },
  {
    id: 'dc-004',
    name: 'European DC',
    location: 'London, UK',
    status: 'operational',
    rooms: 3,
    servers: 20,
    capacity: {
      total: 80,
      used: 20,
    },
    power: {
      capacity: '350 kW',
      usage: '140 kW',
      usagePercent: 40,
    },
  },
];

export function DataCenterOverview() {
  const [datacenters, setDatacenters] = useState(dataCenters);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setDatacenters(datacenters.filter((dc) => dc.id !== id));
    toast({
      title: 'Data Center Deleted',
      description: 'The data center has been successfully removed.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'maintenance':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        );
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Data Centers ({datacenters.length})</h3>
        <Link to="/datacenters/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Data Center
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {datacenters.map((dc) => (
          <Card key={dc.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start justify-between bg-muted p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <h4 className="font-semibold">{dc.name}</h4>
                    <p className="text-sm text-muted-foreground">{dc.location}</p>
                  </div>
                </div>
                {getStatusBadge(dc.status)}
              </div>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rooms</p>
                    <p className="text-2xl font-bold">{dc.rooms}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Servers</p>
                    <p className="text-2xl font-bold">{dc.servers}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity</span>
                    <span>
                      {dc.capacity.used}/{dc.capacity.total} servers
                    </span>
                  </div>
                  <Progress value={(dc.capacity.used / dc.capacity.total) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Power</span>
                    <span>{dc.power.usagePercent}%</span>
                  </div>
                  <Progress value={dc.power.usagePercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {dc.power.usage} / {dc.power.capacity}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Link to={`/datacenters/${dc.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to={`/datacenters/${dc.id}/edit`} className="w-full">
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={`/datacenters/${dc.id}/rooms`} className="w-full">
                      Manage Rooms
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <AlertDialog>
                      <AlertDialogTrigger className="w-full text-left">Delete</AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this data center? This action cannot be undone and will remove all associated
                            rooms and server configurations.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(dc.id)} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
