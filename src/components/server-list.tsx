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
import { MoreHorizontal, Power, RefreshCw, Search } from "lucide-react"
import { Link } from '@/components/link';

type ServerStatus = "online" | "offline" | "maintenance"

interface Server {
  id: string
  name: string
  ip: string
  location: {
    datacenter: string
    room: string
    rack: string
    position: string
  }
  status: ServerStatus
  uptime: string
  lastUpdated: string
  size: number // Size in U
}

const servers: Server[] = [
  {
    id: "server-001",
    name: "WEB-SRV-01",
    ip: "192.168.1.101",
    location: {
      datacenter: "East Coast DC",
      room: "Room A",
      rack: "A-01",
      position: "36-37",
    },
    status: "online",
    uptime: "45 days",
    lastUpdated: "10 minutes ago",
    size: 2,
  },
  {
    id: "server-002",
    name: "DB-SRV-01",
    ip: "192.168.1.102",
    location: {
      datacenter: "East Coast DC",
      room: "Room A",
      rack: "A-02",
      position: "30-31",
    },
    status: "online",
    uptime: "30 days",
    lastUpdated: "5 minutes ago",
    size: 2,
  },
  {
    id: "server-003",
    name: "APP-SRV-01",
    ip: "192.168.1.103",
    location: {
      datacenter: "West Coast DC",
      room: "Room B",
      rack: "B-01",
      position: "25-26",
    },
    status: "maintenance",
    uptime: "2 hours",
    lastUpdated: "1 hour ago",
    size: 2,
  },
  {
    id: "server-004",
    name: "STORAGE-01",
    ip: "192.168.1.104",
    location: {
      datacenter: "Central DC",
      room: "Room C",
      rack: "C-03",
      position: "10-13",
    },
    status: "offline",
    uptime: "0",
    lastUpdated: "2 hours ago",
    size: 4,
  },
  {
    id: "server-005",
    name: "BACKUP-SRV-01",
    ip: "192.168.1.105",
    location: {
      datacenter: "East Coast DC",
      room: "Room D",
      rack: "D-01",
      position: "20-21",
    },
    status: "online",
    uptime: "15 days",
    lastUpdated: "15 minutes ago",
    size: 2,
  },
]

export function ServerList() {
  const [serverList, setServerList] = useState<Server[]>(servers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServers = serverList.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.location.datacenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.location.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.location.rack.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: ServerStatus) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <Link to="/servers/add">
          <Button size="sm">Add Server</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Server Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServers.map((server) => (
              <TableRow key={server.id}>
                <TableCell className="font-medium">{server.name}</TableCell>
                <TableCell>{server.ip}</TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div>{server.location.datacenter}</div>
                    <div>
                      {server.location.room}, Rack {server.location.rack}
                    </div>
                    <div>Position: {server.location.position}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(server.status)}</TableCell>
                <TableCell>{server.size}U</TableCell>
                <TableCell>{server.uptime}</TableCell>
                <TableCell>{server.lastUpdated}</TableCell>
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
                        <Link to={`/servers/${server.id}`} className="w-full">
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to={`/servers/${server.id}/edit`} className="w-full">
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Restart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Power className="mr-2 h-4 w-4" />
                        <span>Power Control</span>
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
