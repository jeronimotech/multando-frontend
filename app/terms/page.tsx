'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import {
  FileCheck,
  UserCheck,
  KeyRound,
  AlertTriangle,
  Users,
  Coins,
  Wallet,
  Code2,
  Ban,
  Copyright,
  Shield,
  Scale,
  Power,
  Mail,
  CircleAlert,
} from 'lucide-react';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      <Header />

      <main className="container-app py-12 md:py-16">
        {/* Page Header */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <FileCheck className="h-4 w-4" />
              {t('terms.title')}
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
              {t('terms.title')}
            </h1>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
              {t('terms.last_updated')}
            </p>
            <p className="mt-4 text-surface-600 dark:text-surface-300">
              {t('terms.intro')}
            </p>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <section className="mb-10">
            <SectionHeader
              icon={<FileCheck className="h-5 w-5" />}
              title={t('terms.section1_title')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('terms.section1_content')}
              </p>
            </div>
          </section>

          {/* Section 2: Eligibility */}
          <section className="mb-10">
            <SectionHeader
              icon={<UserCheck className="h-5 w-5" />}
              title={t('terms.section2_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section2_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Account Registration */}
          <section className="mb-10">
            <SectionHeader
              icon={<KeyRound className="h-5 w-5" />}
              title={t('terms.section3_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section3_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Reporting Violations */}
          <section className="mb-10">
            <SectionHeader
              icon={<AlertTriangle className="h-5 w-5" />}
              title={t('terms.section4_title')}
            />
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {t('terms.section4_content1')}
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {t('terms.section4_content2')}
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {t('terms.section4_content3')}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  <CircleAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {t('terms.section4_content4')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Verification & Community */}
          <section className="mb-10">
            <SectionHeader
              icon={<Users className="h-5 w-5" />}
              title={t('terms.section5_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section5_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: MULTA Tokens */}
          <section className="mb-10">
            <SectionHeader
              icon={<Coins className="h-5 w-5" />}
              title={t('terms.section6_title')}
            />
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('terms.section6_content1')}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('terms.section6_content2')}
                </p>
              </div>
              {[3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section6_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Custodial Wallets */}
          <section className="mb-10">
            <SectionHeader
              icon={<Wallet className="h-5 w-5" />}
              title={t('terms.section7_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section7_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: API & SDK Usage */}
          <section className="mb-10">
            <SectionHeader
              icon={<Code2 className="h-5 w-5" />}
              title={t('terms.section8_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section8_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Prohibited Conduct */}
          <section className="mb-10">
            <SectionHeader
              icon={<Ban className="h-5 w-5" />}
              title={t('terms.section9_title')}
              subtitle={t('terms.section9_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                    <span className="text-sm text-red-800 dark:text-red-200">
                      {t(`terms.section9_item${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 10: Intellectual Property */}
          <section className="mb-10">
            <SectionHeader
              icon={<Copyright className="h-5 w-5" />}
              title={t('terms.section10_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section10_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 11: Limitation of Liability */}
          <section className="mb-10">
            <SectionHeader
              icon={<Shield className="h-5 w-5" />}
              title={t('terms.section11_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section11_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 12: Governing Law */}
          <section className="mb-10">
            <SectionHeader
              icon={<Scale className="h-5 w-5" />}
              title={t('terms.section12_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section12_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 13: Termination */}
          <section className="mb-10">
            <SectionHeader
              icon={<Power className="h-5 w-5" />}
              title={t('terms.section13_title')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`terms.section13_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 14: Contact */}
          <section className="mb-10">
            <SectionHeader
              icon={<Mail className="h-5 w-5" />}
              title={t('terms.section14_title')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('terms.section14_content')}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {t('terms.section14_email')}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {t('terms.section14_address')}
                </p>
              </div>
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
  subtitle?: string;
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
        {subtitle && (
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
