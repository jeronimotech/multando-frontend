'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import {
  User,
  MapPin,
  Camera,
  Smartphone,
  Wallet,
  Target,
  Link2,
  Clock,
  ShieldCheck,
  Cookie,
  Lock,
  Baby,
  Bell,
  Mail,
  Building2,
  MessageSquare,
  Brain,
  Cloud,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Ban,
} from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      <Header />

      <main className="container-app py-12 md:py-16">
        {/* Page Header */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <ShieldCheck className="h-4 w-4" />
              {t('privacy.title')}
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
              {t('privacy.title')}
            </h1>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
              {t('privacy.last_updated')}
            </p>
            <p className="mt-4 text-surface-600 dark:text-surface-300">
              {t('privacy.intro')}
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="mb-10">
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title={t('privacy.section1_title')}
              subtitle={t('privacy.section1_subtitle')}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<User className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section1_personal_title')}
                content={t('privacy.section1_personal_content')}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section1_location_title')}
                content={t('privacy.section1_location_content')}
              />
              <InfoCard
                icon={<Camera className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section1_evidence_title')}
                content={t('privacy.section1_evidence_content')}
              />
              <InfoCard
                icon={<Smartphone className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section1_device_title')}
                content={t('privacy.section1_device_content')}
              />
              <InfoCard
                icon={<Wallet className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section1_wallet_title')}
                content={t('privacy.section1_wallet_content')}
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="mb-10">
            <SectionHeader
              icon={<Target className="h-5 w-5" />}
              title={t('privacy.section2_title')}
              subtitle={t('privacy.section2_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">
                      {t(`privacy.section2_item${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3: Blockchain Data */}
          <section className="mb-10">
            <SectionHeader
              icon={<Link2 className="h-5 w-5" />}
              title={t('privacy.section3_title')}
              subtitle={t('privacy.section3_subtitle')}
            />
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('privacy.section3_content1')}
                </p>
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {t('privacy.section3_content2')}
                </p>
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {t('privacy.section3_content3')}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Sharing */}
          <section className="mb-10">
            <SectionHeader
              icon={<Building2 className="h-5 w-5" />}
              title={t('privacy.section4_title')}
              subtitle={t('privacy.section4_subtitle')}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Building2 className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section4_authorities_title')}
                content={t('privacy.section4_authorities_content')}
              />
              <InfoCard
                icon={<MessageSquare className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section4_whatsapp_title')}
                content={t('privacy.section4_whatsapp_content')}
              />
              <InfoCard
                icon={<Brain className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section4_ai_title')}
                content={t('privacy.section4_ai_content')}
              />
              <InfoCard
                icon={<Cloud className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section4_storage_title')}
                content={t('privacy.section4_storage_content')}
              />
              <InfoCard
                icon={<FileText className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section4_captcha_title')}
                content={t('privacy.section4_captcha_content')}
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* Section 5: Data Retention */}
          <section className="mb-10">
            <SectionHeader
              icon={<Clock className="h-5 w-5" />}
              title={t('privacy.section5_title')}
              subtitle={t('privacy.section5_subtitle')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`privacy.section5_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Your Rights (ARCO) */}
          <section className="mb-10">
            <SectionHeader
              icon={<ShieldCheck className="h-5 w-5" />}
              title={t('privacy.section6_title')}
              subtitle={t('privacy.section6_subtitle')}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Eye className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section6_access')}
                content={t('privacy.section6_access_content')}
              />
              <InfoCard
                icon={<Pencil className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section6_rectification')}
                content={t('privacy.section6_rectification_content')}
              />
              <InfoCard
                icon={<Trash2 className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section6_cancellation')}
                content={t('privacy.section6_cancellation_content')}
              />
              <InfoCard
                icon={<Ban className="h-5 w-5 text-brand-500" />}
                title={t('privacy.section6_opposition')}
                content={t('privacy.section6_opposition_content')}
              />
            </div>
            <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-900/20">
              <p className="text-sm text-brand-700 dark:text-brand-300">
                {t('privacy.section6_how_to')}
              </p>
            </div>
          </section>

          {/* Section 7: Cookies */}
          <section className="mb-10">
            <SectionHeader
              icon={<Cookie className="h-5 w-5" />}
              title={t('privacy.section7_title')}
              subtitle={t('privacy.section7_subtitle')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`privacy.section7_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: Security */}
          <section className="mb-10">
            <SectionHeader
              icon={<Lock className="h-5 w-5" />}
              title={t('privacy.section8_title')}
              subtitle={t('privacy.section8_subtitle')}
            />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800"
                >
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {t(`privacy.section8_content${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Children */}
          <section className="mb-10">
            <SectionHeader
              icon={<Baby className="h-5 w-5" />}
              title={t('privacy.section9_title')}
              subtitle={t('privacy.section9_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('privacy.section9_content')}
              </p>
            </div>
          </section>

          {/* Section 10: Changes */}
          <section className="mb-10">
            <SectionHeader
              icon={<Bell className="h-5 w-5" />}
              title={t('privacy.section10_title')}
              subtitle={t('privacy.section10_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('privacy.section10_content')}
              </p>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section className="mb-10">
            <SectionHeader
              icon={<Mail className="h-5 w-5" />}
              title={t('privacy.section11_title')}
              subtitle={t('privacy.section11_subtitle')}
            />
            <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                {t('privacy.section11_content')}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {t('privacy.section11_email')}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {t('privacy.section11_address')}
                </p>
              </div>
              <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
                {t('privacy.section11_authority')}
              </p>
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

function InfoCard({
  icon,
  title,
  content,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800 ${className ?? ''}`}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
        {content}
      </p>
    </div>
  );
}
