"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { Shield } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual registration logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-12 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-surface-800">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-brand-500">{t('common.app_name')}</h1>
            </Link>
            <p className="mt-2 text-surface-600 dark:text-surface-300">
              {t('auth.create_account_subtitle')}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('auth.first_name')}
                type="text"
                name="firstName"
                placeholder="John"
                required
                autoComplete="given-name"
              />

              <Input
                label={t('auth.last_name')}
                type="text"
                name="lastName"
                placeholder="Doe"
                required
                autoComplete="family-name"
              />
            </div>

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
              autoComplete="new-password"
              helperText={t('auth_page.password_hint')}
            />

            <Input
              label={t('auth.confirm_password')}
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-surface-600 dark:text-surface-300"
              >
                {t('auth_page.agree_terms')}{" "}
                <Link href="/terms" className="text-brand-500 hover:text-brand-700">
                  {t('auth_page.terms_of_service')}
                </Link>{" "}
                {t('auth_page.and')}{" "}
                <Link href="/privacy" className="text-brand-500 hover:text-brand-700">
                  {t('auth_page.privacy_policy')}
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('auth.create_account')}
            </Button>
          </form>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-50 px-4 py-3 dark:bg-brand-950/30">
            <Shield className="h-4 w-4 text-brand-500" />
            <p className="text-xs text-surface-600 dark:text-surface-300">
              {t('auth_page.wallet_trust_badge')}
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                {t('auth_page.or_continue_with')}
              </span>
            </div>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button">
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-surface-600 dark:text-surface-300">
            {t('auth.have_account')}{" "}
            <Link
              href="/login"
              className="font-medium text-brand-500 hover:text-brand-700"
            >
              {t('auth.sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
