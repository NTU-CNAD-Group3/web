import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RackGrid from './Rackgrid';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Server {
  id: number;
  name: string;
  unit: number;
  frontPosition: number;
  backPosition: number;
  healthy: boolean;
}

interface Rack {
  id: number;
  name: string;
  service: string;
  height: number;
  serverNum: number;
  servers: Record<string, Server>;
}

interface RoomData {
  id: number;
  name: string;
  maxRack: number;
  hasRack: number;
  height: number;
  racks: Record<string, Rack>;
}

export default function RoomDetail() {
  const { fabName, roomId } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const roomIdNum = roomId ? parseInt(roomId.replace(/\D/g, ''), 10) : NaN;
  const { toast } = useToast();

  const [newRackData, setNewRackData] = useState({ name: '', height: '', service: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/rack`, {
        params: {
          name: fabName,
          roomId: roomIdNum,
        },
        withCredentials: true,
      });
      setRoomData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error('Failed to fetch room data', error);
    }
  };

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabName, roomId]);

  const HandleDeleteRack = async (roomId: string, rackId: number) => {
    const roomIdNum = parseInt(roomId.substring(4), 10);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/rack`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomIdNum,
          rackId: rackId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete rack');
      }

      toast({
        title: 'Success',
        description: `Rack "${rackId}" deleted from Room "${roomId}".`,
      });

      fetchRoom();
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const HandleCreateRack = async (dcName: string, roomId: string, rackHeight: number) => {
    roomId = roomId.substring(4);
    const roomIdNum = parseInt(roomId, 10);
    console.log('roomId:', roomId);
    console.log('Creating rack for:', dcName, roomIdNum);
    console.log('Rack data:', newRackData);
    if (!newRackData.name || !newRackData.height || !newRackData.service) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }
    const rackHeightNum = parseInt(newRackData.height, 10);

    if (rackHeightNum > rackHeight) {
      console.log('Rack height exceeds room height');
      toast({
        title: 'Invalid Height',
        description: `Rack height cannot exceed room height of ${rackHeight}.`,
        variant: 'destructive',
      });
      return;
    }
    const body = {
      fabName: dcName,
      roomId: roomIdNum,
      rackNum: 1,
      rackArray: [
        {
          name: newRackData.name,
          height: newRackData.height,
          service: newRackData.service,
        },
      ],
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/racks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log('Response:', response);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create rack');
      }

      toast({
        title: 'Success',
        description: `Rack "${newRackData.name}" created in Room "${roomId}"`,
      });

      // Reset
      setNewRackData({ name: '', height: '', service: '' });
      fetchRoom();
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (!roomData) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Room: {roomData.name}</h1>
      <p>Room ID: {roomData.id}</p>
      <p>Total Racks: {roomData.maxRack}</p>
      <p>Racks with Data: {roomData.hasRack}</p>

      <div className="mb-6">
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Rack'}
        </button>

        {showCreateForm && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Rack Name"
              value={newRackData.name}
              onChange={(e) => setNewRackData({ ...newRackData, name: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <input
              type="number"
              placeholder="Rack Height"
              value={newRackData.height}
              onChange={(e) => setNewRackData({ ...newRackData, height: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Rack Service"
              value={newRackData.service}
              onChange={(e) => setNewRackData({ ...newRackData, service: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <button
              onClick={() => {
                HandleCreateRack(fabName!, roomId!, roomData.height);
              }}
              className="col-span-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 sm:col-span-3"
            >
              Submit Rack
            </button>
          </div>
        )}
      </div>

      <RackGrid roomData={roomData} onDeleteRack={(rackId) => HandleDeleteRack(`room${roomData.id}`, rackId)} />
    </div>
  );
}
