import { createContext, useContext, ReactNode } from 'react';

export interface IpPool {
  id: number;
  service: string;
  cidr: string;
  usedips: string[];
  createdat: string;
  updatedat: string;
}

export interface Server {
  id: number;
  name: string;
  service: string;
  ip: string;
  unit: number;
  fabid: number;
  roomid: number;
  rackid: number;
  ippoolid: number;
  frontposition: number;
  backposition: number;
  healthy: boolean;
  createdat: string;
  updatedat: string;
}

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
  name: string;
  service: string;
  height: number;
  serverNum: number;
  servers: Record<string, ServerPosition>;
}
interface RoomInfo {
  name: string;
  height: number;
  maxRack: number;
  rackNum: number;
  racks: Record<string, RackInfo>;
}

export interface DataCenterResponse {
  [dcId: string]: {
    name: string;
    roomNum: number;
    rooms: Record<string, RoomInfo>;
  };
}

export interface DetailedDC {
  id: number;
  name: string;
  roomNum: number;
  createdAt: string;
  updatedAt: string;
  rooms: Record<string, unknown>;
}

export interface RoomDetail {
  id: number;
  name: string;
  rackNum: number;
  hasRack?: number;
  racks: Record<string, unknown>;
}

export interface RackDetail {
  id: number;
  name: string;
  maxEmpty: number;
  height: number;
  service: string;
  serverNum: number;
  createdAt: string;
  updatedAt: string;
  servers: Record<string, unknown>;
}

export interface ApiContextValue {
  getAllIpPools(): Promise<IpPool[]>;
  getUsedIp(service: string): Promise<string[]>;
  getAllIp(service: string): Promise<string[]>;
  createIpPool(data: { service: string; cidrBlock: string }): Promise<IpPool>;

  searchServers(keyword: string, type: string, page: number, size: number): Promise<Server[]>;

  getAllDC(): Promise<DataCenterResponse>;
  getDcDetail(name: string): Promise<DetailedDC>;
  getRoomDetail(name: string, roomId: number): Promise<RoomDetail>;
  getRackDetail(fabName: string, roomId: number, rackId: number): Promise<RackDetail>;
  getServerDetail(id: number): Promise<Server>;
  getAllServers(): Promise<Server[]>;
  getAllBrokenServers(): Promise<Server[]>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const base = import.meta.env.VITE_API_URL;

  async function getAllIpPools(): Promise<IpPool[]> {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/allPools`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: IpPool[] };
    return body.data;
  }

  async function getUsedIp(service: string): Promise<string[]> {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/usedIp?service=${encodeURIComponent(service)}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: string[] };
    return body.data;
  }

  async function getAllIp(service: string): Promise<string[]> {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/allIp?service=${encodeURIComponent(service)}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: string[] };
    return body.data;
  }

  async function createIpPool(data: { service: string; cidrBlock: string }): Promise<IpPool> {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/pool`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: data.service, cidr: data.cidrBlock }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: IpPool };
    return body.data;
  }

  async function searchServers(keyword: string, type: string, page: number, size: number): Promise<Server[]> {
    const url = new URL(`${base}/api/v1/gateway/backend/server/searching`);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('type', type);
    url.searchParams.set('page', String(page));
    url.searchParams.set('size', String(size));

    const res = await fetch(url.toString(), { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: Server[] };
    return body.data;
  }

  async function getAllDC(): Promise<DataCenterResponse> {
    const res = await fetch(`${base}/api/v1/gateway/backend/allDC`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: DataCenterResponse };
    return body.data;
  }

  async function getDcDetail(name: string): Promise<DetailedDC> {
    const res = await fetch(`${base}/api/v1/gateway/backend/DC?name=${encodeURIComponent(name)}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: DetailedDC };
    return body.data;
  }

  async function getRoomDetail(name: string, roomId: number): Promise<RoomDetail> {
    const params = new URLSearchParams({ name, roomId: String(roomId) });
    const res = await fetch(`${base}/api/v1/gateway/backend/room?${params.toString()}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: RoomDetail };
    return body.data;
  }

  async function getRackDetail(fabName: string, roomId: number, rackId: number): Promise<RackDetail> {
    const params = new URLSearchParams({
      fabName,
      roomId: String(roomId),
      rackId: String(rackId),
    });
    const res = await fetch(`${base}/api/v1/gateway/backend/rack?${params.toString()}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: RackDetail };
    return body.data;
  }

  async function getServerDetail(id: number): Promise<Server> {
    const res = await fetch(`${base}/api/v1/gateway/backend/server?id=${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: Server[] };
    return body.data[0];
  }

  async function getAllServers(): Promise<Server[]> {
    const res = await fetch(`${base}/api/v1/gateway/backend/server/allServer`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: Server[] };
    return body.data;
  }

  async function getAllBrokenServers(): Promise<Server[]> {
    const res = await fetch(`${base}/api/v1/gateway/backend/server/allBrokenServer`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: Server[] };
    return body.data;
  }

  return (
    <ApiContext.Provider
      value={{
        getAllIpPools,
        getUsedIp,
        getAllIp,
        createIpPool,
        searchServers,
        getAllDC,
        getDcDetail,
        getRoomDetail,
        getRackDetail,
        getServerDetail,
        getAllServers,
        getAllBrokenServers,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within an ApiProvider');
  return ctx;
}
