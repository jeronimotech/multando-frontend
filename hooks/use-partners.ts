'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useDataMode } from '@/hooks/use-api-base-url';
import { USE_MOCK_DATA } from '@/lib/config';

// ---------- Types ----------

export interface Partner {
  id: number;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  tier: 'community' | 'silver' | 'gold';
  active: boolean;
}

export interface PartnerOffer {
  id: number;
  partnerId: number;
  partnerName: string;
  partnerLogo?: string;
  title: string;
  description: string;
  category: string;
  cost: number; // MULTA tokens
  remaining: number | null; // null = unlimited
  expiresAt: string | null;
  createdAt: string;
  popularity: number;
}

export interface Redemption {
  id: number;
  offerId: number;
  offerTitle: string;
  partnerName: string;
  cost: number;
  code: string;
  status: 'pending' | 'claimed' | 'expired';
  redeemedAt: string;
}

export interface PartnerApplication {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
}

export interface PartnerFilters {
  category?: string;
  tier?: string;
  page?: number;
  limit?: number;
}

export interface OfferFilters {
  category?: string;
  sort?: 'newest' | 'cheapest' | 'popular';
  page?: number;
  limit?: number;
}

// ---------- Query keys ----------

export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  list: (filters?: PartnerFilters) => [...partnerKeys.lists(), filters] as const,
  details: () => [...partnerKeys.all, 'detail'] as const,
  detail: (id: number) => [...partnerKeys.details(), id] as const,
  offers: () => [...partnerKeys.all, 'offers'] as const,
  partnerOffers: (partnerId: number) => [...partnerKeys.offers(), 'partner', partnerId] as const,
  allOffers: (filters?: OfferFilters) => [...partnerKeys.offers(), 'all', filters] as const,
  redemptions: () => [...partnerKeys.all, 'redemptions'] as const,
  myRedemptions: (page?: number) => [...partnerKeys.redemptions(), page] as const,
};

// ---------- Mock data ----------

const MOCK_PARTNERS: Partner[] = [
  { id: 1, name: 'Cafe Seguro', description: 'Artisan coffee shop supporting road safety', category: 'restaurant', tier: 'gold', active: true },
  { id: 2, name: 'FitZone Gym', description: 'Premium fitness center', category: 'gym', tier: 'silver', active: true },
  { id: 3, name: 'TechMart', description: 'Electronics and gadgets store', category: 'store', tier: 'community', active: true },
  { id: 4, name: 'Green Eats', description: 'Healthy restaurant chain', category: 'restaurant', tier: 'silver', active: true },
];

const MOCK_OFFERS: PartnerOffer[] = [
  { id: 1, partnerId: 1, partnerName: 'Cafe Seguro', title: '20% off any coffee', description: 'Enjoy a discounted coffee on us!', category: 'restaurant', cost: 50, remaining: null, expiresAt: null, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), popularity: 120 },
  { id: 2, partnerId: 2, partnerName: 'FitZone Gym', title: 'Free day pass', description: 'One full day access to all gym facilities', category: 'gym', cost: 100, remaining: 25, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), popularity: 85 },
  { id: 3, partnerId: 3, partnerName: 'TechMart', title: '10% off accessories', description: 'Discount on phone cases, chargers and more', category: 'store', cost: 30, remaining: 100, expiresAt: null, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), popularity: 200 },
  { id: 4, partnerId: 4, partnerName: 'Green Eats', title: 'Free smoothie', description: 'Any smoothie on the menu', category: 'restaurant', cost: 75, remaining: 10, expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), popularity: 60 },
  { id: 5, partnerId: 1, partnerName: 'Cafe Seguro', title: 'Buy 1 Get 1 Free', description: 'On any pastry item', category: 'restaurant', cost: 40, remaining: null, expiresAt: null, createdAt: new Date().toISOString(), popularity: 150 },
];

const MOCK_REDEMPTIONS: Redemption[] = [
  { id: 1, offerId: 1, offerTitle: '20% off any coffee', partnerName: 'Cafe Seguro', cost: 50, code: 'MULTA-CAFE-A1B2', status: 'claimed', redeemedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 2, offerId: 3, offerTitle: '10% off accessories', partnerName: 'TechMart', cost: 30, code: 'MULTA-TECH-C3D4', status: 'pending', redeemedAt: new Date(Date.now() - 86400000).toISOString() },
];

// ---------- Helper ----------

async function fetchPublic<T>(baseUrl: string, path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const error = isJson
      ? await res.json()
      : { message: res.statusText || 'An error occurred', statusCode: res.status };
    throw error;
  }
  return res.json() as Promise<T>;
}

// ---------- Hooks ----------

/**
 * Fetch list of partners with optional filters
 */
export function usePartners(filters?: PartnerFilters) {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: [...partnerKeys.list(filters), mode],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 400));
        let items = [...MOCK_PARTNERS];
        if (filters?.category) items = items.filter((p) => p.category === filters.category);
        if (filters?.tier) items = items.filter((p) => p.tier === filters.tier);
        return items;
      }
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined) params.append(k, String(v));
        });
      }
      return fetchPublic<Partner[]>(baseUrl, `/partners?${params.toString()}`);
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch a single partner by ID
 */
export function usePartner(id: number) {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: [...partnerKeys.detail(id), mode],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        const p = MOCK_PARTNERS.find((p) => p.id === id);
        if (!p) throw new Error('Partner not found');
        return p;
      }
      return fetchPublic<Partner>(baseUrl, `/partners/${id}`);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch offers for a specific partner
 */
export function usePartnerOffers(partnerId: number) {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: [...partnerKeys.partnerOffers(partnerId), mode],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        return MOCK_OFFERS.filter((o) => o.partnerId === partnerId);
      }
      return fetchPublic<PartnerOffer[]>(baseUrl, `/partners/${partnerId}/offers`);
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch all active offers across all partners
 */
export function useAllOffers(filters?: OfferFilters) {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: [...partnerKeys.allOffers(filters), mode],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 400));
        let items = [...MOCK_OFFERS];
        if (filters?.category) items = items.filter((o) => o.category === filters.category);
        if (filters?.sort === 'cheapest') items.sort((a, b) => a.cost - b.cost);
        else if (filters?.sort === 'popular') items.sort((a, b) => b.popularity - a.popularity);
        else items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return items;
      }
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined) params.append(k, String(v));
        });
      }
      return fetchPublic<PartnerOffer[]>(baseUrl, `/partners/offers?${params.toString()}`);
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Redeem an offer (mutation)
 */
export function useRedeemOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (offerId: number) => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 800));
        const code = `MULTA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        return { id: Date.now(), offerId, code, status: 'pending' as const };
      }
      return api.post<{ id: number; offerId: number; code: string; status: string }>(
        `/partners/offers/${offerId}/redeem`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.offers() });
      queryClient.invalidateQueries({ queryKey: partnerKeys.redemptions() });
    },
  });
}

/**
 * Fetch current user's redemptions
 */
export function useMyRedemptions(page?: number) {
  return useQuery({
    queryKey: partnerKeys.myRedemptions(page),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 400));
        return MOCK_REDEMPTIONS;
      }
      const params = page ? `?page=${page}` : '';
      return api.get<Redemption[]>(`/partners/my/redemptions${params}`);
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Submit a partner application (mutation)
 */
export function usePartnerApply() {
  return useMutation({
    mutationFn: async (data: PartnerApplication) => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 1000));
        return { success: true };
      }
      return api.post('/partners/apply', data);
    },
  });
}
