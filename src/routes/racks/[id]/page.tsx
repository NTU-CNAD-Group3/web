import { useParams } from 'react-router-dom';
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"
import { RackDetails } from "@/components/rack-details"
import { Button } from "@/components/external-ui/button"
import { ChevronLeft } from "lucide-react"
import { Link } from '@/components/link';


export default function RackDetailPage() {
  const { id } = useParams<{ id: string }>();

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
        <div className="flex items-center space-x-2">
          <Link to="/racks">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">機架詳情</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>機架信息</CardTitle>
            <CardDescription>查看和管理機架詳細信息</CardDescription>
          </CardHeader>
          <CardContent>
            <RackDetails rackId={id!} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
