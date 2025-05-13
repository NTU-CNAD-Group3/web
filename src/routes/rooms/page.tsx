import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/external-ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/external-ui/tabs"
import { RoomVisualization } from "@/components/room-visualization"
import { RoomList } from "@/components/room-list"
import { RoomDetails } from "@/components/room-details"


export default function RoomsPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Room Management</h2>
        </div>
        <Tabs defaultValue="visualization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visualization">Room Visualization</TabsTrigger>
            <TabsTrigger value="list">Room List</TabsTrigger>
            <TabsTrigger value="details">Room Details</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Center Room Visualization</CardTitle>
                <CardDescription>View the physical layout of data center rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomVisualization />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room List</CardTitle>
                <CardDescription>View all rooms and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
                <CardDescription>View detailed information for a selected room</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomDetails />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
