"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import {
  useTwitterHashtags,
  useCreateHashtag,
  useUpdateHashtag,
  useDeleteHashtag,
  useRunHashtagNow,
  useTwitterScrapeRuns,
  useTwitterTweets,
  useCreateReportFromTweet,
  useDismissTweet,
  type TwitterHashtag,
  type TwitterScrapedTweet,
} from "@/hooks/use-twitter-hashtags";
import { Trash2, Play, Plus, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

type Tab = "hashtags" | "tweets" | "runs";

export default function TwitterAdminPage() {
  const [tab, setTab] = useState<Tab>("hashtags");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Twitter / X Hashtag Scraping
        </h1>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          Configure hashtags to scrape via Apify. Each hashtag is polled on the
          schedule defined by <code className="rounded bg-surface-100 px-1 py-0.5 text-xs dark:bg-surface-800">APIFY_SCRAPE_INTERVAL_HOURS</code>.
          Tweets above the confidence threshold auto-create pending reports;
          lower-confidence tweets land in the triage queue.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700">
        <nav className="-mb-px flex gap-6">
          {(
            [
              { id: "hashtags", label: "Hashtags" },
              { id: "tweets", label: "Triage queue" },
              { id: "runs", label: "Recent runs" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "border-b-2 px-1 pb-3 pt-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === "hashtags" && <HashtagsTab />}
      {tab === "tweets" && <TweetsTab />}
      {tab === "runs" && <RunsTab />}
    </div>
  );
}

function HashtagsTab() {
  const { data: hashtags, isLoading } = useTwitterHashtags();
  const create = useCreateHashtag();
  const update = useUpdateHashtag();
  const remove = useDeleteHashtag();
  const runNow = useRunHashtagNow();

  const [newHashtag, setNewHashtag] = useState("");

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cleaned = newHashtag.trim().replace(/^#/, "").toLowerCase();
      if (!cleaned) return;
      try {
        await create.mutateAsync({ hashtag: cleaned, enabled: true });
        setNewHashtag("");
      } catch (err) {
        console.error("Failed to add hashtag:", err);
      }
    },
    [create, newHashtag]
  );

  return (
    <div className="space-y-6">
      {/* Add form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a hashtag</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-2">
            <div className="flex flex-1 items-center gap-1">
              <span className="text-surface-500 dark:text-surface-400">#</span>
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="InfraccionBogota"
                className="flex-1"
              />
            </div>
            <Button type="submit" disabled={create.isPending || !newHashtag.trim()}>
              <Plus className="mr-1.5 h-4 w-4" />
              {create.isPending ? "Adding…" : "Add"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
            Lowercase, no spaces. The hash symbol is added automatically.
          </p>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configured hashtags</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading…</p>
          )}
          {!isLoading && (!hashtags || hashtags.length === 0) && (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No hashtags configured yet.
            </p>
          )}
          {!isLoading && hashtags && hashtags.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-xs uppercase text-surface-500 dark:border-surface-700 dark:text-surface-400">
                    <th className="pb-2 pr-4">Hashtag</th>
                    <th className="pb-2 pr-4">Enabled</th>
                    <th className="pb-2 pr-4">Last run</th>
                    <th className="pb-2 pr-4 text-right">Tweets</th>
                    <th className="pb-2 pr-4 text-right">Reports</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hashtags.map((h: TwitterHashtag) => (
                    <tr
                      key={h.id}
                      className="border-b border-surface-100 last:border-b-0 dark:border-surface-800"
                    >
                      <td className="py-3 pr-4 font-mono text-surface-900 dark:text-white">
                        #{h.hashtag}
                      </td>
                      <td className="py-3 pr-4">
                        <label className="inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={h.enabled}
                            onChange={(e) =>
                              update.mutate({ id: h.id, enabled: e.target.checked })
                            }
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "relative inline-block h-5 w-9 rounded-full transition-colors",
                              h.enabled
                                ? "bg-brand-500"
                                : "bg-surface-300 dark:bg-surface-600"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                                h.enabled ? "translate-x-4" : "translate-x-0.5"
                              )}
                            />
                          </span>
                        </label>
                      </td>
                      <td className="py-3 pr-4 text-surface-500 dark:text-surface-400">
                        {h.last_run_at ? formatDate(h.last_run_at) : "Never"}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {h.total_tweets_fetched}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {h.total_reports_created}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runNow.mutate(h.id)}
                            disabled={runNow.isPending}
                            title="Run scrape now"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete hashtag #${h.hashtag}?`)) {
                                remove.mutate(h.id);
                              }
                            }}
                            disabled={remove.isPending}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-danger-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TweetsTab() {
  const [status, setStatus] = useState<string>("low_confidence");
  const { data: tweets, isLoading } = useTwitterTweets(status, 50);
  const createReport = useCreateReportFromTweet();
  const dismiss = useDismissTweet();

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-surface-600 dark:text-surface-300">
          Filter by status:
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm dark:border-surface-700 dark:bg-surface-800"
        >
          <option value="low_confidence">Low confidence (needs review)</option>
          <option value="pending">Pending extraction</option>
          <option value="extracted">Extracted (no report)</option>
          <option value="report_created">Report created</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {isLoading && (
        <p className="text-sm text-surface-500 dark:text-surface-400">Loading…</p>
      )}
      {!isLoading && (!tweets || tweets.length === 0) && (
        <p className="text-sm text-surface-500 dark:text-surface-400">
          No tweets in this status.
        </p>
      )}

      <div className="grid gap-4">
        {tweets?.map((tweet: TwitterScrapedTweet) => (
          <Card key={tweet.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-surface-900 dark:text-white">
                      @{tweet.author_handle}
                    </span>
                    <span className="text-surface-400">·</span>
                    <span className="text-surface-500 dark:text-surface-400">
                      {formatDate(tweet.posted_at)}
                    </span>
                    <a
                      href={tweet.tweet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:text-brand-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-surface-700 dark:text-surface-200">
                    {tweet.tweet_text}
                  </p>
                </div>
                {tweet.confidence !== null && (
                  <ConfidenceBadge value={tweet.confidence} />
                )}
              </div>

              {tweet.media_urls && tweet.media_urls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {tweet.media_urls.slice(0, 4).map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}

              {tweet.extracted_data && (
                <div className="rounded-md bg-surface-50 p-3 text-xs dark:bg-surface-900">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                    {tweet.extracted_data.plate && (
                      <div>
                        <span className="text-surface-500 dark:text-surface-400">Plate: </span>
                        <span className="font-mono text-surface-900 dark:text-white">
                          {tweet.extracted_data.plate}
                        </span>
                      </div>
                    )}
                    {tweet.extracted_data.infraction_code && (
                      <div>
                        <span className="text-surface-500 dark:text-surface-400">Code: </span>
                        <span className="text-surface-900 dark:text-white">
                          {tweet.extracted_data.infraction_code}
                        </span>
                      </div>
                    )}
                    {tweet.extracted_data.location_text && (
                      <div className="sm:col-span-2">
                        <span className="text-surface-500 dark:text-surface-400">Location: </span>
                        <span className="text-surface-900 dark:text-white">
                          {tweet.extracted_data.location_text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(tweet.status === "low_confidence" || tweet.status === "extracted") && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => createReport.mutate(tweet.id)}
                    disabled={createReport.isPending}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Create report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dismiss.mutate(tweet.id)}
                    disabled={dismiss.isPending}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    Dismiss
                  </Button>
                </div>
              )}

              {tweet.status === "report_created" && tweet.report_id && (
                <a
                  href={`/authority/reports?id=${tweet.report_id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600"
                >
                  View created report
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RunsTab() {
  const { data: runs, isLoading } = useTwitterScrapeRuns(50);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent scrape runs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-surface-500 dark:text-surface-400">Loading…</p>
        )}
        {!isLoading && (!runs || runs.length === 0) && (
          <p className="text-sm text-surface-500 dark:text-surface-400">
            No runs yet. Add a hashtag and click <em>Run now</em> to start.
          </p>
        )}
        {!isLoading && runs && runs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left text-xs uppercase text-surface-500 dark:border-surface-700 dark:text-surface-400">
                  <th className="pb-2 pr-4">Hashtag</th>
                  <th className="pb-2 pr-4">Started</th>
                  <th className="pb-2 pr-4">Duration</th>
                  <th className="pb-2 pr-4 text-right">Tweets</th>
                  <th className="pb-2 pr-4 text-right">Reports</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-surface-100 last:border-b-0 dark:border-surface-800"
                  >
                    <td className="py-2.5 pr-4 font-mono text-xs text-surface-900 dark:text-white">
                      #{r.hashtag}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-surface-500 dark:text-surface-400">
                      {formatDate(r.started_at)}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-surface-500 dark:text-surface-400">
                      {r.ended_at
                        ? `${Math.round(
                            (new Date(r.ended_at).getTime() -
                              new Date(r.started_at).getTime()) /
                              1000
                          )}s`
                        : "Running…"}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {r.tweets_fetched}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {r.reports_created}
                    </td>
                    <td className="py-2.5">
                      {r.error_message ? (
                        <span className="rounded-full bg-danger-100 px-2 py-0.5 text-xs text-danger-700 dark:bg-danger-900/30 dark:text-danger-300">
                          Failed
                        </span>
                      ) : !r.ended_at ? (
                        <span className="rounded-full bg-info-100 px-2 py-0.5 text-xs text-info-700 dark:bg-info-900/30 dark:text-info-300">
                          Running
                        </span>
                      ) : (
                        <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs text-success-700 dark:bg-success-900/30 dark:text-success-300">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const cls =
    value >= 0.8
      ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300"
      : value >= 0.5
        ? "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300"
        : "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300";
  return (
    <span
      className={cn(
        "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        cls
      )}
    >
      {pct}% confidence
    </span>
  );
}
