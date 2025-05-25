import React from 'react';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/external-ui/table';
import { Input } from '@/components/external-ui/input';
import { Search, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/external-ui/button';
import { useNavigate } from 'react-router-dom';

type Server = {
  name?: string;
};

type Rack = {
  name: string;
  service: string;
  height: number;
  serverNum: number;
  servers: Record<string, Server>;
};

type Room = {
  name: string;
  height: number;
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/allDC`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (dcName: string, e: React.MouseEvent) => {
    // Stop the click event from bubbling up to parent elements (row expansion)
    e.stopPropagation();
    console.log('Delete clicked for:', dcName);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/DC`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: dcName }),
      });

      if (!response.ok) {
        // check if the message is "Fab is not Empty"
        const result = await response.json();
        if (result.message === 'Fab is not Empty') {
          console.log('Fab is not Empty');
          // i want to have a warning on top of the page
          toast({
            title: 'Warning',
            description: 'This data center is not empty. Please remove all rooms and racks before deleting.',
            variant: 'destructive',
          });

          return;
        }

        if (response.status === 403) {
          toast({
            title: 'Forbidden',
            description: 'You do not have the authority.',
            variant: 'destructive',
          });
          return;
        }
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

  const [createForm, setCreateForm] = useState<Record<string, { roomName: string; rackNum: number; height: number }>>({});
  const [showCreateForm, setShowCreateForm] = useState<Record<string, boolean>>({});

  const handleInputChange = (dcId: string, field: string, value: string | number) => {
    setCreateForm((prev) => ({
      ...prev,
      [dcId]: {
        ...prev[dcId],
        [field]: field === 'rackNum' || field === 'height' ? Number(value) : value,
      },
    }));
  };

  const handleBuildRoom = async (dcName: string, dcId: string) => {
    const form = createForm[dcId];
    if (!form || !form.roomName || !form.rackNum || !form.height) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    const requestBody = {
      fabName: dcName,
      roomNum: 1,
      roomArray: [
        {
          name: form.roomName,
          rackNum: form.rackNum,
          height: form.height,
        },
      ],
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/rooms`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 403) {
        toast({
          title: 'Forbidden',
          description: 'You do not have the authority to create a room in this data center.',
          variant: 'destructive',
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Create room failed: ${response.status}`);
      }

      toast({
        title: 'Room Created',
        description: `Room "${form.roomName}" created in DC "${dcName}".`,
      });

      setShowCreateForm((prev) => ({ ...prev, [dcId]: false }));
      fetchDataCenters();
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const [editFormDc, setEditFormDc] = useState<Record<string, string>>({});
  const [isEditingDc, setIsEditingDc] = useState<Record<string, boolean>>({});

  const handleUpdateDC = async (dcId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        title: 'Invalid Name',
        description: 'The data center name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    // remove the dirst 2 letters of dcId and make it a number
    dcId = dcId.substring(2);
    const dcIdNum = parseInt(dcId, 10);
    console.log('dcIdNum:', dcIdNum);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/DC`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: dcIdNum,
          name: newName.trim(),
        }),
      });

      if (response.status === 403) {
        toast({
          title: 'Forbidden',
          description: 'You do not have the authority to update this data center.',
          variant: 'destructive',
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Update failed with status: ${response.status}`);
      }

      toast({
        title: 'Data Center Updated',
        description: `Successfully renamed to "${newName}".`,
      });

      // Clear edit mode and input
      setIsEditingDc((prev) => ({ ...prev, [dcId]: false }));
      setEditFormDc((prev) => ({ ...prev, [dcId]: '' }));

      // Refresh the list
      fetchDataCenters();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
      console.error('Update error:', error);
    }
  };

  const HandleDeleteRoom = async (dcname: string, roomId: string) => {
    try {
      console.log('Delete clicked for:', roomId);
      roomId = roomId.substring(4);
      console.log('roomId:', roomId);
      // remove the dirst 2 letters of dcId and make it a number
      const roomIdNm = parseInt(roomId, 10);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/room`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fabName: dcname, roomId: roomIdNm }),
      });

      if (response.status === 403) {
        toast({
          title: 'Forbidden',
          description: 'You do not have the authority to delete this room.',
          variant: 'destructive',
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      toast({
        title: 'Success',
        description: `Room "${roomId}" has been deleted.`,
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

  const navigate = useNavigate();

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
                      <Button
                        size="sm"
                        onClick={() => setShowCreateForm((prev) => ({ ...prev, [dcKey]: !prev[dcKey] }))}
                        className="flex items-center justify-end space-x-2 text-right"
                      >
                        {showCreateForm[dcKey] ? 'Cancel' : 'Create Room'}
                      </Button>
                      {/* <Button variant="destructive" size="sm" onClick={(e) => handleDelete(dc.name, e)} className="h-8 px-2">
                        <Trash className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span> */}

                      <TableCell className="flex flex-col items-end space-y-1 text-right">
                        {isEditingDc[dcKey] ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              className="h-8"
                              value={editFormDc[dcKey] ?? dc.name}
                              onChange={(e) => setEditFormDc((prev) => ({ ...prev, [dcKey]: e.target.value }))}
                            />
                            <Button size="sm" onClick={() => handleUpdateDC(dc.id, editFormDc[dcKey] ?? dc.name)}>
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingDc((prev) => ({ ...prev, [dcKey]: false }))}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => setIsEditingDc((prev) => ({ ...prev, [dcKey]: true }))}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={(e) => handleDelete(dc.name, e)}>
                              <Trash className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableCell>

                    {showCreateForm[dcKey] && (
                      <div className="ml-4 mt-2 space-y-2 rounded-md border bg-muted/10 p-4 text-sm">
                        <div className="space-y-1">
                          <label className="block">Room Name</label>
                          <Input
                            value={createForm[dcKey]?.roomName || ''}
                            onChange={(e) => handleInputChange(dcKey, 'roomName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block">Rack Number</label>
                          <Input
                            type="number"
                            value={createForm[dcKey]?.rackNum || ''}
                            onChange={(e) => handleInputChange(dcKey, 'rackNum', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block">Height</label>
                          <Input
                            type="number"
                            value={createForm[dcKey]?.height || ''}
                            onChange={(e) => handleInputChange(dcKey, 'height', e.target.value)}
                          />
                        </div>
                        <Button className="mt-2" onClick={() => handleBuildRoom(dc.name, dcKey)}>
                          Build Room
                        </Button>
                      </div>
                    )}
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {Object.entries(dc.rooms).map(([roomId, room]) => (
                          <div key={roomId} className="mb-4 ml-4 border-l pl-4">
                            <TableCell className="flex flex-col items-start space-y-2">
                              <p className="font-semibold">Room: {room.name}</p>
                              <p className="text-sm text-muted-foreground">Height: {room.height}</p>
                              <p className="text-sm text-muted-foreground">Rack Number: {room.rackNum}</p>
                              <Button className="mt-2" onClick={() => HandleDeleteRoom(dc.name, roomId)} variant="destructive" size="sm">
                                delete room
                              </Button>

                              <Button className="mr-7 mt-2" onClick={() => navigate(`/room/${dc.name}/${roomId}`)} size="sm">
                                view details
                              </Button>
                            </TableCell>
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
