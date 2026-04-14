'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import {
  Cookie,
  ShieldCheck,
  BarChart3,
  Settings,
  Ban,
  Mail,
} from 'lucide-react';

export default function CookiesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      <Header />

      <main className="container-app py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <Cookie className="h-4 w-4" />
              {t('cookies.badge')}
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
              {t('cookies.title')}
            </h1>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
              {t('cookies.last_updated')}
            </p>
            <p className="mt-4 text-surface-600 dark:text-surface-300">
              {t('cookies.intro')}
            </p>
          </div>

          {/* What are cookies */}
          <section className="mb-10">
            <SectionHeader
              icon={<Cookie className="h-5 w-5" />}
              title={t('cookies.what_title')}
              subtitle={t('cookies.what_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('cookies.what_content')}
              </p>
            </div>
          </section>

          {/* Types */}
          <section className="mb-10">
            <SectionHeader
              icon={<Settings className="h-5 w-5" />}
              title={t('cookies.types_title')}
              subtitle={t('cookies.types_subtitle')}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TypeCard
                icon={<ShieldCheck className="h-5 w-5 text-brand-500" />}
                title={t('cookies.type_essential_title')}
                content={t('cookies.type_essential_content')}
                badge={t('cookies.always_on')}
                badgeTone="success"
              />
              <TypeCard
                icon={<BarChart3 className="h-5 w-5 text-brand-500" />}
                title={t('cookies.type_analytics_title')}
                content={t('cookies.type_analytics_content')}
                badge={t('cookies.optional')}
                badgeTone="neutral"
              />
              <TypeCard
                icon={<Settings className="h-5 w-5 text-brand-500" />}
                title={t('cookies.type_prefs_title')}
                content={t('cookies.type_prefs_content')}
                badge={t('cookies.optional')}
                badgeTone="neutral"
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* How to disable */}
          <section className="mb-10">
            <SectionHeader
              icon={<Ban className="h-5 w-5" />}
              title={t('cookies.disable_title')}
              subtitle={t('cookies.disable_subtitle')}
            />
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {t('cookies.disable_content')}
                </p>
              </div>
              <ul className="space-y-2 rounded-xl border border-surface-200 bg-surface-50 p-5 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
                <li>
                  <strong>Chrome:</strong> Settings &raquo; Privacy and security &raquo; Cookies
                </li>
                <li>
                  <strong>Safari:</strong> Settings &raquo; Privacy &raquo; Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Settings &raquo; Privacy &amp; Security &raquo; Cookies
                </li>
                <li>
                  <strong>Edge:</strong> Settings &raquo; Cookies and site permissions
                </li>
              </ul>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('cookies.disable_warning')}
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <SectionHeader
              icon={<Mail className="h-5 w-5" />}
              title={t('cookies.contact_title')}
              subtitle={t('cookies.contact_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('cookies.contact_content')}
              </p>
              <a
                href="mailto:privacy@multando.com"
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                privacy@multando.com
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function TypeCard({
  icon,
  title,
  content,
  badge,
  badgeTone,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  badge: string;
  badgeTone: 'success' | 'neutral';
  className?: string;
}) {
  const toneClasses =
    badgeTone === 'success'
      ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300';
  return (
    <div
      className={`rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800 ${className ?? ''}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
        {content}
      </p>
    </div>
  );
}
