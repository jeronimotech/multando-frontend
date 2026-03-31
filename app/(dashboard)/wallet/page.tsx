'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from 'react';
import { TokenBalanceCard } from '@/components/wallet/token-balance';
import { StakingCard } from '@/components/wallet/staking-card';
import { TransactionHistory } from '@/components/wallet/transaction-history';
import { LinkWalletCard } from '@/components/wallet/link-wallet-card';
import { GradientBalanceCard } from '@/components/wallet/gradient-balance-card';
import { ClaimRewardsCard } from '@/components/wallet/claim-rewards-card';
import { WithdrawalCard } from '@/components/wallet/withdrawal-card';
import { PortfolioChart } from '@/components/wallet/portfolio-chart';
import { WalletModeSwitch } from '@/components/wallet/wallet-mode-switch';
import { useMultaWallet } from '@/hooks/use-wallet';
import { useTranslation } from '@/hooks/use-translation';
import { api } from '@/lib/api';
import { Info, FlaskConical } from 'lucide-react';

interface WalletInfo {
  wallet_type: 'custodial' | 'self_custodial';
  public_key: string | null;
  status: string;
  balance: number;
  staked_balance: number;
  pending_rewards: number;
  total_earned: number;
  can_withdraw: boolean;
}

export default function WalletPage() {
  const { connected, fetchTokenBalance } = useMultaWallet();
  const { t } = useTranslation();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletInfo = useCallback(async () => {
    try {
      const data = await api.get<WalletInfo>('/api/v1/wallet/info');
      setWalletInfo(data);
    } catch {
      // Default to custodial if API fails
      setWalletInfo({
        wallet_type: 'custodial',
        public_key: null,
        status: 'active',
        balance: 0,
        staked_balance: 0,
        pending_rewards: 0,
        total_earned: 0,
        can_withdraw: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletInfo();
  }, [fetchWalletInfo]);

  useEffect(() => {
    if (connected) {
      fetchTokenBalance();
    }
  }, [connected, fetchTokenBalance]);

  const handleClaimRewards = async () => {
    await api.post('/blockchain/claim-rewards');
    await fetchWalletInfo();
  };

  const isCustodial = walletInfo?.wallet_type === 'custodial';

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t('wallet.title')}
          </h1>
          <p className="mt-1 text-surface-600 dark:text-surface-300">
            {t('wallet_page.subtitle')}
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {t('wallet.title')}
        </h1>
        <p className="mt-1 text-surface-600 dark:text-surface-300">
          {t('wallet_page.subtitle')}
        </p>
      </div>

      {/* Rewards Preview Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
              {t('rewards_info.banner_title')}
            </h3>
            <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              {t('rewards_info.banner_desc')}
            </p>
            <div className="mt-3 rounded-lg bg-amber-100/60 p-3 dark:bg-amber-900/30">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                {t('rewards_info.what_is_devnet')}
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                {t('rewards_info.devnet_explanation')}
              </p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {t('rewards_info.points_note')}
            </p>
          </div>
        </div>
      </div>

      {isCustodial ? (
        <>
          {/* Custodial Mode Layout */}
          {walletInfo && (
            <GradientBalanceCard
              totalBalance={walletInfo.balance}
              stakedBalance={walletInfo.staked_balance}
              pendingRewards={walletInfo.pending_rewards}
              totalEarned={walletInfo.total_earned}
            />
          )}

          {walletInfo && walletInfo.pending_rewards > 0 && (
            <ClaimRewardsCard
              pendingRewards={walletInfo.pending_rewards}
              onClaim={handleClaimRewards}
            />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/30">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    {t('rewards_info.staking_preview_title')}
                  </p>
                  <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                    {t('rewards_info.staking_preview_desc')}
                  </p>
                </div>
                <StakingCard walletType="custodial" balance={walletInfo?.balance ?? 0} stakedBalance={walletInfo?.staked_balance ?? 0} onAction={fetchWalletInfo} />
              </div>
              <WithdrawalCard
                balance={walletInfo?.balance ?? 0}
                onWithdrawalComplete={fetchWalletInfo}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <PortfolioChart />
              <TransactionHistory />
            </div>
          </div>

          {/* Switch to Advanced Mode */}
          <WalletModeSwitch
            currentMode="custodial"
            onModeChanged={fetchWalletInfo}
          />
        </>
      ) : (
        <>
          {/* Self-Custodial Mode Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <LinkWalletCard />
              <TokenBalanceCard />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <StakingCard />
              <TransactionHistory />
            </div>
          </div>

          {/* Switch to Managed Mode */}
          <WalletModeSwitch
            currentMode="self_custodial"
            onModeChanged={fetchWalletInfo}
          />
        </>
      )}
    </div>
  );
}
