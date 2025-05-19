import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface ApiContextValue {
  getAllIpPools: () => Promise<any[]>;
  getUsedIp: (service: string) => Promise<any[]>;
  createIpPool: (data: { service: string; subnet: string }) => Promise<any>;
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
    return res.json();
  };

  const getUsedIp = async (service: string) => {
    const res = await fetch(
      `${base}/api/v1/gateway/backend/ip/usedIp?service=${encodeURIComponent(service)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const createIpPool = async (data: { service: string; subnet: string }) => {
    const res = await fetch(`${base}/api/v1/gateway/backend/ip/pool`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  return (
    <ApiContext.Provider value={{ getAllIpPools, getUsedIp, createIpPool }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return ctx;
}
