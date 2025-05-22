import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RackGridUser from './RackGridUser';
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

export default function RoomDetailUser() {
  const { fabId, fabName, roomId } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const roomIdNum = roomId ? parseInt(roomId.replace(/\D/g, ''), 10) : NaN;
  const fabIdNum = fabId ? parseInt(fabId.replace(/\D/g, ''), 10) : NaN;
  const { toast } = useToast();

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/room`, {
        params: {
          name: fabName,
          roomId: roomIdNum,
        },
        withCredentials: true,
      });
      setRoomData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch room data', error);
    }
  };

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabName, roomId]);

  const [showServerForm, setShowServerForm] = useState(false);
  const [serverData, setServerData] = useState({
    name: '',
    service: '',
    rackId: '',
    frontPosition: '',
    backPosition: '',
  });

  const handleCreateServer = async () => {
    if (
      !serverData.name ||
      !serverData.service ||
      !serverData.rackId ||
      serverData.frontPosition === '' ||
      serverData.backPosition === ''
    ) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const front = parseInt(serverData.frontPosition, 10);
    const back = parseInt(serverData.backPosition, 10);
    console.log('Front:', front);
    console.log('Back:', back);

    if (back < front) {
      toast({
        title: 'Invalid Positions',
        description: 'Back position must be >= front position.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      name: serverData.name,
      service: serverData.service,
      unit: back - front + 1,
      fabId: fabIdNum,
      roomId: roomIdNum,
      rackId: parseInt(serverData.rackId, 10),
      frontPosition: front,
      backPosition: back,
    };
    console.log('Payload:', payload);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/server`, payload, {
        withCredentials: true,
      });
      toast({
        title: 'Server Created',
        description: `Server "${payload.name}" added successfully.`,
      });
      fetchRoom();
      setShowServerForm(false);
      setServerData({ name: '', service: '', rackId: '', frontPosition: '', backPosition: '' });
    } catch (err) {
      toast({
        title: 'Creation Failed',
        description: 'Unable to create server.',
        variant: 'destructive',
      });
    }
  };

  const HandleDeleteServer = async (rackId: number, serverId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/server`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rackId,
          id: serverId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete server');
      }

      toast({
        title: 'Deleted',
        description: `Server ID ${serverId} deleted from Rack ${rackId}.`,
      });

      fetchRoom(); // Refresh data
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (!roomData) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Room: {roomData.name}</h1>
      <p> roomId : {fabId}</p>
      <p>Room ID: {roomData.id}</p>
      <p>Total Racks: {roomData.maxRack}</p>
      <p>Racks can use: {roomData.hasRack}</p>

      <button onClick={() => setShowServerForm(!showServerForm)} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        {showServerForm ? 'Cancel' : 'Create Server'}
      </button>

      {showServerForm && (
        <div className="mt-4 w-full max-w-lg space-y-4 rounded border p-4 shadow">
          <input
            className="w-full border p-2"
            placeholder="Server Name"
            value={serverData.name}
            onChange={(e) => setServerData({ ...serverData, name: e.target.value })}
          />

          <input
            className="w-full border p-2"
            placeholder="Front Position"
            type="number"
            value={serverData.frontPosition}
            onChange={(e) => setServerData({ ...serverData, frontPosition: e.target.value })}
          />

          <input
            className="w-full border p-2"
            placeholder="Back Position"
            type="number"
            value={serverData.backPosition}
            onChange={(e) => setServerData({ ...serverData, backPosition: e.target.value })}
          />

          <select
            className="w-full border p-2"
            value={serverData.service}
            onChange={(e) => setServerData({ ...serverData, service: e.target.value })}
          >
            <option value="">Select Service</option>
            {Object.values(roomData.racks).map((rack) => (
              <option key={rack.id} value={rack.service}>
                {rack.service}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2"
            value={serverData.rackId}
            onChange={(e) => setServerData({ ...serverData, rackId: e.target.value })}
            disabled={!serverData.service}
          >
            <option value="">Select Rack</option>
            {Object.values(roomData.racks)
              .filter((rack) => rack.service === serverData.service)
              .map((rack) => (
                <option key={rack.id} value={rack.id}>
                  {rack.name}
                </option>
              ))}
          </select>

          <button onClick={handleCreateServer} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            Submit
          </button>
        </div>
      )}

      {/* the live server part */}
      <div className="mb-6 overflow-x-auto rounded-md border border-gray-300 p-4">
        <h2 className="mb-4 text-xl font-bold">Live Services & Servers</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Rack Name</th>
              <th className="border px-4 py-2">Service</th>
              <th className="border px-4 py-2">Server Name</th>
              <th className="border px-4 py-2">Front</th>
              <th className="border px-4 py-2">Back</th>
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Health</th>
              <th className="border px-4 py-2">status</th>
              <th className="border px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(roomData.racks).flatMap((rack) =>
              Object.values(rack.servers).map((server) => (
                <tr key={server.id} className="text-center">
                  <td className="border px-4 py-2">{rack.name}</td>
                  <td className="border px-4 py-2">{rack.service}</td>
                  <td className="border px-4 py-2">{server.name}</td>
                  <td className="border px-4 py-2">{server.frontPosition}</td>
                  <td className="border px-4 py-2">{server.backPosition}</td>
                  <td className="border px-4 py-2">{server.unit}</td>
                  <td className={`border px-4 py-2 font-medium ${server.healthy ? 'text-green-600' : 'text-red-600'}`}>
                    {server.healthy ? 'Healthy' : 'Unhealthy'}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={async () => {
                        try {
                          const endpoint = server.healthy ? 'server/broken' : 'server/repair';

                          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gateway/backend/${endpoint}`, {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: server.id }),
                          });

                          const result = await response.json();

                          if (!response.ok) {
                            throw new Error(result.message || 'Update failed');
                          }

                          toast({
                            title: 'Success',
                            description: `Server "${server.name}" has been marked as ${server.healthy ? 'broken' : 'repaired'}.`,
                          });

                          fetchRoom(); // Refresh data
                        } catch (error) {
                          toast({
                            title: 'Error',
                            description: error instanceof Error ? error.message : 'Unknown error',
                            variant: 'destructive',
                          });
                        }
                      }}
                      className={`rounded px-3 py-1 text-white ${
                        server.healthy ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {server.healthy ? 'Break' : 'Repair'}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => HandleDeleteServer(rack.id, server.id)}
                      className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      <RackGridUser roomData={roomData} />
    </div>
  );
}
