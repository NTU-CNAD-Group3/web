'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { useApi, IpPool, Server } from '@/contexts/api-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/expand-search-ui/tabs';
import { AlertCircle, CheckCircle, Database, Network, Server as ServerIcon, Loader2 } from 'lucide-react';
import { Progress } from '@/components/expand-search-ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Rack {
  servers?: Record<string, unknown>;
}
interface Room {
  racks: Record<string, Rack>;
}
interface DataCenter {
  name: string;
  rooms: Record<string, Room>;
}

export default function DashboardPage() {
  const { getAllDC, getAllServers, getAllBrokenServers, getAllIpPools } = useApi();

  const [dataCenters, setDataCenters] = useState<Record<string, DataCenter>>({});
  const [servers, setServers] = useState<Server[]>([]);
  const [brokenServers, setBrokenServers] = useState<Server[]>([]);
  const [ipPools, setIpPools] = useState<IpPool[]>([]);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      try {
        const [dcMap, allSrv, brokenSrv, pools] = await Promise.all([getAllDC(), getAllServers(), getAllBrokenServers(), getAllIpPools()]);
        setDataCenters(dcMap as Record<string, DataCenter>);
        setServers(allSrv);
        setBrokenServers(brokenSrv);
        setIpPools(pools);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(msg);
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    loadAll();
  }, [getAllDC, getAllServers, getAllBrokenServers, getAllIpPools]);

  const totalDC = useMemo(() => Object.keys(dataCenters).length, [dataCenters]);

  const totalRooms = useMemo(() => {
    return Object.values(dataCenters).reduce((acc, dc) => acc + Object.keys(dc.rooms).length, 0);
  }, [dataCenters]);

  const totalRacks = useMemo(
    () =>
      Object.values(dataCenters).reduce(
        (acc, dc) => acc + Object.values(dc.rooms).reduce((roomAcc, room) => roomAcc + Object.keys(room.racks).length, 0),
        0,
      ),
    [dataCenters],
  );

  const operationalCount = useMemo(() => servers.length - brokenServers.length, [servers, brokenServers]);
  const operationalPct = useMemo(() => (servers.length ? (operationalCount / servers.length) * 100 : 0), [operationalCount, servers]);
  const brokenPct = useMemo(() => (servers.length ? (brokenServers.length / servers.length) * 100 : 0), [brokenServers, servers]);
  const healthData = useMemo(
    () => [
      { name: 'Operational', value: operationalCount },
      { name: 'Broken', value: brokenServers.length },
    ],
    [operationalCount, brokenServers],
  );

  const dcList = useMemo(
    () =>
      Object.entries(dataCenters).map(([, dc]) => ({
        name: dc.name,
        rooms: Object.keys(dc.rooms).length,
        racks: Object.values(dc.rooms).reduce((sum, room) => sum + Object.keys(room.racks).length, 0),
        servers: Object.values(dc.rooms).reduce(
          (sumRooms, room) =>
            sumRooms +
            Object.values(room.racks).reduce((sumRacks, rack) => sumRacks + (rack.servers ? Object.keys(rack.servers).length : 0), 0),
          0,
        ),
      })),
    [dataCenters],
  );

  const poolsByService = useMemo(() => {
    const map: Record<string, IpPool[]> = {};
    ipPools.forEach((pool) => {
      (map[pool.service] ||= []).push(pool);
    });
    return Object.entries(map).map(([service, pools]) => ({ service, pools }));
  }, [ipPools]);

  const calcTotal = (cidr: string): number => Math.pow(2, 32 - parseInt(cidr.split('/')[1] ?? '32', 10));

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-6">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Data Centers', icon: Database, value: totalDC },
            { label: 'Rooms', icon: Network, value: totalRooms },
            { label: 'Racks', icon: ServerIcon, value: totalRacks },
            { label: 'Operational', icon: CheckCircle, value: operationalCount },
            { label: 'Broken', icon: AlertCircle, value: brokenServers.length },
          ].map(({ label, icon: Icon, value }) => (
            <Card key={label} className="flex flex-col items-center py-6 text-center">
              <CardHeader>
                <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{value}</div>
                <div className="mt-1 text-base text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dc-detail">By DC</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="ip">IP Pools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Servers per DC</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={dcList}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="servers" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dc-detail">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {dcList.map((dc) => (
                <Card key={dc.name} className="p-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">{dc.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Rooms: {dc.rooms}</p>
                    <p>Racks: {dc.racks}</p>
                    <p>Servers: {dc.servers}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Server Health Distribution</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={healthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                      {healthData.map((e, i) => (
                        <Cell key={i} fill={e.name === 'Operational' ? '#10B981' : '#EF4444'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <div className="mt-4 flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-xl font-semibold">{operationalPct.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Operational</div>
                  <Progress value={operationalPct} className="mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">{brokenPct.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Broken</div>
                  <Progress value={brokenPct} indicatorClassName="bg-red-500" className="mt-1" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ip">
            {poolsByService.map(({ service, pools }) => (
              <Card key={service} className="mb-6">
                <CardHeader>
                  <CardTitle>{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  {pools.map((p) => (
                    <div key={p.id} className="mb-1 flex justify-between">
                      <span>{p.cidr}</span>
                      <span>
                        {p.usedips.length} / {calcTotal(p.cidr)} IPs
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
