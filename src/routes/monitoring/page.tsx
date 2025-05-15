import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/external-ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/external-ui/tabs';
import { ServerMetrics } from '@/components/server-metrics';
import { AlertsList } from '@/components/alerts-list';
import { ResourceUtilization } from '@/components/resource-utilization';

export default function MonitoringPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
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
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">監控中心</h2>
        </div>
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="metrics">性能指標</TabsTrigger>
            <TabsTrigger value="alerts">告警</TabsTrigger>
            <TabsTrigger value="resources">資源使用</TabsTrigger>
          </TabsList>
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>服務器性能指標</CardTitle>
                <CardDescription>監控所有服務器的性能指標</CardDescription>
              </CardHeader>
              <CardContent>
                <ServerMetrics />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>系統告警</CardTitle>
                <CardDescription>查看和管理所有系統告警</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList showAll={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>資源使用情況</CardTitle>
                <CardDescription>監控數據中心資源使用情況</CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceUtilization />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
