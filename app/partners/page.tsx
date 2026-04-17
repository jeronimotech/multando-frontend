'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import {
  Store,
  ArrowRight,
  TrendingUp,
  Eye,
  BarChart3,
  Heart,
  ShoppingBag,
  Coffee,
  Dumbbell,
  Fuel,
  Briefcase,
  Shirt,
  Sparkles,
  Check,
} from 'lucide-react';

const CATEGORIES = [
  { icon: Coffee, key: 'Restaurant' },
  { icon: ShoppingBag, key: 'Retail' },
  { icon: Dumbbell, key: 'Gym & Fitness' },
  { icon: Fuel, key: 'Gas Station' },
  { icon: Briefcase, key: 'Services' },
  { icon: Shirt, key: 'Fashion' },
];

export default function PartnersPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-surface-200 bg-gradient-to-b from-brand-50/70 via-white to-white py-16 dark:border-surface-700 dark:from-brand-950/30 dark:via-surface-900 dark:to-surface-900 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/10"
          />
          <div className="container-app relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Store className="h-4 w-4" />
                {t('partners.hero_badge')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white md:text-5xl">
                {t('partners.hero_title')}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-surface-600 dark:text-surface-300">
                {t('partners.hero_subtitle')}
              </p>
              <div className="mt-8">
                <Link href="/partners/apply">
                  <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t('partners.apply_cta')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('partners.tiers_title')}
              </h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
              {/* Community */}
              <TierCard
                name={t('partners.tier_community')}
                price={t('partners.tier_community_price')}
                desc={t('partners.tier_community_desc')}
                features={['1 active offer', 'Basic listing', 'Standard support']}
              />
              {/* Silver */}
              <TierCard
                name={t('partners.tier_silver')}
                price={t('partners.tier_silver_price')}
                desc={t('partners.tier_silver_desc')}
                features={['5 active offers', 'Featured placement', 'Analytics dashboard', 'Priority support']}
              />
              {/* Gold */}
              <TierCard
                name={t('partners.tier_gold')}
                price={t('partners.tier_gold_price')}
                desc={t('partners.tier_gold_desc')}
                features={['Unlimited offers', 'Top placement', 'Co-branded campaigns', 'Dedicated manager', 'Custom analytics']}
                highlighted
              />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('partners.benefits_title')}
              </h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
              <BenefitCard
                icon={<TrendingUp className="h-5 w-5" />}
                title={t('partners.benefit_traffic_title')}
                desc={t('partners.benefit_traffic_desc')}
              />
              <BenefitCard
                icon={<Eye className="h-5 w-5" />}
                title={t('partners.benefit_visibility_title')}
                desc={t('partners.benefit_visibility_desc')}
              />
              <BenefitCard
                icon={<BarChart3 className="h-5 w-5" />}
                title={t('partners.benefit_analytics_title')}
                desc={t('partners.benefit_analytics_desc')}
              />
              <BenefitCard
                icon={<Heart className="h-5 w-5" />}
                title={t('partners.benefit_community_title')}
                desc={t('partners.benefit_community_desc')}
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('partners.how_title')}
              </h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              <HowStep step={1} title={t('partners.how_step1_title')} desc={t('partners.how_step1_desc')} />
              <HowStep step={2} title={t('partners.how_step2_title')} desc={t('partners.how_step2_desc')} />
              <HowStep step={3} title={t('partners.how_step3_title')} desc={t('partners.how_step3_desc')} />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('partners.categories_title')}
              </h2>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.key}
                    className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-surface-900 dark:text-white">
                      {cat.key}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-16">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-16 shadow-xl sm:px-16">
              <div className="relative mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t('partners.apply_form_title')}
                </h2>
                <p className="mt-4 text-lg text-brand-100">
                  {t('partners.hero_subtitle')}
                </p>
                <div className="mt-8">
                  <Link href="/partners/apply">
                    <Button
                      size="lg"
                      className="bg-white text-brand-500 hover:bg-brand-50"
                    >
                      {t('partners.apply_cta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function TierCard({
  name,
  price,
  desc,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`relative flex flex-col border transition-all ${
        highlighted
          ? 'border-brand-400 shadow-lg shadow-brand-500/10 dark:border-brand-600'
          : 'border-surface-200 dark:border-surface-700'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="brand" size="sm">Popular</Badge>
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">{name}</h3>
        <p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">{price}</p>
        <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">{desc}</p>
        <ul className="mt-6 flex-1 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
              <Check className="h-4 w-4 shrink-0 text-success-500" />
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function BenefitCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">{desc}</p>
    </div>
  );
}

function HowStep({
  step,
  title,
  desc,
}: {
  step: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-xl bg-white p-8 shadow-sm dark:bg-surface-800">
      <div className="absolute -top-4 left-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
          {step}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">{desc}</p>
    </div>
  );
}
