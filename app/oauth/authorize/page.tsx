"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

interface ConsentInfo {
  app_name: string;
  app_logo_url?: string;
  scopes: string[];
  redirect_uri: string;
}

/** Map a raw scope string to its i18n key. */
const SCOPE_KEYS: Record<string, string> = {
  "reports:create": "oauth.scope_reports_create",
  "reports:read": "oauth.scope_reports_read",
  "infractions:read": "oauth.scope_infractions_read",
  "users:read": "oauth.scope_users_read",
  "balance:read": "oauth.scope_balance_read",
};

function OAuthConsentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tParams } = useTranslation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const clientId = searchParams.get("client_id") ?? "";
  const redirectUri = searchParams.get("redirect_uri") ?? "";
  const scope = searchParams.get("scope") ?? "";
  const state = searchParams.get("state") ?? "";
  const responseType = searchParams.get("response_type") ?? "code";
  // SDK passes api_base so the consent page calls the correct backend
  // (e.g. sandbox-api.multando.com/api/v1 vs api.multando.com/api/v1)
  const apiBase = searchParams.get("api_base") || "";

  const [consent, setConsent] = useState<ConsentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tokenVerified, setTokenVerified] = useState(false);
  const [targetUser, setTargetUser] = useState<{ email?: string } | null>(null);
  const verifyAttempted = useRef(false);

  // Verify auth — two paths:
  // 1. No api_base: use the global useAuth hook (checks default/production backend)
  // 2. With api_base: verify JWT directly against the target backend,
  //    completely ignoring useAuth (which would check the wrong backend)
  useEffect(() => {
    if (verifyAttempted.current) return;

    const redirectToLogin = () => {
      verifyAttempted.current = true;
      const currentParams = searchParams.toString();
      const loginParams = new URLSearchParams({
        redirect: `/oauth/authorize?${currentParams}`,
      });
      if (apiBase) loginParams.set("api_base", apiBase);
      router.replace(`/login?${loginParams.toString()}`);
    };

    if (apiBase) {
      // Custom backend — read JWT from localStorage (isolated from useAuth)
      const token = localStorage.getItem("multando_oauth_jwt");
      if (!token) {
        redirectToLogin();
        return;
      }
      fetch(`${apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (r) => {
          if (r.ok) {
            const userData = await r.json();
            setTargetUser(userData);
            setTokenVerified(true);
          } else {
            localStorage.removeItem("multando_oauth_jwt");
            redirectToLogin();
          }
        })
        .catch(() => redirectToLogin());
    } else {
      // Default backend — use useAuth
      if (authLoading) return;
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }
      setTokenVerified(true);
    }
  }, [authLoading, isAuthenticated, router, searchParams, apiBase]);

  // Fetch consent info
  useEffect(() => {
    if (!tokenVerified || !clientId) return;

    const fetchConsent = async () => {
      try {
        const url = `${apiBase || ""}/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        const data = apiBase
          ? await fetch(url, { headers: { "Content-Type": "application/json" } }).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
          : await api.get<ConsentInfo>(url);
        setConsent(data);
      } catch {
        setError("Unable to load authorization details. The application may be misconfigured.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsent();
  }, [tokenVerified, clientId, redirectUri, scope, apiBase]);

  const handleAuthorize = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Backend expects query params, not JSON body
      const queryParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        ...(state ? { state } : {}),
      });
      const postUrl = apiBase
        ? `${apiBase}/oauth/authorize?${queryParams}`
        : `/oauth/authorize?${queryParams}`;

      // Get JWT — from sessionStorage for cross-backend, cookie/localStorage otherwise
      let token: string | undefined;
      if (apiBase) {
        token = localStorage.getItem("multando_oauth_jwt") || undefined;
      } else {
        if (typeof document !== "undefined") {
          const match = document.cookie.match(/multando_token=([^;]+)/);
          if (match) token = decodeURIComponent(match[1]);
        }
        if (!token && typeof localStorage !== "undefined") {
          token = localStorage.getItem("token") || undefined;
        }
      }

      const result = apiBase
        ? await fetch(postUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }).then(async (r) => {
            if (!r.ok) {
              const errBody = await r.text().catch(() => "");
              console.error("OAuth authorize POST failed:", r.status, errBody);
              throw new Error(`${r.status}: ${errBody}`);
            }
            return r.json();
          })
        : await api.post<{ redirect_url: string }>(postUrl);
      window.location.href = result.redirect_url;
    } catch (err) {
      console.error("Authorization error:", err);
      setError("Authorization failed. Please try again.");
      setSubmitting(false);
    }
  }, [clientId, redirectUri, scope, state, responseType]);

  const handleCancel = useCallback(() => {
    if (redirectUri) {
      const separator = redirectUri.includes("?") ? "&" : "?";
      window.location.href = `${redirectUri}${separator}error=access_denied&state=${encodeURIComponent(state)}`;
    } else {
      router.back();
    }
  }, [redirectUri, state, router]);

  // Show loading spinner only while verifying auth.
  // When apiBase is set, we don't depend on useAuth at all.
  if (!apiBase && (authLoading || (!isAuthenticated && !error))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // For cross-backend flows, show spinner until token is verified
  if (apiBase && !tokenVerified && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const scopes = scope.split(",").filter(Boolean);
  const appName = consent?.app_name ?? clientId;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-surface-800">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/30">
              <svg
                className="h-7 w-7 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-brand-500">Multando</h1>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700 dark:bg-danger-950/30 dark:text-danger-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : consent ? (
            <>
              {/* App info */}
              <div className="mb-6 text-center">
                {consent.app_logo_url && (
                  <img
                    src={consent.app_logo_url}
                    alt={appName}
                    className="mx-auto mb-3 h-12 w-12 rounded-lg"
                  />
                )}
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  <span className="font-bold">{appName}</span>{" "}
                  {t("oauth.consent_title")}
                </h2>
              </div>

              {/* Scopes */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-surface-600 dark:text-surface-300">
                  {tParams("oauth.consent_allow", { app: appName })}
                </p>
                <ul className="space-y-2">
                  {scopes.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200"
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-success-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {SCOPE_KEYS[s] ? t(SCOPE_KEYS[s]) : s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-700"
                >
                  {t("oauth.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleAuthorize}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {t("oauth.authorize")}
                    </span>
                  ) : (
                    t("oauth.authorize")
                  )}
                </button>
              </div>

              {/* Logged-in-as footer */}
              {user && (
                <p className="mt-6 text-center text-xs text-surface-400 dark:text-surface-500">
                  {t("oauth.logged_in_as")} {targetUser?.email || user?.email || ""}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function OAuthAuthorizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <OAuthConsentForm />
    </Suspense>
  );
}
