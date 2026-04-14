'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Target,
  Users,
  Shield,
  Sparkles,
  MapPin,
  Brain,
  Link2,
  Smartphone,
  Mail,
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-surface-200 bg-gradient-to-b from-brand-50/60 to-white py-16 dark:border-surface-700 dark:from-brand-950/20 dark:to-surface-900 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Sparkles className="h-4 w-4" />
                {t('about.badge')}
              </div>
              <h1 className="text-4xl font-bold text-surface-900 dark:text-white md:text-5xl">
                {t('about.hero_title')}
              </h1>
              <p className="mt-5 text-lg text-surface-600 dark:text-surface-300">
                {t('about.hero_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                    {t('about.mission_title')}
                  </h2>
                  <p className="mt-4 text-surface-600 dark:text-surface-300">
                    {t('about.mission_p1')}
                  </p>
                  <p className="mt-3 text-surface-600 dark:text-surface-300">
                    {t('about.mission_p2')}
                  </p>
                </div>
                <Card className="border-surface-200 dark:border-surface-700">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Stat label={t('about.stat_reports_label')} value="10K+" />
                      <Stat label={t('about.stat_cities_label')} value="25+" />
                      <Stat label={t('about.stat_rewards_label')} value="1M+" />
                      <Stat label={t('about.stat_users_label')} value="5K+" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                {t('about.story_title')}
              </h2>
              <div className="mt-6 space-y-4 text-surface-600 dark:text-surface-300">
                <p>{t('about.story_p1')}</p>
                <p>{t('about.story_p2')}</p>
                <p>{t('about.story_p3')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('about.tech_title')}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-surface-600 dark:text-surface-300">
                  {t('about.tech_subtitle')}
                </p>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <TechCard
                  icon={<Smartphone className="h-5 w-5 text-brand-500" />}
                  title={t('about.tech_mobile_title')}
                  content={t('about.tech_mobile_content')}
                />
                <TechCard
                  icon={<Brain className="h-5 w-5 text-brand-500" />}
                  title={t('about.tech_ai_title')}
                  content={t('about.tech_ai_content')}
                />
                <TechCard
                  icon={<Link2 className="h-5 w-5 text-brand-500" />}
                  title={t('about.tech_blockchain_title')}
                  content={t('about.tech_blockchain_content')}
                />
                <TechCard
                  icon={<MapPin className="h-5 w-5 text-brand-500" />}
                  title={t('about.tech_geo_title')}
                  content={t('about.tech_geo_content')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                {t('about.cta_title')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-surface-600 dark:text-surface-300">
                {t('about.cta_subtitle')}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact">
                  <Button>{t('about.cta_contact')}</Button>
                </Link>
                <Link href="/#learn-more">
                  <Button variant="outline">{t('about.cta_learn_more')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-brand-500">{value}</p>
      <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{label}</p>
    </div>
  );
}

function TechCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-800">
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
