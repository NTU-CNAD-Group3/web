"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/external-ui/table"
import { Badge } from "@/components/external-ui/badge"
import { Button } from "@/components/external-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/external-ui/dropdown-menu"
import { Input } from "@/components/external-ui/input"
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { RoomEditDialog } from "@/components/room-edit-dialog"
import { useToast } from "@/hooks/use-toast"
import { Link } from "@/components/link"
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
} from "@/components/external-ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/external-ui/select"

// Mock data - Rooms list
const rooms = [
  {
    id: "room-a",
    name: "Room A",
    datacenter: "East Coast DC",
    status: "operational",
    racks: 12,
    servers: 48,
    power: "120/200 kW",
    temperature: "22°C",
    area: "1000 sq ft",
  },
  {
    id: "room-b",
    name: "Room B",
    datacenter: "East Coast DC",
    status: "operational",
    racks: 8,
    servers: 32,
    power: "90/150 kW",
    temperature: "23°C",
    area: "800 sq ft",
  },
  {
    id: "room-c",
    name: "Room C",
    datacenter: "West Coast DC",
    status: "maintenance",
    racks: 10,
    servers: 40,
    power: "100/180 kW",
    temperature: "21°C",
    area: "900 sq ft",
  },
  {
    id: "room-d",
    name: "Room D",
    datacenter: "Central DC",
    status: "operational",
    racks: 6,
    servers: 24,
    power: "70/120 kW",
    temperature: "22°C",
    area: "600 sq ft",
  },
  {
    id: "room-e",
    name: "Room E",
    datacenter: "European DC",
    status: "operational",
    racks: 8,
    servers: 20,
    power: "60/100 kW",
    temperature: "20°C",
    area: "750 sq ft",
  },
]

// Mock data - Data centers for filtering
const dataCenters = [
  { id: "dc-001", name: "East Coast DC" },
  { id: "dc-002", name: "West Coast DC" },
  { id: "dc-003", name: "Central DC" },
  { id: "dc-004", name: "European DC" },
]

export function RoomList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDC, setSelectedDC] = useState<string>("all")
  const [roomsList, setRoomsList] = useState(rooms)
  const { toast } = useToast()

  const filteredRooms = roomsList.filter(
    (room) =>
      (selectedDC === "all" || room.datacenter === dataCenters.find((dc) => dc.id === selectedDC)?.name) &&
      (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.datacenter.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleRoomUpdate = () => {
    toast({
      title: "Room Information Updated",
      description: "Room information has been successfully updated.",
    })
  }

  const handleRoomDelete = (roomId: string) => {
    // In a real application, this would call an API to delete the room
    setRoomsList(roomsList.filter((room) => room.id !== roomId))

    toast({
      title: "Room Deleted",
      description: "The room has been successfully removed from the system.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        )
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <div className="w-full md:w-48">
            <Select value={selectedDC} onValueChange={setSelectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select Data Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data Centers</SelectItem>
                {dataCenters.map((dc) => (
                  <SelectItem key={dc.id} value={dc.id}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full md:w-[200px]"
            />
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto justify-end">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link to="/rooms/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Name</TableHead>
              <TableHead>Data Center</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Racks</TableHead>
              <TableHead>Servers</TableHead>
              <TableHead>Power</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.datacenter}</TableCell>
                <TableCell>{getStatusBadge(room.status)}</TableCell>
                <TableCell>{room.racks}</TableCell>
                <TableCell>{room.servers}</TableCell>
                <TableCell>{room.power}</TableCell>
                <TableCell>{room.temperature}</TableCell>
                <TableCell>{room.area}</TableCell>
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
                        <Link to={`/rooms/${room.id}`} className="w-full">
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RoomEditDialog
                          roomId={room.id}
                          onSave={handleRoomUpdate}
                          initialData={{
                            name: room.name,
                            datacenter: room.datacenter,
                            status: room.status,
                            area: room.area,
                          }}
                          trigger={<div className="w-full">Edit</div>}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to={`/rooms/${room.id}/racks`} className="w-full">
                          Manage Racks
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger className="w-full text-left">Delete Room</AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this room? This action cannot be undone and will remove
                                all associated rack configurations.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRoomDelete(room.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
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
  )
}
