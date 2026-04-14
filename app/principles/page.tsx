'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import {
  ShieldCheck,
  Scale,
  Camera,
  Gavel,
  Coins,
  XCircle,
  Ban,
  Gauge,
  Timer,
  Lock,
  BarChart3,
  FileSignature,
  UserX,
  ChevronDown,
  ArrowRight,
  Users,
  Building2,
  CheckCircle2,
  Eye,
  ScrollText,
} from 'lucide-react';

export default function PrinciplesPage() {
  const { t } = useTranslation();

  const doItems = [
    { icon: Camera, titleKey: 'principles.do_1_title', contentKey: 'principles.do_1_content' },
    { icon: FileSignature, titleKey: 'principles.do_2_title', contentKey: 'principles.do_2_content' },
    { icon: Gavel, titleKey: 'principles.do_3_title', contentKey: 'principles.do_3_content' },
    { icon: Coins, titleKey: 'principles.do_4_title', contentKey: 'principles.do_4_content' },
  ];

  const dontItems = [
    'principles.dont_1',
    'principles.dont_2',
    'principles.dont_3',
    'principles.dont_4',
    'principles.dont_5',
    'principles.dont_6',
    'principles.dont_7',
  ];

  const flowSteps = [
    {
      n: 1,
      icon: Camera,
      titleKey: 'principles.flow_1_title',
      contentKey: 'principles.flow_1_content',
      tone: 'brand' as const,
    },
    {
      n: 2,
      icon: Users,
      titleKey: 'principles.flow_2_title',
      contentKey: 'principles.flow_2_content',
      tone: 'neutral' as const,
    },
    {
      n: 3,
      icon: ArrowRight,
      titleKey: 'principles.flow_3_title',
      contentKey: 'principles.flow_3_content',
      tone: 'warning' as const,
    },
    {
      n: 4,
      icon: CheckCircle2,
      titleKey: 'principles.flow_4_title',
      contentKey: 'principles.flow_4_content',
      tone: 'success' as const,
    },
    {
      n: 5,
      icon: XCircle,
      titleKey: 'principles.flow_5_title',
      contentKey: 'principles.flow_5_content',
      tone: 'danger' as const,
    },
  ];

  const safeguards = [
    { icon: Gavel, titleKey: 'principles.safeguard_authority_title', contentKey: 'principles.safeguard_authority_content' },
    { icon: FileSignature, titleKey: 'principles.safeguard_evidence_title', contentKey: 'principles.safeguard_evidence_content' },
    { icon: UserX, titleKey: 'principles.safeguard_anonymity_title', contentKey: 'principles.safeguard_anonymity_content' },
    { icon: Gauge, titleKey: 'principles.safeguard_rate_title', contentKey: 'principles.safeguard_rate_content' },
    { icon: Timer, titleKey: 'principles.safeguard_cooldown_title', contentKey: 'principles.safeguard_cooldown_content' },
    { icon: Coins, titleKey: 'principles.safeguard_caps_title', contentKey: 'principles.safeguard_caps_content' },
    { icon: Ban, titleKey: 'principles.safeguard_penalties_title', contentKey: 'principles.safeguard_penalties_content' },
    { icon: BarChart3, titleKey: 'principles.safeguard_transparency_title', contentKey: 'principles.safeguard_transparency_content' },
  ];

  const faqs = [
    { q: 'principles.faq_q1', a: 'principles.faq_a1' },
    { q: 'principles.faq_q2', a: 'principles.faq_a2' },
    { q: 'principles.faq_q3', a: 'principles.faq_a3' },
    { q: 'principles.faq_q4', a: 'principles.faq_a4' },
    { q: 'principles.faq_q5', a: 'principles.faq_a5' },
    { q: 'principles.faq_q6', a: 'principles.faq_a6' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-surface-200 bg-gradient-to-b from-brand-50/60 to-white py-16 dark:border-surface-700 dark:from-brand-950/20 dark:to-surface-900 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Scale className="h-4 w-4" />
                {t('principles.badge')}
              </div>
              <h1 className="text-4xl font-bold text-surface-900 dark:text-white md:text-5xl">
                {t('principles.hero_title')}
              </h1>
              <p className="mt-5 text-lg text-surface-600 dark:text-surface-300">
                {t('principles.hero_subtitle')}
              </p>
              <p className="mt-6 text-base leading-relaxed text-surface-600 dark:text-surface-300">
                {t('principles.intro_lead')}
              </p>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="mb-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('principles.do_section_title')}
                </h2>
                <p className="mt-3 max-w-2xl text-surface-600 dark:text-surface-300">
                  {t('principles.do_section_subtitle')}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {doItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.titleKey}
                      className="border-surface-200 dark:border-surface-700"
                    >
                      <CardContent className="p-5">
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold text-surface-900 dark:text-white">
                          {t(item.titleKey)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                          {t(item.contentKey)}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* What we DON'T do */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="mb-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <XCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('principles.dont_section_title')}
                </h2>
                <p className="mt-3 max-w-2xl text-surface-600 dark:text-surface-300">
                  {t('principles.dont_section_subtitle')}
                </p>
              </div>

              <ol className="space-y-3">
                {dontItems.map((key, idx) => (
                  <li
                    key={key}
                    className="flex items-start gap-4 rounded-xl border border-brand-200 bg-white p-4 shadow-sm dark:border-brand-900/60 dark:bg-surface-900"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      {idx + 1}
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                      <p className="text-sm leading-relaxed text-surface-800 dark:text-surface-200">
                        {t(key)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  <ScrollText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('principles.flow_section_title')}
                </h2>
                <p className="mt-3 text-surface-600 dark:text-surface-300">
                  {t('principles.flow_section_subtitle')}
                </p>
              </div>

              <ol className="relative border-l-2 border-dashed border-surface-200 pl-8 dark:border-surface-700">
                {flowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const toneClasses = {
                    brand:
                      'bg-brand-100 text-brand-600 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:ring-brand-900',
                    neutral:
                      'bg-surface-100 text-surface-600 ring-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:ring-surface-600',
                    warning:
                      'bg-warning-100 text-warning-700 ring-warning-200 dark:bg-warning-900/30 dark:text-warning-400 dark:ring-warning-900',
                    success:
                      'bg-success-100 text-success-700 ring-success-200 dark:bg-success-900/30 dark:text-success-400 dark:ring-success-900',
                    danger:
                      'bg-danger-100 text-danger-700 ring-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:ring-danger-900',
                  }[step.tone];

                  return (
                    <li
                      key={step.n}
                      className={idx === flowSteps.length - 1 ? '' : 'pb-8'}
                    >
                      <span
                        className={`absolute -left-[1.15rem] flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-white dark:ring-surface-900 ${toneClasses}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
                            {step.n.toString().padStart(2, '0')}
                          </span>
                          <h3 className="text-base font-semibold text-surface-900 dark:text-white">
                            {t(step.titleKey)}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                          {t(step.contentKey)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* Safeguards */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-5xl">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('principles.safeguards_section_title')}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-surface-600 dark:text-surface-300">
                  {t('principles.safeguards_section_subtitle')}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {safeguards.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.titleKey}
                      className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900"
                    >
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                            {t(s.titleKey)}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                            {t(s.contentKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                  {t('principles.faq_section_title')}
                </h2>
                <p className="mt-3 text-surface-600 dark:text-surface-300">
                  {t('principles.faq_section_subtitle')}
                </p>
              </div>

              <div className="divide-y divide-surface-200 overflow-hidden rounded-xl border border-surface-200 bg-white dark:divide-surface-700 dark:border-surface-700 dark:bg-surface-900">
                {faqs.map((faq, idx) => (
                  <FaqItem key={faq.q} q={t(faq.q)} a={t(faq.a)} defaultOpen={idx === 0} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* City agreements */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                    {t('principles.city_section_title')}
                  </h2>
                  <p className="mt-3 text-surface-600 dark:text-surface-300">
                    {t('principles.city_section_subtitle')}
                  </p>
                  <div className="mt-6">
                    <Link href="/developers">
                      <Button variant="outline">
                        {t('principles.city_cta')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <Card className="border-surface-200 dark:border-surface-700">
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {[
                        { icon: Scale, key: 'principles.city_due_process' },
                        { icon: Lock, key: 'principles.city_data_protection' },
                        { icon: ShieldCheck, key: 'principles.city_audit' },
                        { icon: Gavel, key: 'principles.city_exclusive_use' },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.key} className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                            <span className="text-sm text-surface-700 dark:text-surface-200">
                              {t(item.key)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                {t('principles.cta_title')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-surface-600 dark:text-surface-300">
                {t('principles.cta_subtitle')}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/transparency">
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {t('principles.cta_transparency')}
                  </Button>
                </Link>
                <Link href="/security-policy">
                  <Button variant="outline">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {t('principles.cta_security')}
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    {t('principles.cta_privacy')}
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

function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-surface-900 dark:text-white">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-surface-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
          {a}
        </div>
      )}
    </div>
  );
}
