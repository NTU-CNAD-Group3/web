import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/external-ui/tabs"
import { ServerMetrics } from "@/components/server-metrics"
import { ServerList } from "@/components/server-list"
import { AlertsList } from "@/components/alerts-list"
import { ResourceUtilization } from "@/components/resource-utilization"
import { DataCenterOverview } from "@/components/datacenter-overview"

export function DashboardOverview() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="datacenters">Data Centers</TabsTrigger>
        <TabsTrigger value="servers">Servers</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+2 added this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">-2 compared to last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">+5% compared to last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground">+8% compared to last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Server Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ServerMetrics />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts from the past 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="datacenters" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Centers Overview</CardTitle>
            <CardDescription>View and manage all data centers</CardDescription>
          </CardHeader>
          <CardContent>
            <DataCenterOverview />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="servers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Server List</CardTitle>
            <CardDescription>Manage all servers in the data centers</CardDescription>
          </CardHeader>
          <CardContent>
            <ServerList />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="alerts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>View and manage all system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsList showAll={true} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="resources" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>Monitor data center resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceUtilization />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
