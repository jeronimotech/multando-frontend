"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-surface-200 bg-white/80 backdrop-blur dark:border-surface-700 dark:bg-surface-900/80">
      <div className="mx-auto w-full max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-1.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-900 dark:bg-surface-700"><img src="/logo.png" alt="Multando" className="h-6 w-6" /></span><span className="hidden text-xl font-bold text-brand-500 sm:inline">Multando</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 lg:gap-5 md:flex">
            <Link
              href="#learn-more"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              {t('landing.how_it_works')}
            </Link>
            <Link
              href="/reports"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              {t('navigation.reports')}
            </Link>
            <Link
              href="/rewards"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              {t('wallet.rewards')}
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              {t('navigation.marketplace')}
            </Link>
            <Link
              href="/developers"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              {t('navigation.developers')}
            </Link>
            <Link
              href="/principles"
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
            >
              {t('landing.responsible_reporting')}
            </Link>
          </nav>

          {/* Desktop Auth Buttons & Language */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost">{t('auth.sign_in')}</Button>
            </Link>
            <Link href="/register">
              <Button>{t('home.cta_get_started')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden",
            isMobileMenuOpen ? "block" : "hidden"
          )}
        >
          <nav className="space-y-1 border-t border-surface-200 py-4 dark:border-surface-700">
            <Link
              href="#learn-more"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('landing.how_it_works')}
            </Link>
            <Link
              href="/reports"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.reports')}
            </Link>
            <Link
              href="/rewards"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('wallet.rewards')}
            </Link>
            <Link
              href="/marketplace"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.marketplace')}
            </Link>
            <Link
              href="/developers"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.developers')}
            </Link>
            <Link
              href="/principles"
              className="block rounded-lg px-3 py-2 text-base font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('landing.responsible_reporting')}
            </Link>
            <div className="mt-4 flex flex-col gap-2 px-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('auth.sign_in')}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">{t('home.cta_get_started')}</Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
