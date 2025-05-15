import { ServerList } from "@/components/server-list"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/external-ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"


export default function ServersPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
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
          <h2 className="text-3xl font-bold tracking-tight">服務器管理</h2>
          <div className="flex items-center space-x-2">
            <Button>添加新服務器</Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>服務器列表</CardTitle>
            <CardDescription>管理數據中心的所有服務器</CardDescription>
          </CardHeader>
          <CardContent>
            <ServerList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
