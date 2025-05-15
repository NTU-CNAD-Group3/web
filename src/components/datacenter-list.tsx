'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/external-ui/table';
import { Badge } from '@/components/external-ui/badge';
import { Button } from '@/components/external-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/external-ui/dropdown-menu';
import { Input } from '@/components/external-ui/input';
import { MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from '@/components/link';
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
    racks: 24,
    servers: 48,
    power: '210/500 kW',
    temperature: '22°C',
  },
  {
    id: 'dc-002',
    name: 'West Coast DC',
    location: 'San Francisco, CA',
    status: 'operational',
    rooms: 3,
    racks: 18,
    servers: 36,
    power: '180/400 kW',
    temperature: '23°C',
  },
  {
    id: 'dc-003',
    name: 'Central DC',
    location: 'Dallas, TX',
    status: 'maintenance',
    rooms: 2,
    racks: 12,
    servers: 24,
    power: '120/300 kW',
    temperature: '21°C',
  },
  {
    id: 'dc-004',
    name: 'European DC',
    location: 'London, UK',
    status: 'operational',
    rooms: 3,
    racks: 15,
    servers: 20,
    power: '140/350 kW',
    temperature: '20°C',
  },
];

export function DataCenterList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dcList, setDcList] = useState(dataCenters);
  const { toast } = useToast();

  const filteredDCs = dcList.filter(
    (dc) => dc.name.toLowerCase().includes(searchTerm.toLowerCase()) || dc.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    setDcList(dcList.filter((dc) => dc.id !== id));
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
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search data centers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9" />
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rooms</TableHead>
              <TableHead>Racks</TableHead>
              <TableHead>Servers</TableHead>
              <TableHead>Power</TableHead>
              <TableHead>Temp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDCs.map((dc) => (
              <TableRow key={dc.id}>
                <TableCell className="font-medium">{dc.name}</TableCell>
                <TableCell>{dc.location}</TableCell>
                <TableCell>{getStatusBadge(dc.status)}</TableCell>
                <TableCell>{dc.rooms}</TableCell>
                <TableCell>{dc.racks}</TableCell>
                <TableCell>{dc.servers}</TableCell>
                <TableCell>{dc.power}</TableCell>
                <TableCell>{dc.temperature}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link to={`/datacenters/${dc.id}`} className="w-full">
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to={`/datacenters/${dc.id}/edit`} className="w-full">
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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
                                Are you sure you want to delete this data center? This action cannot be undone and will remove all
                                associated rooms and server configurations.
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
