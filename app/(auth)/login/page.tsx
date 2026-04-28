"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-surface-800">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-brand-500">{t('common.app_name')}</h1>
            </Link>
            <p className="mt-2 text-surface-600 dark:text-surface-300">
              {t('auth.welcome_back')}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700 dark:bg-danger-950/30 dark:text-danger-400">
              {error}
            </div>
          )}

          {/* Google Sign-In — primary action */}
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => {
              // Preserve pending redirect + api_base for OAuth consent flows
              const urlParams = new URLSearchParams(window.location.search);
              const pendingRedirect = urlParams.get("redirect");
              const oauthApiBase = urlParams.get("api_base");
              if (pendingRedirect) {
                sessionStorage.setItem("multando_post_login_redirect", pendingRedirect);
              }
              if (oauthApiBase) {
                sessionStorage.setItem("multando_oauth_api_base", oauthApiBase);
              }
              const params = new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                redirect_uri: `${window.location.origin}/auth/callback/google`,
                response_type: "code",
                scope: "openid email profile",
                access_type: "offline",
                prompt: "select_account",
              });
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
            }}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t('auth.continue_with_google')}
          </Button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                {t('auth_page.or_sign_in_email')}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="ml-2 text-sm text-surface-600 dark:text-surface-300">
                  {t('auth.remember_me')}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-700"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('auth.sign_in')}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-surface-600 dark:text-surface-300">
            {t('auth.no_account')}{" "}
            <Link
              href="/register"
              className="font-medium text-brand-500 hover:text-brand-700"
            >
              {t('auth.sign_up_free')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
