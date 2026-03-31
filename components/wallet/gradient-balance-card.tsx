'use client';

import { Coins, TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface GradientBalanceCardProps {
  totalBalance: number;
  stakedBalance: number;
  pendingRewards: number;
  totalEarned: number;
  change24h?: number;
}

export function GradientBalanceCard({
  totalBalance,
  stakedBalance,
  pendingRewards,
  totalEarned,
  change24h = 0,
}: GradientBalanceCardProps) {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-lg lg:p-8">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-white/80">{t('wallet_components.total_balance')}</span>
          </div>
          {change24h !== 0 && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                change24h > 0 ? 'bg-white/15 text-white' : 'bg-danger-500/30 text-danger-200'
              )}
            >
              <TrendingUp
                className={cn('h-3 w-3', change24h < 0 && 'rotate-180')}
              />
              {change24h > 0 ? '+' : ''}
              {change24h.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-4xl font-bold tracking-tight lg:text-5xl">
            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-sm text-white/70">{t('wallet_components.multa_tokens')}</p>
        </div>

        {/* Breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-white/60">{t('wallet_components.available')}</p>
            <p className="text-lg font-semibold">
              {(totalBalance - stakedBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">{t('wallet_components.staked')}</p>
            <p className="text-lg font-semibold">
              {stakedBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">{t('wallet_components.pending_rewards')}</p>
            <p className="flex items-center gap-1 text-lg font-semibold text-accent-300">
              +{pendingRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <ArrowUpRight className="h-4 w-4" />
            </p>
          </div>
        </div>

        {/* Total earned */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
          <TrendingUp className="h-4 w-4 text-accent-300" />
          <span className="text-sm text-white/80">
            {t('wallet_components.total_earned')}: <span className="font-semibold text-white">{totalEarned.toLocaleString()} MULTA</span>
          </span>
        </div>
      </div>
    </div>
  );
}
