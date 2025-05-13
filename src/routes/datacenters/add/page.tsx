import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"
import { DataCenterForm } from "@/components/datacenter-form"
import { Button } from "@/components/external-ui/button"
import { ChevronLeft } from "lucide-react"
import { Link } from "@/components/link"


export default function AddDataCenterPage() {
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
          <Link to="/datacenters">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Add New Data Center</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Data Center Information</CardTitle>
            <CardDescription>Enter the details for the new data center</CardDescription>
          </CardHeader>
          <CardContent>
            <DataCenterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
