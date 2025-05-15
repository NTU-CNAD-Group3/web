"use client"

import { useState } from "react"
import { Button } from "@/components/external-ui/button"
import { Card, CardContent } from "@/components/external-ui/card"
import { Badge } from "@/components/external-ui/badge"
import { AlertCircle, CheckCircle2, Info, Server, Thermometer, WrenchIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/external-ui/tooltip"
import { useToast } from "@/hooks/use-toast"

// 模擬數據 - 機架和服務器
const dataCenter = {
  rows: [
    {
      id: "row-a",
      name: "A 排",
      racks: [
        { id: "a-01", name: "A-01", status: "online", usage: 85, temperature: "正常", servers: 12, u: 42 },
        { id: "a-02", name: "A-02", status: "online", usage: 70, temperature: "正常", servers: 8, u: 42 },
        { id: "a-03", name: "A-03", status: "maintenance", usage: 30, temperature: "正常", servers: 4, u: 42 },
        { id: "a-04", name: "A-04", status: "online", usage: 90, temperature: "偏高", servers: 15, u: 42 },
      ],
    },
    {
      id: "row-b",
      name: "B 排",
      racks: [
        { id: "b-01", name: "B-01", status: "online", usage: 65, temperature: "正常", servers: 10, u: 42 },
        { id: "b-02", name: "B-02", status: "offline", usage: 0, temperature: "正常", servers: 0, u: 42 },
        { id: "b-03", name: "B-03", status: "online", usage: 75, temperature: "正常", servers: 12, u: 42 },
      ],
    },
    {
      id: "row-c",
      name: "C 排",
      racks: [
        { id: "c-01", name: "C-01", status: "online", usage: 50, temperature: "正常", servers: 7, u: 42 },
        { id: "c-02", name: "C-02", status: "online", usage: 60, temperature: "正常", servers: 9, u: 42 },
        { id: "c-03", name: "C-03", status: "online", usage: 40, temperature: "正常", servers: 6, u: 42 },
        { id: "c-04", name: "C-04", status: "maintenance", usage: 20, temperature: "正常", servers: 3, u: 42 },
      ],
    },
    {
      id: "row-d",
      name: "D 排",
      racks: [
        { id: "d-01", name: "D-01", status: "online", usage: 80, temperature: "正常", servers: 14, u: 42 },
        { id: "d-02", name: "D-02", status: "online", usage: 75, temperature: "正常", servers: 12, u: 42 },
      ],
    },
  ],
}

interface RackDetailsProps {
  rackId: string
}

function RackDetails({ rackId }: RackDetailsProps) {
  // 查找機架信息
  let rackInfo = null
  for (const row of dataCenter.rows) {
    const rack = row.racks.find((r) => r.id === rackId)
    if (rack) {
      rackInfo = rack
      break
    }
  }

  if (!rackInfo) {
    return <div>找不到機架信息</div>
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

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">機架 {rackInfo.name} 詳情</h4>
      <p>狀態: {getStatusText(rackInfo.status)}</p>
      <p>使用率: {rackInfo.usage}%</p>
      <p>服務器數量: {rackInfo.servers}</p>
      <p>溫度: {rackInfo.temperature}</p>
    </div>
  )
}

export function RackVisualization() {
  const [selectedRack, setSelectedRack] = useState<string | null>(null)
  const [view, setView] = useState<"2d" | "top">("2d")
  const { toast } = useToast()

  const handleRackClick = (rackId: string) => {
    setSelectedRack(rackId === selectedRack ? null : rackId)

    // 查找機架信息
    let rackInfo = null
    for (const row of dataCenter.rows) {
      const rack = row.racks.find((r) => r.id === rackId)
      if (rack) {
        rackInfo = rack
        break
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

    if (rackInfo) {
      toast({
        title: `機架 ${rackInfo.name}`,
        description: `狀態: ${getStatusText(rackInfo.status)} | 使用率: ${rackInfo.usage}% | 服務器: ${rackInfo.servers}台`,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "offline":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <WrenchIcon className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "bg-red-500"
    if (usage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant={view === "2d" ? "default" : "outline"} size="sm" onClick={() => setView("2d")}>
            2D 視圖
          </Button>
          <Button variant={view === "top" ? "default" : "outline"} size="sm" onClick={() => setView("top")}>
            俯視圖
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">在線</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">離線</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">維護中</span>
          </div>
        </div>
      </div>

      {view === "2d" && (
        <div className="grid grid-cols-1 gap-8">
          {dataCenter.rows.map((row) => (
            <div key={row.id} className="space-y-2">
              <h3 className="font-medium">{row.name}</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {row.racks.map((rack) => (
                  <TooltipProvider key={rack.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex flex-col w-32 h-96 border rounded-md cursor-pointer transition-all ${
                            selectedRack === rack.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleRackClick(rack.id)}
                        >
                          <div className="bg-muted p-2 text-center font-medium text-sm border-b">{rack.name}</div>
                          <div className="flex-1 p-1 flex flex-col space-y-1 overflow-hidden">
                            {Array.from({ length: Math.ceil((rack.usage / 100) * rack.u) }).map((_, i) => (
                              <div key={i} className={`h-2 rounded-sm ${getUsageColor(rack.usage)}`}></div>
                            ))}
                          </div>
                          <div className="p-2 border-t flex justify-between items-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(rack.status)}`}></div>
                            <div className="text-xs">{rack.usage}%</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-bold">{rack.name}</div>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(rack.status)}
                            <span>{getStatusText(rack.status)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Server className="h-4 w-4" />
                            <span>{rack.servers} 台服務器</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4" />
                            <span>溫度: {rack.temperature}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "top" && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="grid grid-cols-1 gap-8">
            {dataCenter.rows.map((row) => (
              <div key={row.id} className="space-y-2">
                <h3 className="font-medium">{row.name}</h3>
                <div className="flex space-x-4">
                  {row.racks.map((rack) => (
                    <TooltipProvider key={rack.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-24 h-24 border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all ${
                              selectedRack === rack.id ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => handleRackClick(rack.id)}
                            style={{
                              backgroundColor:
                                rack.status === "offline"
                                  ? "#fee2e2"
                                  : rack.status === "maintenance"
                                    ? "#fef3c7"
                                    : rack.usage >= 90
                                      ? "#fecaca"
                                      : rack.usage >= 70
                                        ? "#fed7aa"
                                        : "#d1fae5",
                            }}
                          >
                            <div className="font-bold">{rack.name}</div>
                            <div className="text-sm">{rack.usage}%</div>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {rack.servers} 台
                              </Badge>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-bold">{rack.name}</div>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(rack.status)}
                              <span>{getStatusText(rack.status)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Server className="h-4 w-4" />
                              <span>{rack.servers} 台服務器</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-4 w-4" />
                              <span>溫度: {rack.temperature}</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRack && (
        <Card>
          <CardContent className="p-4">
            <RackDetails rackId={selectedRack} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
