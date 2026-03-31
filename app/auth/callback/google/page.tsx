"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { socialLogin } from "@/lib/auth";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    // Prevent double-processing in React StrictMode
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(`Google login was cancelled or failed: ${errorParam}`);
      return;
    }

    if (!code) {
      setError("No authorization code received from Google.");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback/google`;

    socialLogin("google", { code, redirect_uri: redirectUri })
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((err) => {
        const message =
          err && typeof err === "object" && "detail" in err
            ? (err as { detail: string }).detail
            : err instanceof Error
              ? err.message
              : "Google login failed. Please try again.";
        setError(message);
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-surface-800">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-danger-600 dark:text-danger-400">
              Authentication Failed
            </h2>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
              {error}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-6 inline-block rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 text-sm text-surface-600 dark:text-surface-300">
          Signing in with Google...
        </p>
      </div>
    </div>
  );
}
