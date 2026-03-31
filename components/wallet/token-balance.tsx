'use client';

import { useMultaWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Lock, Gift, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface TokenBalanceCardProps {
  /** When provided, renders using API data instead of on-chain wallet data */
  walletType?: 'custodial' | 'self_custodial';
  balance?: number;
  stakedBalance?: number;
  pendingRewards?: number;
  onRefresh?: () => void;
}

export function TokenBalanceCard({
  walletType,
  balance: propBalance,
  stakedBalance: propStaked,
  pendingRewards: propRewards,
  onRefresh,
}: TokenBalanceCardProps = {}) {
  const { tokenBalance, fetchTokenBalance, connected } = useMultaWallet();
  const { t } = useTranslation();

  const isCustodial = walletType === 'custodial';

  // For self-custodial mode, require wallet connection
  if (!isCustodial && !connected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t('wallet.connect')}
        </CardContent>
      </Card>
    );
  }

  // Determine data source: props (custodial) or hook (self-custodial)
  const displayBalance = isCustodial ? (propBalance ?? 0) : (tokenBalance?.balance ?? 0);
  const displayStaked = isCustodial ? (propStaked ?? 0) : (tokenBalance?.stakedBalance ?? 0);
  const displayRewards = isCustodial ? (propRewards ?? 0) : (tokenBalance?.pendingRewards ?? 0);

  const handleRefresh = () => {
    if (isCustodial && onRefresh) {
      onRefresh();
    } else {
      fetchTokenBalance();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('wallet.balance')}</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
            <Coins className="h-4 w-4" />
            {t('wallet_components.available')}
          </div>
          <span className="text-2xl font-bold text-surface-900 dark:text-white">
            {displayBalance.toLocaleString()} MULTA
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
            <Lock className="h-4 w-4" />
            {t('wallet.staked')}
          </div>
          <span className="font-medium text-surface-900 dark:text-white">
            {displayStaked.toLocaleString()} MULTA
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
            <Gift className="h-4 w-4" />
            {t('wallet.rewards')}
          </div>
          <span className="font-medium text-success-600 dark:text-success-400">
            +{displayRewards.toLocaleString()} MULTA
          </span>
        </div>

        {displayRewards > 0 && (
          <Button className="w-full">
            {t('wallet.claim')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
