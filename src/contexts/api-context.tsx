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

export interface ApiContextValue {
  getAllIpPools: () => Promise<IpPool[]>;
  getUsedIp: (service: string) => Promise<string[]>;
  getAllIp: (service: string) => Promise<string[]>;
  createIpPool: (data: { service: string; cidrBlock: string }) => Promise<IpPool>;
  searchServers: (keyword: string, type: string, page: number, size: number) => Promise<Server[]>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const base = import.meta.env.VITE_API_URL;

  const getAllIpPools = async () => {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/allpools`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: IpPool[] };
    return json.data;
  };

  const getUsedIp = async (service: string) => {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/usedIp?service=${encodeURIComponent(service)}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: string[] };
    return json.data;
  };

  const getAllIp = async (service: string) => {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/allIp?service=${encodeURIComponent(service)}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: string[] };
    return json.data;
  };

  const createIpPool = async (data: { service: string; cidrBlock: string }) => {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/pool`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: data.service, cidrBlock: data.cidrBlock }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: IpPool };
    return json.data;
  };

  const searchServers = async (keyword: string, type: string, page: number, size: number) => {
    const url = new URL(`${base}/api/v1/gateway/backend/server/searching`);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('type', type);
    url.searchParams.set('page', String(page));
    url.searchParams.set('size', String(size));

    const res = await fetch(url.toString(), { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: Server[] };
    return json.data;
  };

  return <ApiContext.Provider value={{ getAllIpPools, getUsedIp, getAllIp, createIpPool, searchServers }}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return ctx;
}
