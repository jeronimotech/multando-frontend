'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Types
export interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  environment?: string;
  scopes: string[];
  rate_limit: number;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  environment: 'sandbox' | 'production';
  scopes: string[];
  rate_limit: number;
  expires_in_days: number | null;
}

export interface CreateApiKeyResponse {
  id: string;
  key: string;
  key_prefix: string;
  name: string;
  scopes: string[];
  rate_limit: number;
  created_at: string;
  expires_at: string | null;
}

export interface ApiKeysListResponse {
  items: ApiKey[];
  total: number;
}

// Query keys
export const apiKeyKeys = {
  all: ['api-keys'] as const,
  list: () => [...apiKeyKeys.all, 'list'] as const,
};

/**
 * Hook to fetch the current user's API keys (auth required)
 */
export function useApiKeys() {
  return useQuery({
    queryKey: apiKeyKeys.list(),
    queryFn: async () => {
      return api.get<ApiKeysListResponse>('/api-keys');
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApiKeyRequest) => {
      return api.post<CreateApiKeyResponse>('/api-keys', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });
}

/**
 * Hook to revoke an API key
 */
export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<{ success: boolean }>(`/api-keys/${id}?revoke_only=true`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });
}
