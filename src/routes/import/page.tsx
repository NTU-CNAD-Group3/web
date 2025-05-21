'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/expand-search-ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/expand-search-ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/contexts/api-context';
import { CSVImporter } from '@/components/csv-importer';
import { CSVFormatGuide } from '@/components/csv-format-guide';
import { ImportResults } from '@/components/import-results';
import { Info } from 'lucide-react';

// 定義 import 結果的型態
type ImportResultsType = {
  total: number;
  successful: number;
  failed: number;
  details: { item: Record<string, string>; success: boolean; message: string }[];
} | null;

export default function ImportPage() {
  const { createDC, createRooms, createRacks, createServer, getAllDC } = useApi();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('datacenters');
  const [importResults, setImportResults] = useState<ImportResultsType>(null);
  const [isImporting, setIsImporting] = useState(false);

  // --- Datacenters ---
  const handleDatacenterImport = async (rows: Record<string, string>[]) => {
    setIsImporting(true);
    const results: NonNullable<ImportResultsType> = { total: rows.length, successful: 0, failed: 0, details: [] };
    for (const item of rows) {
      try {
        if (!item.name) throw new Error('Datacenter name is required');
        await createDC(item.name);
        results.successful++;
        results.details.push({ item, success: true, message: '' });
      } catch (err) {
        results.failed++;
        results.details.push({ item, success: false, message: (err as Error).message });
      }
    }
    setImportResults(results);
    toast({
      title: 'Import completed',
      description: `Datacenters: ${results.successful}/${results.total}`,
      variant: results.failed > 0 ? 'destructive' : 'default',
    });
    setIsImporting(false);
  };

  // --- Rooms ---
  const handleRoomImport = async (rows: Record<string, string>[]) => {
    setIsImporting(true);
    const byDC: Record<string, { name: string; rackNum: number; height: number }[]> = {};
    for (const r of rows) {
      if (!r.datacenter || !r.name || !r.rackNum || !r.height) throw new Error('Missing datacenter/name/rackNum/height');
      byDC[r.datacenter] ??= [];
      byDC[r.datacenter].push({ name: r.name, rackNum: Number(r.rackNum), height: Number(r.height) });
    }
    const keys = Object.keys(byDC);
    const results: NonNullable<ImportResultsType> = { total: keys.length, successful: 0, failed: 0, details: [] };
    for (const fabName of keys) {
      try {
        const arr = byDC[fabName];
        await createRooms(fabName, arr.length, arr);
        results.successful++;
        results.details.push({ item: { datacenter: fabName, count: String(arr.length) }, success: true, message: '' });
      } catch (err) {
        results.failed++;
        results.details.push({ item: { datacenter: fabName }, success: false, message: (err as Error).message });
      }
    }
    setImportResults(results);
    toast({
      title: 'Import completed',
      description: `Rooms: ${results.successful}/${results.total}`,
      variant: results.failed > 0 ? 'destructive' : 'default',
    });
    setIsImporting(false);
  };

  // --- Racks ---
  const handleRackImport = async (rows: Record<string, string>[]) => {
    setIsImporting(true);
    const allDCs = await getAllDC();
    const roomKeyToNum: Record<string, number> = {};
    for (const dc of Object.values(allDCs)) {
      const fabName = dc.name;
      for (const [roomKey, room] of Object.entries(dc.rooms)) {
        const num = parseInt(roomKey.replace(/\D+/g, ''), 10);
        roomKeyToNum[`${fabName}:${(room as { name: string }).name}`] = num;
      }
    }

    const byRoom: Record<string, { fabName: string; roomNum: number; racks: { name: string; service: string; height: number }[] }> = {};
    for (const r of rows) {
      if (!r.datacenter || !r.room || !r.name || !r.service || !r.height) throw new Error('Missing datacenter/room/name/service/height');
      const key = `${r.datacenter}:${r.room}`;
      byRoom[key] ??= { fabName: r.datacenter, roomNum: roomKeyToNum[key], racks: [] };
      byRoom[key].racks.push({ name: r.name, service: r.service, height: Number(r.height) });
    }

    const keys = Object.keys(byRoom);
    const results: NonNullable<ImportResultsType> = { total: keys.length, successful: 0, failed: 0, details: [] };
    for (const key of keys) {
      const { fabName, roomNum, racks } = byRoom[key];
      try {
        await createRacks(fabName, roomNum, racks.length, racks);
        results.successful++;
        results.details.push({ item: { datacenter: fabName, room: String(racks.length) }, success: true, message: '' });
      } catch (err) {
        results.failed++;
        results.details.push({ item: { datacenter: fabName, room: String(roomNum) }, success: false, message: (err as Error).message });
      }
    }
    setImportResults(results);
    toast({
      title: 'Import completed',
      description: `Racks: ${results.successful}/${results.total}`,
      variant: results.failed > 0 ? 'destructive' : 'default',
    });
    setIsImporting(false);
  };

  // --- Servers ---
  const handleServerImport = async (rows: Record<string, string>[]) => {
    setIsImporting(true);
    const allDCs = await getAllDC();
    const dcNameToId: Record<string, number> = {};
    const roomKeyToNum: Record<string, number> = {};
    const rackKeyToNum: Record<string, number> = {};

    for (const [dcKey, dc] of Object.entries(allDCs)) {
      const dcNum = parseInt(dcKey.replace(/\D+/g, ''), 10);
      dcNameToId[dc.name] = dcNum;

      for (const [roomKey, room] of Object.entries(dc.rooms)) {
        const roomNum = parseInt(roomKey.replace(/\D+/g, ''), 10);
        roomKeyToNum[`${dc.name}:${(room as { name: string }).name}`] = roomNum;

        for (const [rackKey, rack] of Object.entries((room as { racks: Record<string, { name: string }> }).racks)) {
          const rackNum = parseInt(rackKey.replace(/\D+/g, ''), 10);
          rackKeyToNum[`${dc.name}:${(room as { name: string }).name}:${(rack as { name: string }).name}`] = rackNum;
        }
      }
    }

    const results: NonNullable<ImportResultsType> = { total: rows.length, successful: 0, failed: 0, details: [] };
    for (const r of rows) {
      try {
        if (!dcNameToId[r.datacenter]) throw new Error(`Datacenter '${r.datacenter}' not found`);

        if (!roomKeyToNum[`${r.datacenter}:${r.room}`]) {
          await createRooms(r.datacenter, 1, [{ name: r.room, rackNum: 0, height: 0 }]);
          const updatedDC = await getAllDC();
          for (const dc of Object.values(updatedDC)) {
            if (dc.name === r.datacenter) {
              for (const [roomKey, room] of Object.entries(dc.rooms)) {
                if ((room as { name: string }).name === r.room) {
                  roomKeyToNum[`${r.datacenter}:${r.room}`] = parseInt(roomKey.replace(/\D+/g, ''), 10);
                  break;
                }
              }
            }
          }
          if (!roomKeyToNum[`${r.datacenter}:${r.room}`])
            throw new Error(`Room '${r.room}' creation failed in datacenter '${r.datacenter}'`);
        }

        if (!rackKeyToNum[`${r.datacenter}:${r.room}:${r.rack}`])
          throw new Error(`Rack '${r.rack}' not found in room '${r.room}' of datacenter '${r.datacenter}'`);

        if (
          !r.datacenter ||
          !r.room ||
          !r.rack ||
          !r.name ||
          !r.service ||
          r.unit == null ||
          r.frontPosition == null ||
          r.backPosition == null
        ) {
          throw new Error('Missing required fields');
        }

        const payload = {
          name: r.name,
          service: r.service,
          unit: Number(r.unit),
          fabId: dcNameToId[r.datacenter],
          roomId: roomKeyToNum[`${r.datacenter}:${r.room}`],
          rackId: rackKeyToNum[`${r.datacenter}:${r.room}:${r.rack}`],
          frontPosition: Number(r.frontPosition),
          backPosition: Number(r.backPosition),
        };

        await createServer(payload);
        results.successful++;
        results.details.push({ item: r, success: true, message: '' });
      } catch (err) {
        results.failed++;
        results.details.push({ item: r, success: false, message: (err as Error).message });
      }
    }

    setImportResults(results);
    toast({
      title: 'Import completed',
      description: `Servers: ${results.successful}/${results.total}`,
      variant: results.failed > 0 ? 'destructive' : 'default',
    });
    setIsImporting(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
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
        <h2 className="text-3xl font-bold tracking-tight">Batch Import</h2>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Batch Import Feature</AlertTitle>
          <AlertDescription>Import datacenters, rooms, racks, or servers via CSV.</AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="datacenters">Datacenters</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="racks">Racks</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
          </TabsList>

          <TabsContent value="datacenters">
            <Card>
              <CardHeader>
                <CardTitle>Import Datacenters</CardTitle>
                <CardDescription>CSV columns: name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CSVFormatGuide
                  headers={['name']}
                  example={[{ name: 'DC-1' }, { name: 'DC-2' }]}
                  description="Each row represents a datacenter. The 'name' field is required."
                />
                <CSVImporter onImport={handleDatacenterImport} isLoading={isImporting} requiredHeaders={['name']} />
                {importResults && <ImportResults results={importResults} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Import Rooms</CardTitle>
                <CardDescription>CSV: datacenter, name, rackNum, height</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CSVFormatGuide
                  headers={['datacenter', 'name', 'rackNum', 'height']}
                  example={[{ datacenter: 'DC-1', name: 'Room1', rackNum: '5', height: '20' }]}
                  description="Each row represents a room. The datacenter must already exist in the system."
                />
                <CSVImporter
                  onImport={handleRoomImport}
                  isLoading={isImporting}
                  requiredHeaders={['datacenter', 'name', 'rackNum', 'height']}
                />
                {importResults && <ImportResults results={importResults} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="racks">
            <Card>
              <CardHeader>
                <CardTitle>Import Racks</CardTitle>
                <CardDescription>CSV: datacenter, room, name, service, height</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CSVFormatGuide
                  headers={['datacenter', 'room', 'name', 'service', 'height']}
                  example={[{ datacenter: 'DC-1', room: 'Room1', name: 'Rack1', service: 'web', height: '20' }]}
                  description="Each row represents a rack. The datacenter and room must already exist in the system."
                />
                <CSVImporter
                  onImport={handleRackImport}
                  isLoading={isImporting}
                  requiredHeaders={['datacenter', 'room', 'name', 'service', 'height']}
                />
                {importResults && <ImportResults results={importResults} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <CardTitle>Import Servers</CardTitle>
                <CardDescription>CSV: datacenter, room, rack, name, service, unit, frontPosition, backPosition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CSVFormatGuide
                  headers={['datacenter', 'room', 'rack', 'name', 'service', 'unit', 'frontPosition', 'backPosition']}
                  example={[
                    {
                      datacenter: 'DC-1',
                      room: 'Room1',
                      rack: 'Rack1',
                      name: 'Srv1',
                      service: 'web',
                      unit: '2',
                      frontPosition: '0',
                      backPosition: '1',
                    },
                  ]}
                  description="Each row represents a server. The datacenter, room, and rack must already exist in the system."
                />
                <CSVImporter
                  onImport={handleServerImport}
                  isLoading={isImporting}
                  requiredHeaders={['datacenter', 'room', 'rack', 'name', 'service', 'unit', 'frontPosition', 'backPosition']}
                />
                {importResults && <ImportResults results={importResults} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
