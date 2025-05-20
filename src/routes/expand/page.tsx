'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { useApi, IpPool } from '@/contexts/api-context';
import { Button } from '@/components/expand-search-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/expand-search-ui/tabs';
import { Progress } from '@/components/expand-search-ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/expand-search-ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/expand-search-ui/form';
import { Input } from '@/components/expand-search-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/expand-search-ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const createIpPoolSchema = z.object({
  service: z.string().min(1, 'Service is required'),
  cidrBlock: z.string().min(1, 'CIDR is required'),
});
type CreateIpPoolData = z.infer<typeof createIpPoolSchema>;

export default function ExpandPage() {
  const api = useApi();
  const { toast } = useToast();

  const [ipPools, setIpPools] = useState<IpPool[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [usedIPs, setUsedIPs] = useState<string[]>([]);

  // 按 service 分组：{ [service]: IpPool[] }
  const groupedPools = ipPools.reduce<Record<string, IpPool[]>>((acc, pool) => {
    if (!acc[pool.service]) acc[pool.service] = [];
    acc[pool.service].push(pool);
    return acc;
  }, {});
  // 服务使用率缓存
  const [serviceStats, setServiceStats] = useState<Record<string, { total: number; used: number }>>({});

  const [loadingPools, setLoadingPools] = useState(true);
  const [loadingUsedIPs, setLoadingUsedIPs] = useState(false);

  // 表单状态
  const ipPoolForm = useForm<CreateIpPoolData>({
    resolver: zodResolver(createIpPoolSchema),
    defaultValues: { service: '', cidrBlock: '' },
  });
  const globalLoading = ipPoolForm.formState.isSubmitting;

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageTextColor = (usage: number) => {
    if (usage >= 90) return 'text-red-500';
    if (usage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  useEffect(() => {
    // 对每个 service 请求 allIp + usedIp
    availableServices.forEach(async (svc) => {
      try {
        const [all, used] = await Promise.all([api.getAllIp(svc), api.getUsedIp(svc)]);
        setServiceStats((prev) => ({
          ...prev,
          [svc]: { total: all.length, used: used.length },
        }));
      } catch (e) {
        console.error('stat load error', svc, e);
      }
    });
  }, [api, availableServices]);

  // 拉所有 IP Pools
  useEffect(() => {
    async function loadPools() {
      setLoadingPools(true);
      try {
        const pools = await api.getAllIpPools();
        setIpPools(pools);
        const services = [...new Set(pools.map((p) => p.service))];
        setAvailableServices(services);
        if (services[0]) setSelectedService(services[0]);
      } catch (e) {
        toast({ title: 'Error', description: String(e), variant: 'destructive' });
      } finally {
        setLoadingPools(false);
      }
    }
    loadPools();
  }, [api, toast]);

  // 拉已用 IPs + 全 IP 列表
  useEffect(() => {
    if (!selectedService) return;

    setLoadingUsedIPs(true);
    api
      .getUsedIp(selectedService)
      .then(setUsedIPs)
      .catch((e) => toast({ title: 'Error', description: String(e), variant: 'destructive' }))
      .finally(() => setLoadingUsedIPs(false));

    api.getAllIp(selectedService).catch((e) => toast({ title: 'Error', description: String(e), variant: 'destructive' }));
  }, [api, selectedService, toast]);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
  };

  const onSubmitIpPool = async (data: CreateIpPoolData) => {
    try {
      await api.createIpPool({ service: data.service, cidrBlock: data.cidrBlock });
      toast({ title: 'Success', description: 'IP pool created' });
      ipPoolForm.reset();
      // 重新拉 Pools 列表
      const pools = await api.getAllIpPools();
      setIpPools(pools);
      setAvailableServices((prev) => Array.from(new Set([...prev, data.service])));
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold">IP Management</h2>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">IP Pools Overview</TabsTrigger>
            <TabsTrigger value="usage">IP Usage</TabsTrigger>
            <TabsTrigger value="create">Create IP Pool</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IP Pools</CardTitle>
                <CardDescription>Overview of all IP pools</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPools ? (
                  <div className="py-8 text-center">Loading...</div>
                ) : ipPools.length === 0 ? (
                  <div className="py-8 text-center">No IP pools found</div>
                ) : (
                  Object.entries(groupedPools).map(([service, pools]) => {
                    const stats = serviceStats[service] || { total: 0, used: 0 };
                    const percent = stats.total ? (stats.used / stats.total) * 100 : 0;

                    return (
                      <div key={service} className="space-y-2 rounded border p-4">
                        {/* 服务级别标题和进度 */}
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{service}</h3>
                          <div className={`text-sm font-medium ${getUsageTextColor(percent)}`}>
                            {stats.used} / {stats.total} ({Math.round(percent)}%)
                          </div>
                        </div>
                        <Progress value={percent} indicatorClassName={getUsageColor(percent)} />

                        {/* 下方列出该服务所有 pool */}
                        <div className="mt-4 space-y-1">
                          {pools.map((pool) => (
                            <div key={pool.id} className="flex justify-between">
                              <span className="font-mono">{pool.cidr}</span>
                              <span className="text-xs text-muted-foreground">
                                Created: {new Date(pool.createdat).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用情况 */}
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IP Usage</CardTitle>
                <CardDescription>View used IPs for a specific service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <span className="font-medium">Service:</span>
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue>{selectedService || 'Select service'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {loadingPools ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        availableServices.map((svc) => (
                          <SelectItem key={svc} value={svc}>
                            {svc}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {loadingUsedIPs ? (
                  <div className="py-8 text-center">Loading used IPs...</div>
                ) : usedIPs.length === 0 ? (
                  <div className="py-8 text-center">No used IPs found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usedIPs.map((ip, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 创建 IP Pool */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create IP Pool</CardTitle>
                <CardDescription>Add a new IP pool</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...ipPoolForm}>
                  <form onSubmit={ipPoolForm.handleSubmit(onSubmitIpPool)} className="space-y-4">
                    <FormField
                      control={ipPoolForm.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <FormControl>
                            <Input placeholder="Service name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ipPoolForm.control}
                      name="cidrBlock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CIDR</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 192.168.1.0/24" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={globalLoading}>
                      {globalLoading ? 'Creating...' : 'Create IP Pool'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
