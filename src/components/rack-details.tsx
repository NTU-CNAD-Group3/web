"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, MoreHorizontal, Plus, Power, Server, Thermometer, WrenchIcon } from "lucide-react"
import { Badge } from "@/components/external-ui/badge"
import { Button } from "@/components/external-ui/button"
import { Progress } from "@/components/external-ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/external-ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/external-ui/accordion"
import { RackEditDialog } from "@/components/rack-edit-dialog"
import { ServerConfigDialog } from "@/components/server-config-dialog"
import { useToast } from "@/hooks/use-toast"
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

// 模擬數據 - 機架詳情
const racksData = {
  "a-01": {
    id: "a-01",
    name: "A-01",
    location: "A 排",
    status: "online",
    model: "Dell PowerEdge 42U",
    capacity: "42U",
    usedCapacity: "36U",
    power: {
      capacity: "5.0 kW",
      usage: "3.2 kW",
      usagePercent: 64,
    },
    temperature: "24°C",
    humidity: "45%",
    servers: [
      { id: "srv-001", name: "WEB-SRV-01", status: "online", model: "Dell R740", u: 2, position: 36 },
      { id: "srv-002", name: "WEB-SRV-02", status: "online", model: "Dell R740", u: 2, position: 34 },
      { id: "srv-003", name: "APP-SRV-01", status: "online", model: "Dell R740", u: 2, position: 32 },
      { id: "srv-004", name: "APP-SRV-02", status: "online", model: "Dell R740", u: 2, position: 30 },
      { id: "srv-005", name: "DB-SRV-01", status: "online", model: "Dell R740", u: 2, position: 28 },
      { id: "srv-006", name: "DB-SRV-02", status: "online", model: "Dell R740", u: 2, position: 26 },
      { id: "srv-007", name: "STORAGE-01", status: "online", model: "Dell R740", u: 4, position: 22 },
      { id: "srv-008", name: "BACKUP-01", status: "online", model: "Dell R740", u: 2, position: 20 },
      { id: "srv-009", name: "NETWORK-01", status: "online", model: "Cisco UCS", u: 1, position: 19 },
      { id: "srv-010", name: "NETWORK-02", status: "online", model: "Cisco UCS", u: 1, position: 18 },
      { id: "srv-011", name: "NETWORK-03", status: "online", model: "Cisco UCS", u: 1, position: 17 },
      { id: "srv-012", name: "NETWORK-04", status: "online", model: "Cisco UCS", u: 1, position: 16 },
    ],
  },
  "a-03": {
    id: "a-03",
    name: "A-03",
    location: "A 排",
    status: "maintenance",
    model: "Dell PowerEdge 42U",
    capacity: "42U",
    usedCapacity: "12U",
    power: {
      capacity: "5.0 kW",
      usage: "1.5 kW",
      usagePercent: 30,
    },
    temperature: "22°C",
    humidity: "40%",
    servers: [
      { id: "srv-101", name: "TEST-SRV-01", status: "maintenance", model: "Dell R740", u: 2, position: 40 },
      { id: "srv-102", name: "TEST-SRV-02", status: "maintenance", model: "Dell R740", u: 2, position: 38 },
      { id: "srv-103", name: "TEST-SRV-03", status: "online", model: "Dell R740", u: 2, position: 36 },
      { id: "srv-104", name: "TEST-SRV-04", status: "online", model: "Dell R740", u: 2, position: 34 },
    ],
  },
  "b-02": {
    id: "b-02",
    name: "B-02",
    location: "B 排",
    status: "offline",
    model: "Dell PowerEdge 42U",
    capacity: "42U",
    usedCapacity: "0U",
    power: {
      capacity: "5.0 kW",
      usage: "0 kW",
      usagePercent: 0,
    },
    temperature: "21°C",
    humidity: "40%",
    servers: [],
  },
}

interface RackDetailsProps {
  rackId?: string
}

export function RackDetails({ rackId = "a-01" }: RackDetailsProps) {
  const [rackData, setRackData] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // 在實際應用中，這裡會從API獲取數據
    setRackData(racksData[rackId as keyof typeof racksData] || racksData["a-01"])
  }, [rackId, refreshKey])

  if (!rackData) {
    return <div>加載中...</div>
  }

  const handleRackUpdate = () => {
    toast({
      title: "機架信息已更新",
      description: `機架 ${rackData.name} 的信息已成功更新。`,
    })
    setRefreshKey((prev) => prev + 1)
  }

  const handleServerUpdate = () => {
    toast({
      title: "服務器已添加",
      description: "新服務器已成功添加到機架。",
    })
    setRefreshKey((prev) => prev + 1)
  }

  const handleServerRemove = (serverId: string) => {
    toast({
      title: "服務器已移除",
      description: "服務器已從機架中移除。",
    })
    // 在實際應用中，這裡會調用API刪除服務器
    // 模擬刪除服務器
    const updatedServers = rackData.servers.filter((server: any) => server.id !== serverId)
    setRackData({
      ...rackData,
      servers: updatedServers,
      usedCapacity: `${updatedServers.reduce((acc: number, server: any) => acc + server.u, 0)}U`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "offline":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "maintenance":
        return <WrenchIcon className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "在線"
      case "offline":
        return "離線"
      case "maintenance":
        return "維護中"
      default:
        return "未知"
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(rackData.status)}
          <h2 className="text-2xl font-bold">{rackData.name}</h2>
          {getStatusBadge(rackData.status)}
        </div>
        <RackEditDialog
          rackId={rackData.id}
          onSave={handleRackUpdate}
          initialData={{
            name: rackData.name,
            location: rackData.location,
            model: rackData.model,
            capacity: rackData.capacity,
            powerCapacity: rackData.power.capacity,
          }}
          trigger={<Button variant="outline">編輯機架</Button>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">位置</div>
          <div>{rackData.location}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">型號</div>
          <div>{rackData.model}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">容量</div>
          <div>
            {rackData.capacity} (已使用: {rackData.usedCapacity})
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">服務器數量</div>
          <div>{rackData.servers.length} 台</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">機架使用率</div>
          <div className="text-sm text-muted-foreground">
            {(Number.parseInt(rackData.usedCapacity) / Number.parseInt(rackData.capacity)) * 100}%
          </div>
        </div>

        <Progress
          value={(Number.parseInt(rackData.usedCapacity) / Number.parseInt(rackData.capacity)) * 100}
          className="h-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">電源使用率</div>
          <div className="text-sm text-muted-foreground">{rackData.power.usagePercent}%</div>
        </div>
        <Progress value={rackData.power.usagePercent} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {rackData.power.usage} / {rackData.power.capacity}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 p-3 border rounded-md">
          <Thermometer className="h-5 w-5 text-orange-500" />
          <div>
            <div className="text-sm font-medium">溫度</div>
            <div>{rackData.temperature}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 border rounded-md">
          <Server className="h-5 w-5 text-blue-500" />
          <div>
            <div className="text-sm font-medium">濕度</div>
            <div>{rackData.humidity}</div>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="servers">
          <AccordionTrigger>服務器列表 ({rackData.servers.length})</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <ServerConfigDialog
                  rackId={rackData.id}
                  onSave={handleServerUpdate}
                  trigger={
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加服務器
                    </Button>
                  }
                />
              </div>

              {rackData.servers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">此機架中沒有服務器</div>
              ) : (
                <div className="space-y-2">
                  {rackData.servers.map((server: any) => (
                    <div key={server.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(server.status)}
                        <div>
                          <div className="font-medium">{server.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {server.model} ({server.u}U)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">U{server.position}</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <ServerConfigDialog
                                serverId={server.id}
                                rackId={rackData.id}
                                onSave={handleServerUpdate}
                                initialData={{
                                  name: server.name,
                                  model: server.model,
                                  status: server.status,
                                  position: server.position.toString(),
                                  size: server.u.toString(),
                                }}
                                trigger={<div className="w-full">編輯</div>}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Power className="h-4 w-4 mr-2" />
                              電源控制
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <AlertDialog>
                                <AlertDialogTrigger className="w-full text-left">移除服務器</AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>確認移除服務器</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      您確定要從機架中移除此服務器嗎？此操作無法撤銷。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleServerRemove(server.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      移除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">查看監控</Button>
        <Button>管理服務器</Button>
      </div>
    </div>
  )
}
