import { QueryClient } from "@tanstack/react-query";
import { getMemoryToken } from "@/context/AuthContext";

// Resolve base URL for deployed environments
const API_BASE = (import.meta as any).env?.VITE_API_BASE || 
  (typeof window !== "undefined" && (window as any).__PORT_5000__ ? (window as any).__PORT_5000__ : "");

export async function apiRequest(method: string, path: string, body?: unknown): Promise<Response> {
  const token = getMemoryToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  return fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const token = getMemoryToken();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}${queryKey[0]}`, { headers });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      },
      staleTime: 30_000,
      retry: false,
    },
  },
});
