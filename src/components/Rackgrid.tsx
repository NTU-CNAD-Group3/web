import React from "react";

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

interface RackGridProps {
  roomData: RoomData;
  onDeleteRack?: (rackId: number) => void;
}

const RackGrid: React.FC<RackGridProps> = ({ roomData, onDeleteRack }) => {
  const { maxRack, height: roomHeight, racks } = roomData;

  return (
    <div className="flex gap-4 overflow-x-auto mt-4">
      {Array.from({ length: maxRack }).map((_, rackIndex) => {
        const rackKey = Object.keys(racks)[rackIndex];
        const rack = racks[rackKey];

        const rackCells = Array.from({ length: roomHeight }).map((_, pos) => {
          const reverseIndex = roomHeight - 1 - pos;

          // Default cell
          let label = "";
          let color = "bg-white";

          // If rack exists for this index
          if (rack) {
            const rackHeight = rack.height;

            // Unusable space
            if (reverseIndex >= rackHeight) {
              color = "bg-black";
            }

            // Find a server occupying this position
            const server = Object.values(rack.servers).find(
              (srv) =>
                reverseIndex >= srv.frontPosition &&
                reverseIndex <= srv.backPosition
            );

            if (server) {
              label = server.name;
              color = server.healthy ? "bg-green-400" : "bg-red-400";
            }
          }

          return (
            <div
              key={reverseIndex}
              className={`w-16 h-16 border border-gray-400 text-xs text-center flex items-center justify-center ${color}`}
            >
              {label}
            </div>
          );
        });

        return (
          <div key={rackIndex} className="flex flex-col items-center">
            {/* Delete Button */}
            <button
              onClick={() => {
                if (rack && onDeleteRack) onDeleteRack(rack.id);
              }}
              className="mb-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
              disabled={!rack}
            >
              Delete
            </button>

            {/* Rack Label */}
            <div className="text-sm font-semibold mb-1">
              {rack ? rack.service : "Empty"}
            </div>

            {/* Column of Cells */}
            <div className="flex flex-col">{rackCells}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RackGrid;
