import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"
import { DataCenterList } from "@/components/datacenter-list"
import { Button } from "@/components/external-ui/button"
import { Plus } from "lucide-react"
import { Link } from '@/components/link';


export default function DataCentersPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Data Centers</h2>
          <Link to="/datacenters/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Data Center
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Data Center Management</CardTitle>
            <CardDescription>View and manage all your data centers</CardDescription>
          </CardHeader>
          <CardContent>
            <DataCenterList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
