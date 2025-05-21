'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/expand-search-ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/expand-search-ui/table';
import { Badge } from '@/components/expand-search-ui/badge';
import { useApi, DataCenterResponse } from '@/contexts/api-context';
import { AlertCircle, CheckCircle, Server as ServerIcon, HardDrive, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/expand-search-ui/tooltip';
import { Link } from 'react-router-dom';
import { Button } from '@/components/expand-search-ui/button';

// 精确类型声明
interface ServerPosition {
  name: string;
  unit?: number;
  ip?: string;
  healthy?: boolean;
  position_front?: number;
  position_back?: number;
  serverFrontPosition?: number;
  serverBackPosition?: number;
}

interface RackInfo {
  id: number;
  name: string;
  service: string;
  height: number;
  serverNum: number;
  servers: Record<string, ServerPosition>;
}

interface RoomInfo {
  id: number;
  name: string;
  height: number;
  maxRack?: number;
  rackNum: number;
  racks: Record<string, RackInfo>;
}

export function DatacenterVisualization() {
  const { getAllDC } = useApi();
  const [dcMap, setDcMap] = useState<DataCenterResponse>({});
  const [selectedDC, setSelectedDC] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) 加载所有 DC
  useEffect(() => {
    async function fetchDCs() {
      setLoading(true);
      try {
        const all = await getAllDC();
        setDcMap(all);
        if (!selectedDC && Object.keys(all).length) {
          setSelectedDC(Object.keys(all)[0]);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchDCs();
  }, [getAllDC, selectedDC]);

  // 下拉列表：所有 DC
  const dcList = useMemo(() => Object.entries(dcMap).map(([id, dc]) => ({ id, name: dc.name })), [dcMap]);

  // 按选中 DC 提取出房间列表
  const rooms = useMemo(() => {
    if (!selectedDC) return [];
    const roomMap = (dcMap[selectedDC]?.rooms as Record<string, RoomInfo>) || {};
    return Object.entries(roomMap).map(([roomId, raw]) => {
      const r = raw as RoomInfo;
      return {
        roomId: Number(roomId),
        info: {
          id: r.id,
          name: r.name,
          height: r.height,
          maxRack: r.maxRack,
          rackNum: r.rackNum,
          racks: r.racks as Record<string, RackInfo>,
        },
      };
    });
  }, [dcMap, selectedDC]);

  if (loading)
    return (
      <Card>
        <CardContent className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  if (error)
    return (
      <Card>
        <CardContent className="py-20 text-center text-red-500">{error}</CardContent>
      </Card>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Datacenter Layout</CardTitle>
        <CardDescription>Select DC, then view each room’s racks</CardDescription>
        <div className="mt-4 flex space-x-4">
          <Select value={selectedDC} onValueChange={(v) => setSelectedDC(v)} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select DC" />
            </SelectTrigger>
            <SelectContent>
              {dcList.map((dc) => (
                <SelectItem key={dc.id} value={dc.id}>
                  {dc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {rooms.map(({ roomId, info }) => (
          <div key={roomId}>
            <h3 className="mb-2 text-lg font-medium">Room: {info.name}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(info.racks).map(([rackId, rack]) => (
                <div key={rackId} className="rounded border p-4">
                  {/* rack 标头 */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center font-medium">
                      <ServerIcon className="mr-2 h-5 w-5" />
                      {rack.name}
                    </div>
                    <Badge variant="outline">{rack.service}</Badge>
                  </div>

                  {/* U 位表格 */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>U</TableHead>
                        <TableHead>Device</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* 从 height 到 0（含） */}
                      {Array.from({ length: rack.height + 1 }, (_, idx) => rack.height - idx).map((pos) => {
                        // 先把 rack.servers 强制为 Record<string, ServerPosition>
                        const serversMap = rack.servers as Record<string, ServerPosition>;

                        // 然后声明 entries 类型，entry 的型别就是 [string, ServerPosition]
                        const entry = (Object.entries(serversMap) as [string, ServerPosition][]).find(
                          ([, s]) =>
                            pos >= (s.position_front ?? s.serverFrontPosition ?? 0) &&
                            pos <= (s.position_back ?? s.serverBackPosition ?? 0),
                        );

                        const sData = entry ? entry[1] : null;

                        return (
                          <TableRow key={pos} className={sData ? 'bg-blue-50' : undefined}>
                            <TableCell className="text-center">{pos}</TableCell>
                            <TableCell>
                              {sData ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center">
                                        <HardDrive className="mr-2 h-4 w-4" />
                                        <span>
                                          {sData.name}
                                          {sData.unit ? ` (${sData.unit}U)` : ''}
                                          {sData.ip ? ` – ${sData.ip}` : ''}
                                        </span>
                                        {/* 如果有 healthy 字段才渲染 */}
                                        {sData.healthy === true && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                                        {sData.healthy === false && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>ID: {entry![0]}</p>
                                      {sData.ip && <p>IP: {sData.ip}</p>}
                                      {sData.unit && <p>Units: {sData.unit}</p>}
                                      {sData.healthy !== undefined && <p>Status: {sData.healthy ? 'Healthy' : 'Broken'}</p>}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="italic text-muted-foreground">Empty</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* 管理按钮 */}
                  <div className="mt-2 flex justify-end">
                    <Link to={`/overview?dc=${selectedDC}&room=${roomId}&rack=${rack.id}`}>
                      <Button size="sm" variant="outline">
                        Manage Rack
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
