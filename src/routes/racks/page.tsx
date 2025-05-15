import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/external-ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/external-ui/tabs';
import { RackVisualization } from '@/components/rack-visualization';
import { RackList } from '@/components/rack-list';
import { RackDetails } from '@/components/rack-details';

export default function RacksPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">機架管理</h2>
        </div>
        <Tabs defaultValue="visualization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visualization">機架視覺化</TabsTrigger>
            <TabsTrigger value="list">機架列表</TabsTrigger>
            <TabsTrigger value="details">詳細信息</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>數據中心機架視覺化</CardTitle>
                <CardDescription>查看數據中心機架的物理布局</CardDescription>
              </CardHeader>
              <CardContent>
                <RackVisualization />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>機架列表</CardTitle>
                <CardDescription>查看所有機架及其狀態</CardDescription>
              </CardHeader>
              <CardContent>
                <RackList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>機架詳細信息</CardTitle>
                <CardDescription>查看選定機架的詳細信息</CardDescription>
              </CardHeader>
              <CardContent>
                <RackDetails />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
