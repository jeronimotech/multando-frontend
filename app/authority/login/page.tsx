"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthorityAuth } from "@/hooks/use-authority-auth";

export default function AuthorityLoginPage() {
  const [apiKey, setApiKey] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthorityAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    try {
      await login(apiKey.trim(), rememberMe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid API key. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-surface-800">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600">
              <ShieldIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Authority Portal
            </h1>
            <p className="mt-2 text-surface-600 dark:text-surface-300">
              Sign in with your API key to access the dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Key Input */}
            <div>
              <label
                htmlFor="apiKey"
                className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                API Key
              </label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="dk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-indigo-600 focus:ring-indigo-500 dark:border-surface-600"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-surface-600 dark:text-surface-300"
              >
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Help Section */}
          <div className="mt-8 rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
            <h3 className="mb-2 text-sm font-medium text-surface-900 dark:text-white">
              Need an API key?
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Contact your administrator or the Multando team to request access credentials
              for your authority.
            </p>
          </div>

          {/* Demo Credentials (for development) */}
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Demo Mode
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Use any key starting with <code className="rounded bg-amber-200 px-1 dark:bg-amber-800">dk_</code> followed by at least 20 characters to access the demo.
                </p>
                <button
                  type="button"
                  onClick={() => setApiKey("dk_live_demo1234567890abcdefgh")}
                  className="mt-2 text-sm font-medium text-amber-700 underline hover:no-underline dark:text-amber-300"
                >
                  Use demo credentials
                </button>
              </div>
            </div>
          </div>

          {/* Back to Main Site */}
          <p className="mt-8 text-center text-sm text-surface-600 dark:text-surface-400">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Back to main site
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-surface-500 dark:text-surface-400">
          Protected by Multando. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}

// Icon Components
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}
