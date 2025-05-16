import React from 'react';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/external-ui/table';
import { Input } from '@/components/external-ui/input';
import { Search, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/external-ui/button';

type Server = {
  name?: string;
};

type Rack = {
  name: string;
  service: string;
  serverNum: number;
  servers: Record<string, Server>;
};

type Room = {
  name: string;
  rackNum: number;
  racks: Record<string, Rack>;
};

type DataCenter = {
  id: string;
  name: string;
  roomNum: number;
  rooms: Record<string, Room>;
};

export function DataCenterList() {
  const [dcList, setDcList] = useState<DataCenter[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchDataCenters = async () => {
    console.log('Session:', sessionStorage.getItem('session'));

    try {
      const response = await fetch('http://localhost:8001/api/v1/gateway/backend/allDC', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = result.data as Record<string, any>;

      const structured: DataCenter[] = Object.entries(rawData).map(([dcId, dc]) => ({
        id: dcId,
        name: dc.name || 'Unnamed DC',
        roomNum: dc.roomNum || 0,
        rooms: dc.rooms || {},
      }));

      setDcList(structured);
    } catch (error) {
      toast({
        title: 'Failed to fetch data centers',
        description: 'Check your API or server status.',
        variant: 'destructive',
      });
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchDataCenters();
  });

  const handleDelete = async (dcName: string, e: React.MouseEvent) => {
    // Stop the click event from bubbling up to parent elements (row expansion)
    e.stopPropagation();

    try {
      const response = await fetch('http://localhost:8001/api/v1/gateway/backend/DC', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: dcName }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      toast({
        title: 'Success',
        description: `Data center "${dcName}" has been deleted.`,
      });

      // Refresh the data center list
      fetchDataCenters();
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    }
  };

  const filteredDCs = dcList.filter((dc) => dc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search data centers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rooms</TableHead>
              <TableHead>Racks</TableHead>
              <TableHead>Servers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredDCs.map((dc) => {
              const dcKey = dc.id;
              const isExpanded = expanded[dcKey];

              let rackCount = 0;
              let serverCount = 0;
              Object.values(dc.rooms).forEach((room) => {
                rackCount += room.rackNum;
                Object.values(room.racks).forEach((rack) => {
                  serverCount += rack.serverNum;
                });
              });

              return (
                <React.Fragment key={dcKey}>
                  <TableRow className="cursor-pointer" onClick={() => setExpanded((prev) => ({ ...prev, [dcKey]: !prev[dcKey] }))}>
                    <TableCell className="font-medium">{dc.name}</TableCell>
                    <TableCell>{dc.roomNum}</TableCell>
                    <TableCell>{rackCount}</TableCell>
                    <TableCell>{serverCount}</TableCell>
                    <TableCell className="flex items-center justify-end space-x-2 text-right">
                      <Button variant="destructive" size="sm" onClick={(e) => handleDelete(dc.name, e)} className="h-8 px-2">
                        <Trash className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {Object.entries(dc.rooms).map(([roomId, room]) => (
                          <div key={roomId} className="mb-4 ml-4 border-l pl-4">
                            <p className="font-semibold">Room: {room.name}</p>
                            {Object.entries(room.racks).map(([rackId, rack]) => (
                              <div key={rackId} className="ml-4 border-l pl-4">
                                <p className="text-sm font-medium">
                                  Rack: {rack.name} (Service: {rack.service})
                                </p>
                                {Object.keys(rack.servers).length > 0 ? (
                                  <ul className="ml-4 list-disc text-sm">
                                    {Object.entries(rack.servers).map(([serverId, server]) => (
                                      <li key={serverId}>{server.name || `Server ${serverId}`}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="ml-4 text-sm text-muted-foreground">No servers</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
