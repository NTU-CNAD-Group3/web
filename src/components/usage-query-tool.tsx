'use client';

import { useState } from 'react';
import { Button } from '@/components/external-ui/button';
import { Input } from '@/components/external-ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/external-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/external-ui/table';
import { Badge } from '@/components/external-ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/external-ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/external-ui/accordion';
import { Progress } from '@/components/external-ui/progress';

// Mock data for servers
const servers = [
  {
    id: 'srv-001',
    name: 'WEB-SRV-01',
    type: 'Web Server',
    datacenter: 'East Coast DC',
    room: 'Room A',
    rack: 'A-01',
    position: '36-37',
    size: '2U',
    ip: '192.168.1.101',
    status: 'online',
    cpu: {
      model: 'Intel Xeon Gold 6248R',
      cores: 24,
      usage: 65,
    },
    memory: {
      total: '128 GB',
      used: '82 GB',
      usage: 64,
    },
    storage: {
      total: '2 TB',
      used: '1.2 TB',
      usage: 60,
    },
    network: {
      bandwidth: '10 Gbps',
      usage: 45,
    },
    applications: ['Nginx', 'Node.js', 'Redis'],
    owner: 'Web Team',
    lastUpdated: '2023-05-15',
  },
  {
    id: 'srv-002',
    name: 'DB-SRV-01',
    type: 'Database Server',
    datacenter: 'East Coast DC',
    room: 'Room A',
    rack: 'A-02',
    position: '30-33',
    size: '4U',
    ip: '192.168.1.102',
    status: 'online',
    cpu: {
      model: 'Intel Xeon Gold 6248R',
      cores: 48,
      usage: 78,
    },
    memory: {
      total: '512 GB',
      used: '384 GB',
      usage: 75,
    },
    storage: {
      total: '10 TB',
      used: '7.5 TB',
      usage: 75,
    },
    network: {
      bandwidth: '25 Gbps',
      usage: 60,
    },
    applications: ['MySQL', 'PostgreSQL', 'MongoDB'],
    owner: 'Database Team',
    lastUpdated: '2023-05-10',
  },
  {
    id: 'srv-003',
    name: 'APP-SRV-01',
    type: 'Application Server',
    datacenter: 'West Coast DC',
    room: 'Room C',
    rack: 'C-01',
    position: '28-29',
    size: '2U',
    ip: '192.168.2.101',
    status: 'online',
    cpu: {
      model: 'AMD EPYC 7763',
      cores: 32,
      usage: 55,
    },
    memory: {
      total: '256 GB',
      used: '128 GB',
      usage: 50,
    },
    storage: {
      total: '4 TB',
      used: '1.8 TB',
      usage: 45,
    },
    network: {
      bandwidth: '10 Gbps',
      usage: 40,
    },
    applications: ['Java', 'Tomcat', 'Spring Boot'],
    owner: 'Application Team',
    lastUpdated: '2023-05-12',
  },
  {
    id: 'srv-004',
    name: 'STORAGE-01',
    type: 'Storage Server',
    datacenter: 'Central DC',
    room: 'Room D',
    rack: 'D-01',
    position: '20-27',
    size: '8U',
    ip: '192.168.3.101',
    status: 'online',
    cpu: {
      model: 'Intel Xeon Gold 6248R',
      cores: 16,
      usage: 30,
    },
    memory: {
      total: '128 GB',
      used: '64 GB',
      usage: 50,
    },
    storage: {
      total: '100 TB',
      used: '65 TB',
      usage: 65,
    },
    network: {
      bandwidth: '40 Gbps',
      usage: 70,
    },
    applications: ['NetApp', 'SAN'],
    owner: 'Storage Team',
    lastUpdated: '2023-05-05',
  },
  {
    id: 'srv-005',
    name: 'BACKUP-SRV-01',
    type: 'Backup Server',
    datacenter: 'East Coast DC',
    room: 'Room B',
    rack: 'B-03',
    position: '15-18',
    size: '4U',
    ip: '192.168.1.105',
    status: 'online',
    cpu: {
      model: 'Intel Xeon Silver 4310',
      cores: 12,
      usage: 25,
    },
    memory: {
      total: '128 GB',
      used: '48 GB',
      usage: 37.5,
    },
    storage: {
      total: '200 TB',
      used: '120 TB',
      usage: 60,
    },
    network: {
      bandwidth: '25 Gbps',
      usage: 35,
    },
    applications: ['Veeam', 'Backup Exec'],
    owner: 'Infrastructure Team',
    lastUpdated: '2023-05-08',
  },
];

// Mock data for filters
const dataCenters = [
  { id: 'dc-001', name: 'East Coast DC' },
  { id: 'dc-002', name: 'West Coast DC' },
  { id: 'dc-003', name: 'Central DC' },
  { id: 'dc-004', name: 'European DC' },
];

const serverTypes = [
  { id: 'web', name: 'Web Server' },
  { id: 'db', name: 'Database Server' },
  { id: 'app', name: 'Application Server' },
  { id: 'storage', name: 'Storage Server' },
  { id: 'backup', name: 'Backup Server' },
];

export function UsageQueryTool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDC, setSelectedDC] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  // Filter servers based on search term and filters
  const filteredServers = servers.filter(
    (server) =>
      (selectedDC === 'all' || server.datacenter === dataCenters.find((dc) => dc.id === selectedDC)?.name) &&
      (selectedType === 'all' || server.type === serverTypes.find((type) => type.id === selectedType)?.name) &&
      (searchTerm === '' ||
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.ip.includes(searchTerm) ||
        server.applications.some((app) => app.toLowerCase().includes(searchTerm.toLowerCase()))),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-500';
    if (usage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full items-center space-x-2 md:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by server name, IP, or application..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full md:w-[350px]"
          />
        </div>
        <div className="flex w-full justify-end space-x-2 md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Data Center</label>
              <Select value={selectedDC} onValueChange={setSelectedDC}>
                <SelectTrigger className="mt-1">
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
            <div>
              <label className="text-sm font-medium">Server Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Server Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Server Types</SelectItem>
                  {serverTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Server Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Network</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServers.map((server) => (
              <TableRow
                key={server.id}
                className={`cursor-pointer ${selectedServer === server.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedServer(selectedServer === server.id ? null : server.id)}
              >
                <TableCell className="font-medium">{server.name}</TableCell>
                <TableCell>{server.type}</TableCell>
                <TableCell>
                  {server.datacenter} / {server.room} / {server.rack}
                </TableCell>
                <TableCell>{server.ip}</TableCell>
                <TableCell>{getStatusBadge(server.status)}</TableCell>
                <TableCell className={getUsageColor(server.cpu.usage)}>{server.cpu.usage}%</TableCell>
                <TableCell className={getUsageColor(server.memory.usage)}>{server.memory.usage}%</TableCell>
                <TableCell className={getUsageColor(server.storage.usage)}>{server.storage.usage}%</TableCell>
                <TableCell className={getUsageColor(server.network.usage)}>{server.network.usage}%</TableCell>
              </TableRow>
            ))}
            {filteredServers.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-4 text-center text-muted-foreground">
                  No servers found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedServer && (
        <Card>
          <CardHeader>
            <CardTitle>Server Details</CardTitle>
            <CardDescription>Detailed information for {servers.find((server) => server.id === selectedServer)?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const server = servers.find((s) => s.id === selectedServer);
              if (!server) return null;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Server Information</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Name:</div>
                          <div className="text-sm">{server.name}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Type:</div>
                          <div className="text-sm">{server.type}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Status:</div>
                          <div className="text-sm">{getStatusBadge(server.status)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Owner:</div>
                          <div className="text-sm">{server.owner}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Last Updated:</div>
                          <div className="text-sm">{server.lastUpdated}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1 text-sm font-medium">Location</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Data Center:</div>
                          <div className="text-sm">{server.datacenter}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Room:</div>
                          <div className="text-sm">{server.room}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Rack:</div>
                          <div className="text-sm">{server.rack}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Position:</div>
                          <div className="text-sm">{server.position}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Size:</div>
                          <div className="text-sm">{server.size}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1 text-sm font-medium">Network</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">IP Address:</div>
                          <div className="text-sm">{server.ip}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Bandwidth:</div>
                          <div className="text-sm">{server.network.bandwidth}</div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-sm text-muted-foreground">Usage:</div>
                          <div className="text-sm">{server.network.usage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="resources">
                      <AccordionTrigger>Resource Utilization</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">CPU Usage</div>
                              <div className={`text-sm ${getUsageColor(server.cpu.usage)}`}>{server.cpu.usage}%</div>
                            </div>
                            <Progress value={server.cpu.usage} className="h-2" indicatorClassName={getProgressColor(server.cpu.usage)} />
                            <div className="text-xs text-muted-foreground">
                              {server.cpu.model} ({server.cpu.cores} cores)
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Memory Usage</div>
                              <div className={`text-sm ${getUsageColor(server.memory.usage)}`}>{server.memory.usage}%</div>
                            </div>
                            <Progress
                              value={server.memory.usage}
                              className="h-2"
                              indicatorClassName={getProgressColor(server.memory.usage)}
                            />
                            <div className="text-xs text-muted-foreground">
                              {server.memory.used} / {server.memory.total}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Storage Usage</div>
                              <div className={`text-sm ${getUsageColor(server.storage.usage)}`}>{server.storage.usage}%</div>
                            </div>
                            <Progress
                              value={server.storage.usage}
                              className="h-2"
                              indicatorClassName={getProgressColor(server.storage.usage)}
                            />
                            <div className="text-xs text-muted-foreground">
                              {server.storage.used} / {server.storage.total}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Network Usage</div>
                              <div className={`text-sm ${getUsageColor(server.network.usage)}`}>{server.network.usage}%</div>
                            </div>
                            <Progress
                              value={server.network.usage}
                              className="h-2"
                              indicatorClassName={getProgressColor(server.network.usage)}
                            />
                            <div className="text-xs text-muted-foreground">Bandwidth: {server.network.bandwidth}</div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="applications">
                      <AccordionTrigger>Applications</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {server.applications.map((app, index) => (
                            <div key={index} className="flex items-center rounded-md border p-2">
                              <div className="text-sm">{app}</div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
