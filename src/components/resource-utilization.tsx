'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/external-ui/card';
import { Progress } from '@/components/external-ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/external-ui/tabs';

export function ResourceUtilization() {
  return (
    <Tabs defaultValue="cpu">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="cpu">CPU</TabsTrigger>
        <TabsTrigger value="memory">Memory</TabsTrigger>
        <TabsTrigger value="storage">Storage</TabsTrigger>
        <TabsTrigger value="network">Network</TabsTrigger>
      </TabsList>
      <TabsContent value="cpu" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ResourceCard title="WEB-SRV-01" value={78} description="4 cores / 3.5 GHz" trend="increasing" />
          <ResourceCard title="DB-SRV-01" value={92} description="8 cores / 4.0 GHz" trend="increasing" alert={true} />
          <ResourceCard title="APP-SRV-01" value={45} description="6 cores / 3.2 GHz" trend="stable" />
          <ResourceCard title="BACKUP-SRV-01" value={12} description="4 cores / 2.8 GHz" trend="decreasing" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Details</CardTitle>
            <CardDescription>CPU usage by server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">WEB-SRV-01</div>
                  <div>78%</div>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">DB-SRV-01</div>
                  <div className="font-medium text-red-500">92%</div>
                </div>
                <Progress value={92} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">APP-SRV-01</div>
                  <div>45%</div>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">BACKUP-SRV-01</div>
                  <div>12%</div>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="memory" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ResourceCard title="WEB-SRV-01" value={65} description="32 GB / 21 GB used" trend="stable" />
          <ResourceCard title="DB-SRV-01" value={85} description="64 GB / 54 GB used" trend="increasing" alert={true} />
          <ResourceCard title="APP-SRV-01" value={40} description="16 GB / 6.4 GB used" trend="decreasing" />
          <ResourceCard title="BACKUP-SRV-01" value={25} description="16 GB / 4 GB used" trend="stable" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage Details</CardTitle>
            <CardDescription>Memory usage by server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">WEB-SRV-01</div>
                  <div>65%</div>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">DB-SRV-01</div>
                  <div className="font-medium text-yellow-500">85%</div>
                </div>
                <Progress value={85} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">APP-SRV-01</div>
                  <div>40%</div>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">BACKUP-SRV-01</div>
                  <div>25%</div>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="storage" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ResourceCard title="WEB-SRV-01" value={45} description="500 GB / 225 GB used" trend="stable" />
          <ResourceCard title="DB-SRV-01" value={95} description="2 TB / 1.9 TB used" trend="increasing" alert={true} />
          <ResourceCard title="APP-SRV-01" value={60} description="1 TB / 600 GB used" trend="increasing" />
          <ResourceCard title="BACKUP-SRV-01" value={75} description="4 TB / 3 TB used" trend="increasing" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage Details</CardTitle>
            <CardDescription>Storage usage by server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">WEB-SRV-01</div>
                  <div>45%</div>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">DB-SRV-01</div>
                  <div className="font-medium text-red-500">95%</div>
                </div>
                <Progress value={95} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">APP-SRV-01</div>
                  <div>60%</div>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">BACKUP-SRV-01</div>
                  <div>75%</div>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="network" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ResourceCard title="WEB-SRV-01" value={82} description="1 Gbps / 820 Mbps" trend="increasing" />
          <ResourceCard title="DB-SRV-01" value={45} description="1 Gbps / 450 Mbps" trend="stable" />
          <ResourceCard title="APP-SRV-01" value={30} description="1 Gbps / 300 Mbps" trend="decreasing" />
          <ResourceCard title="BACKUP-SRV-01" value={90} description="1 Gbps / 900 Mbps" trend="increasing" alert={true} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Network Usage Details</CardTitle>
            <CardDescription>Network usage by server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">WEB-SRV-01</div>
                  <div className="font-medium text-yellow-500">82%</div>
                </div>
                <Progress value={82} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">DB-SRV-01</div>
                  <div>45%</div>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">APP-SRV-01</div>
                  <div>30%</div>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">BACKUP-SRV-01</div>
                  <div className="font-medium text-red-500">90%</div>
                </div>
                <Progress value={90} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

interface ResourceCardProps {
  title: string;
  value: number;
  description: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  alert?: boolean;
}

function ResourceCard({ title, value, description, trend, alert = false }: ResourceCardProps) {
  const getValueColor = () => {
    if (alert) {
      return value > 90 ? 'text-red-500' : 'text-yellow-500';
    }
    return '';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <span className="text-red-500">↑</span>;
      case 'decreasing':
        return <span className="text-green-500">↓</span>;
      case 'stable':
        return <span className="text-gray-500">→</span>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getValueColor()}`}>{value}%</div>
        <p className="mt-1 text-xs text-muted-foreground">
          {description}{' '}
          <span className="ml-1">
            {getTrendIcon()} {trend}
          </span>
        </p>
        <Progress
          value={value}
          className={`mt-2 h-2 ${alert ? (value > 90 ? 'bg-red-100' : 'bg-yellow-100') : ''}`}
          indicatorClassName={alert ? (value > 90 ? 'bg-red-500' : 'bg-yellow-500') : ''}
        />
      </CardContent>
    </Card>
  );
}
