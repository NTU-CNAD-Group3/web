"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/external-ui/table"
import { Badge } from "@/components/external-ui/badge"
import { Button } from "@/components/external-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/external-ui/dropdown-menu"
import { Input } from "@/components/external-ui/input"
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { RackEditDialog } from "@/components/rack-edit-dialog"
import { useToast } from "@/hooks/use-toast"
import { Link } from "@/components/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/external-ui/alert-dialog"

// 模擬數據 - 機架列表
const racks = [
  {
    id: "a-01",
    name: "A-01",
    location: "A 排",
    status: "online",
    capacity: "42U",
    servers: 12,
    usage: 85,
    power: "3.2 kW",
    temperature: "24°C",
  },
  {
    id: "a-02",
    name: "A-02",
    location: "A 排",
    status: "online",
    capacity: "42U",
    servers: 8,
    usage: 70,
    power: "2.8 kW",
    temperature: "23°C",
  },
  {
    id: "a-03",
    name: "A-03",
    location: "A 排",
    status: "maintenance",
    capacity: "42U",
    servers: 4,
    usage: 30,
    power: "1.5 kW",
    temperature: "22°C",
  },
  {
    id: "a-04",
    name: "A-04",
    location: "A 排",
    status: "online",
    capacity: "42U",
    servers: 15,
    usage: 90,
    power: "4.1 kW",
    temperature: "26°C",
  },
  {
    id: "b-01",
    name: "B-01",
    location: "B 排",
    status: "online",
    capacity: "42U",
    servers: 10,
    usage: 65,
    power: "2.9 kW",
    temperature: "24°C",
  },
  {
    id: "b-02",
    name: "B-02",
    location: "B 排",
    status: "offline",
    capacity: "42U",
    servers: 0,
    usage: 0,
    power: "0 kW",
    temperature: "21°C",
  },
  {
    id: "b-03",
    name: "B-03",
    location: "B 排",
    status: "online",
    capacity: "42U",
    servers: 12,
    usage: 75,
    power: "3.4 kW",
    temperature: "25°C",
  },
  {
    id: "c-01",
    name: "C-01",
    location: "C 排",
    status: "online",
    capacity: "42U",
    servers: 7,
    usage: 50,
    power: "2.1 kW",
    temperature: "23°C",
  },
  {
    id: "c-02",
    name: "C-02",
    location: "C 排",
    status: "online",
    capacity: "42U",
    servers: 9,
    usage: 60,
    power: "2.6 kW",
    temperature: "24°C",
  },
  {
    id: "c-03",
    name: "C-03",
    location: "C 排",
    status: "online",
    capacity: "42U",
    servers: 6,
    usage: 40,
    power: "1.8 kW",
    temperature: "22°C",
  },
  {
    id: "c-04",
    name: "C-04",
    location: "C 排",
    status: "maintenance",
    capacity: "42U",
    servers: 3,
    usage: 20,
    power: "1.2 kW",
    temperature: "22°C",
  },
  {
    id: "d-01",
    name: "D-01",
    location: "D 排",
    status: "online",
    capacity: "42U",
    servers: 14,
    usage: 80,
    power: "3.8 kW",
    temperature: "25°C",
  },
  {
    id: "d-02",
    name: "D-02",
    location: "D 排",
    status: "online",
    capacity: "42U",
    servers: 12,
    usage: 75,
    power: "3.5 kW",
    temperature: "24°C",
  },
]

export function RackList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [racksList, setRacksList] = useState(racks)
  const { toast } = useToast()

  const filteredRacks = racksList.filter(
    (rack) =>
      rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rack.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRackUpdate = () => {
    toast({
      title: "機架信息已更新",
      description: "機架信息已成功更新。",
    })
  }

  const handleRackDelete = (rackId: string) => {
    // 在實際應用中，這裡會調用API刪除機架
    setRacksList(racksList.filter((rack) => rack.id !== rackId))

    toast({
      title: "機架已刪除",
      description: "機架已成功從系統中刪除。",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">在線</Badge>
      case "offline":
        return <Badge variant="destructive">離線</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            維護中
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "text-red-500"
    if (usage >= 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索機架..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            篩選
          </Button>
          <Link to="/racks/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加機架
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>機架名稱</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>容量</TableHead>
              <TableHead>服務器數量</TableHead>
              <TableHead>使用率</TableHead>
              <TableHead>功率</TableHead>
              <TableHead>溫度</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRacks.map((rack) => (
              <TableRow key={rack.id}>
                <TableCell className="font-medium">{rack.name}</TableCell>
                <TableCell>{rack.location}</TableCell>
                <TableCell>{getStatusBadge(rack.status)}</TableCell>
                <TableCell>{rack.capacity}</TableCell>
                <TableCell>{rack.servers}</TableCell>
                <TableCell className={getUsageColor(rack.usage)}>{rack.usage}%</TableCell>
                <TableCell>{rack.power}</TableCell>
                <TableCell>{rack.temperature}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打開菜單</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link to={`/racks/${rack.id}`} className="w-full">
                          查看詳情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RackEditDialog
                          rackId={rack.id}
                          onSave={handleRackUpdate}
                          initialData={{
                            name: rack.name,
                            location: rack.location,
                            capacity: rack.capacity,
                            powerCapacity: rack.power,
                          }}
                          trigger={<div className="w-full">編輯</div>}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to={`/racks/${rack.id}`} className="w-full">
                          查看服務器
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>管理電源</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger className="w-full text-left">刪除機架</AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確認刪除機架</AlertDialogTitle>
                              <AlertDialogDescription>
                                您確定要刪除此機架嗎？此操作無法撤銷，並且會移除所有相關的服務器配置。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRackDelete(rack.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
