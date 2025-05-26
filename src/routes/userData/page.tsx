'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/external-ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';

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

export default function UserDataPage() {
  const [dcList, setDcList] = useState<DataCenter[]>([]);
  const { toast } = useToast();

  // For the form selections
  const [selectedDcId, setSelectedDcId] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');

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

  const navigate = useNavigate();

  // Handle form changes
  const handleDcChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDcId(e.target.value);
    setSelectedRoomName(''); // Reset room on DC change
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoomName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDcId) {
      toast({
        title: 'Select a Data Center',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRoomName) {
      toast({
        title: 'Select a Room',
        variant: 'destructive',
      });
      return;
    }

    const selectedDc = dcList.find((dc) => dc.id === selectedDcId);
    if (!selectedDc) {
      toast({
        title: 'Data Center not found',
        variant: 'destructive',
      });
      return;
    }

    // Find the room ID by matching the selected room name with room.name
    const roomEntry = Object.entries(selectedDc.rooms).find(([, room]) => room.name === selectedRoomName);

    if (!roomEntry) {
      toast({
        title: 'Room not found in selected Data Center',
        variant: 'destructive',
      });
      return;
    }

    const [roomId] = roomEntry;

    navigate(`/room/${selectedDcId}/${selectedDc.name}/${roomId}`);
  };

  // Get rooms from selected DC
  const selectedDc = dcList.find((dc) => dc.id === selectedDcId);
  const rooms = selectedDc ? Object.values(selectedDc.rooms) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>manage server</CardTitle>
            <CardDescription>Select service from centers and room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {/* Query form */}
              <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                <div className="flex flex-col">
                  <label htmlFor="dc-select" className="mb-1 font-medium">
                    Select Data Center
                  </label>
                  <select id="dc-select" value={selectedDcId} onChange={handleDcChange} className="rounded border p-2">
                    <option value="">-- Choose a Data Center --</option>
                    {dcList.map((dc) => (
                      <option key={dc.id} value={dc.id}>
                        {dc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="room-select" className="mb-1 font-medium">
                    Select Room
                  </label>
                  <select
                    id="room-select"
                    value={selectedRoomName}
                    onChange={handleRoomChange}
                    disabled={!selectedDcId}
                    className="rounded border p-2"
                  >
                    <option value="">-- Choose a Room --</option>
                    {rooms.map((room) => (
                      <option key={room.name} value={room.name}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" disabled={!selectedDcId || !selectedRoomName} onClick={handleSubmit}>
                  Query
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
