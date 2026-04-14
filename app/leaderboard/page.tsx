'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PlateLeaderboard } from '@/components/reports/plate-leaderboard';
import { useTranslation } from '@/hooks/use-translation';
import { BarChart3 } from 'lucide-react';

// Static list of supported cities — matches the landing page list.
// Each city maps to a backend city_id. Leave `id` undefined for "all cities".
const CITY_OPTIONS: { id: string; label: string }[] = [
  { id: '', label: 'all' },
  { id: 'bogota', label: 'Bogotá' },
  { id: 'medellin', label: 'Medellín' },
  { id: 'cali', label: 'Cali' },
  { id: 'barranquilla', label: 'Barranquilla' },
  { id: 'cartagena', label: 'Cartagena' },
  { id: 'bucaramanga', label: 'Bucaramanga' },
  { id: 'cucuta', label: 'Cúcuta' },
  { id: 'pereira', label: 'Pereira' },
  { id: 'santa-marta', label: 'Santa Marta' },
  { id: 'manizales', label: 'Manizales' },
];

export default function PublicLeaderboardPage() {
  const { t } = useTranslation();
  const [cityId, setCityId] = useState<string>('');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-16 dark:from-surface-800 dark:to-surface-900 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                <BarChart3 className="h-4 w-4" />
                {t('landing.leaderboard_badge')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-5xl">
                {t('landing.leaderboard_page_title')}
              </h1>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.leaderboard_page_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Filters + Leaderboard */}
        <section className="py-12 sm:py-16">
          <div className="container-app">
            {/* City filter */}
            <div className="mx-auto mb-8 flex max-w-4xl items-center justify-center gap-3">
              <label
                htmlFor="city-filter"
                className="text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                {t('landing.leaderboard_city_filter')}
              </label>
              <select
                id="city-filter"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
              >
                {CITY_OPTIONS.map((opt) => (
                  <option key={opt.id || 'all'} value={opt.id}>
                    {opt.id === ''
                      ? t('landing.leaderboard_all_cities')
                      : opt.label}
                  </option>
                ))}
              </select>
            </div>

            <PlateLeaderboard
              limit={50}
              cityId={cityId || null}
              showHeader={false}
              showViewAll={false}
              extended
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
