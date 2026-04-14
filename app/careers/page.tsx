'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail, Rocket, Users, Heart, Globe } from 'lucide-react';

export default function CareersPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30">
                <Rocket className="h-10 w-10 text-brand-500" />
              </div>
              <h1 className="text-4xl font-bold text-surface-900 dark:text-white md:text-5xl">
                {t('careers.title')}
              </h1>
              <p className="mx-auto mt-5 text-lg text-surface-600 dark:text-surface-300">
                {t('careers.subtitle')}
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <Card className="border-surface-200 dark:border-surface-700">
                <CardContent className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                    {t('careers.no_positions_title')}
                  </h2>
                  <p className="mt-3 text-surface-600 dark:text-surface-300">
                    {t('careers.no_positions_desc')}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3 dark:border-brand-800 dark:bg-brand-950/20">
                    <Mail className="h-5 w-5 text-brand-500" />
                    <a
                      href="mailto:jobs@multando.com"
                      className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      jobs@multando.com
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-surface-500 dark:text-surface-400">
                    {t('careers.email_notice')}
                  </p>
                </CardContent>
              </Card>

              {/* Values */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <ValueCard
                  icon={<Users className="h-5 w-5 text-brand-500" />}
                  title={t('careers.value_impact_title')}
                  content={t('careers.value_impact_content')}
                />
                <ValueCard
                  icon={<Heart className="h-5 w-5 text-brand-500" />}
                  title={t('careers.value_care_title')}
                  content={t('careers.value_care_content')}
                />
                <ValueCard
                  icon={<Globe className="h-5 w-5 text-brand-500" />}
                  title={t('careers.value_remote_title')}
                  content={t('careers.value_remote_content')}
                />
              </div>

              <div className="mt-10 text-center">
                <Link href="/">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t('careers.back_home')}
                  </Button>
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

function ValueCard({
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
