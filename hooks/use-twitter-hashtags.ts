"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";

export interface TwitterHashtag {
  id: string;
  hashtag: string;
  jurisdiction_id: string | null;
  enabled: boolean;
  last_run_at: string | null;
  last_tweet_id: string | null;
  total_tweets_fetched: number;
  total_reports_created: number;
  created_at: string;
  updated_at: string;
}

export interface TwitterScrapeRun {
  id: string;
  hashtag_id: string;
  hashtag: string; // joined for display
  started_at: string;
  ended_at: string | null;
  tweets_fetched: number;
  reports_created: number;
  error_message: string | null;
  apify_run_id: string | null;
}

export interface TwitterScrapedTweet {
  id: string;
  tweet_id: string;
  hashtag_id: string;
  author_handle: string;
  tweet_text: string;
  tweet_url: string;
  media_urls: string[];
  posted_at: string;
  confidence: number | null;
  extracted_data: {
    plate?: string;
    infraction_code?: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  report_id: string | null;
  status: "pending" | "extracted" | "report_created" | "dismissed" | "low_confidence";
  error_message: string | null;
  created_at: string;
}

export interface CreateHashtagInput {
  hashtag: string;
  jurisdiction_id?: string | null;
  enabled?: boolean;
}

export interface UpdateHashtagInput {
  enabled?: boolean;
  jurisdiction_id?: string | null;
}

export const twitterKeys = {
  all: ["twitter"] as const,
  hashtags: () => [...twitterKeys.all, "hashtags"] as const,
  runs: (limit: number) => [...twitterKeys.all, "runs", limit] as const,
  tweets: (status: string, limit: number) => [...twitterKeys.all, "tweets", status, limit] as const,
};

export function useTwitterHashtags() {
  return useQuery({
    queryKey: twitterKeys.hashtags(),
    queryFn: () => apiGet<TwitterHashtag[]>("/admin/twitter/hashtags"),
  });
}

export function useCreateHashtag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHashtagInput) =>
      apiPost<TwitterHashtag>("/admin/twitter/hashtags", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.hashtags() });
    },
  });
}

export function useUpdateHashtag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateHashtagInput & { id: string }) =>
      apiPut<TwitterHashtag>(`/admin/twitter/hashtags/${id}`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.hashtags() });
    },
  });
}

export function useDeleteHashtag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ ok: true }>(`/admin/twitter/hashtags/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.hashtags() });
    },
  });
}

export function useRunHashtagNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<{ task_id: string }>(`/admin/twitter/hashtags/${id}/run-now`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.hashtags() });
      qc.invalidateQueries({ queryKey: twitterKeys.all });
    },
  });
}

export function useTwitterScrapeRuns(limit = 20) {
  return useQuery({
    queryKey: twitterKeys.runs(limit),
    queryFn: () => apiGet<TwitterScrapeRun[]>(`/admin/twitter/runs?limit=${limit}`),
  });
}

export function useTwitterTweets(status = "pending", limit = 20) {
  return useQuery({
    queryKey: twitterKeys.tweets(status, limit),
    queryFn: () =>
      apiGet<TwitterScrapedTweet[]>(`/admin/twitter/tweets?status=${status}&limit=${limit}`),
  });
}

export function useCreateReportFromTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tweetId: string) =>
      apiPost<{ report_id: string }>(`/admin/twitter/tweets/${tweetId}/create-report`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.all });
    },
  });
}

export function useDismissTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tweetId: string) =>
      apiPost<{ ok: true }>(`/admin/twitter/tweets/${tweetId}/dismiss`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: twitterKeys.all });
    },
  });
}
