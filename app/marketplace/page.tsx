'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { useAllOffers, useMyRedemptions, useRedeemOffer } from '@/hooks/use-partners';
import type { PartnerOffer, Redemption } from '@/hooks/use-partners';
import {
  Coins,
  Gift,
  Store,
  Clock,
  X,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';

type Tab = 'offers' | 'redemptions';
type SortKey = 'newest' | 'cheapest' | 'popular';

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('offers');
  const [sort, setSort] = useState<SortKey>('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [confirmOffer, setConfirmOffer] = useState<PartnerOffer | null>(null);
  const [redeemResult, setRedeemResult] = useState<{ code: string } | null>(null);

  // Mock balance (in real app, from useWallet or custodial balance endpoint)
  const balance = 350;

  const { data: offers = [], isLoading: offersLoading } = useAllOffers({
    sort,
    category: categoryFilter || undefined,
  });
  const { data: redemptions = [], isLoading: redemptionsLoading } = useMyRedemptions();
  const redeemMutation = useRedeemOffer();

  const categories = Array.from(new Set(offers.map((o) => o.category)));

  const handleRedeem = () => {
    if (!confirmOffer) return;
    redeemMutation.mutate(confirmOffer.id, {
      onSuccess: (data) => {
        setRedeemResult({ code: data.code });
        setConfirmOffer(null);
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Top */}
        <section className="border-b border-surface-200 bg-gradient-to-b from-brand-50/50 to-white py-10 dark:border-surface-700 dark:from-brand-950/20 dark:to-surface-900">
          <div className="container-app">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                  {t('marketplace.title')}
                </h1>
                <p className="mt-2 text-surface-600 dark:text-surface-300">
                  {t('marketplace.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-5 py-3 shadow-sm dark:border-surface-700 dark:bg-surface-800">
                <Coins className="h-5 w-5 text-accent-500" />
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {t('marketplace.your_balance')}
                  </p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white">
                    {balance} <span className="text-sm font-normal text-surface-500">MULTA</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-4 border-b border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={() => setTab('offers')}
                className={`pb-3 text-sm font-medium transition-colors ${
                  tab === 'offers'
                    ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
                }`}
              >
                <Gift className="mr-1.5 inline h-4 w-4" />
                {t('marketplace.filter_all')}
              </button>
              <button
                type="button"
                onClick={() => setTab('redemptions')}
                className={`pb-3 text-sm font-medium transition-colors ${
                  tab === 'redemptions'
                    ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
                }`}
              >
                <ShoppingBag className="mr-1.5 inline h-4 w-4" />
                {t('marketplace.my_redemptions')}
              </button>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container-app">
            {tab === 'offers' && (
              <>
                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-700 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300"
                  >
                    <option value="newest">{t('marketplace.sort_newest')}</option>
                    <option value="cheapest">{t('marketplace.sort_cheapest')}</option>
                    <option value="popular">{t('marketplace.sort_popular')}</option>
                  </select>

                  {/* Category */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-700 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300"
                  >
                    <option value="">{t('marketplace.filter_all')}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Offers grid */}
                {offersLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-64 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-800"
                      />
                    ))}
                  </div>
                ) : offers.length === 0 ? (
                  <div className="py-16 text-center">
                    <Gift className="mx-auto h-12 w-12 text-surface-300 dark:text-surface-600" />
                    <p className="mt-4 text-surface-500 dark:text-surface-400">
                      {t('marketplace.no_offers')}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {offers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        balance={balance}
                        t={t}
                        onRedeem={() => setConfirmOffer(offer)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === 'redemptions' && (
              <>
                {redemptionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-20 animate-pulse rounded-xl bg-surface-100 dark:bg-surface-800"
                      />
                    ))}
                  </div>
                ) : redemptions.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-surface-300 dark:text-surface-600" />
                    <p className="mt-4 text-surface-500 dark:text-surface-400">
                      {t('marketplace.no_redemptions')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {redemptions.map((r) => (
                      <RedemptionRow key={r.id} redemption={r} t={t} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Confirm dialog */}
      {confirmOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-surface-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                {t('marketplace.redeem_confirm_title')}
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOffer(null)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-surface-600 dark:text-surface-300">
              {t('marketplace.redeem_confirm_body').replace('{cost}', String(confirmOffer.cost))}
            </p>
            <p className="mt-2 text-sm font-medium text-surface-900 dark:text-white">
              {confirmOffer.title} - {confirmOffer.partnerName}
            </p>
            {balance < confirmOffer.cost && (
              <p className="mt-3 text-sm font-medium text-danger-600 dark:text-danger-400">
                {t('marketplace.insufficient_balance')}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmOffer(null)}
              >
                {t('marketplace.redeem_cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleRedeem}
                disabled={balance < confirmOffer.cost || redeemMutation.isPending}
              >
                {redeemMutation.isPending ? '...' : t('marketplace.redeem_confirm_cta')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success dialog */}
      {redeemResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-surface-800">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">
              {t('marketplace.redeem_success_title')}
            </h3>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              {t('marketplace.redeem_success_code')}
            </p>
            <div className="mt-3 rounded-lg bg-surface-100 px-4 py-3 font-mono text-lg font-bold text-surface-900 dark:bg-surface-700 dark:text-white">
              {redeemResult.code}
            </div>
            <p className="mt-4 text-sm text-surface-600 dark:text-surface-300">
              {t('marketplace.redeem_success_instructions')}
            </p>
            <div className="mt-6">
              <Button className="w-full" onClick={() => setRedeemResult(null)}>
                {t('common.close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OfferCard({
  offer,
  balance,
  t,
  onRedeem,
}: {
  offer: PartnerOffer;
  balance: number;
  t: (key: string) => string;
  onRedeem: () => void;
}) {
  const insufficient = balance < offer.cost;

  return (
    <Card className="flex flex-col border-surface-200 transition-all hover:shadow-md dark:border-surface-700">
      <CardContent className="flex flex-1 flex-col p-5">
        {/* Partner info */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-surface-500 dark:text-surface-400">
              {offer.partnerName}
            </p>
            <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
              {offer.title}
            </p>
          </div>
        </div>

        <p className="flex-1 text-sm text-surface-600 dark:text-surface-300">
          {offer.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          {offer.expiresAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {t('marketplace.offer_expires')}: {new Date(offer.expiresAt).toLocaleDateString()}
            </span>
          )}
          {offer.remaining !== null ? (
            <span>
              {t('marketplace.offer_remaining').replace('{count}', String(offer.remaining))}
            </span>
          ) : (
            <span>{t('marketplace.offer_unlimited')}</span>
          )}
        </div>

        {/* Cost + redeem */}
        <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4 dark:border-surface-700">
          <Badge variant="warning" size="md">
            <Coins className="h-3 w-3" />
            {offer.cost} MULTA
          </Badge>
          <Button
            size="sm"
            onClick={onRedeem}
            disabled={insufficient}
          >
            {insufficient
              ? t('marketplace.insufficient_balance')
              : t('marketplace.redeem_button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RedemptionRow({
  redemption,
  t,
}: {
  redemption: Redemption;
  t: (key: string) => string;
}) {
  const statusColors: Record<string, string> = {
    pending: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    claimed: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    expired: 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400',
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-5 py-4 dark:border-surface-700 dark:bg-surface-800">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
          {redemption.offerTitle}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {redemption.partnerName} &middot; {new Date(redemption.redeemedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <span className="font-mono text-sm font-medium text-surface-700 dark:text-surface-300">
          {redemption.code}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            statusColors[redemption.status] || statusColors.pending
          }`}
        >
          {redemption.status}
        </span>
      </div>
    </div>
  );
}
