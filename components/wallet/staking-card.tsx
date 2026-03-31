'use client';

import { useState } from 'react';
import { useMultaWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';

interface StakingCardProps {
  /** When 'custodial', staking works via API without wallet connection */
  walletType?: 'custodial' | 'self_custodial';
  /** Available balance for custodial users */
  balance?: number;
  /** Staked balance for custodial users */
  stakedBalance?: number;
  /** Callback after staking/unstaking for custodial users */
  onAction?: () => void;
}

export function StakingCard({
  walletType,
  balance: propBalance,
  stakedBalance: propStaked,
  onAction,
}: StakingCardProps = {}) {
  const { connected, tokenBalance, fetchTokenBalance } = useMultaWallet();
  const { t } = useTranslation();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  const isCustodial = walletType === 'custodial';

  // For self-custodial mode, require wallet connection
  if (!isCustodial && !connected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-surface-600 dark:text-surface-400">
          {t('wallet.connect')}
        </CardContent>
      </Card>
    );
  }

  const availableBalance = isCustodial ? (propBalance ?? 0) : (tokenBalance?.balance ?? 0);
  const currentStaked = isCustodial ? (propStaked ?? 0) : (tokenBalance?.stakedBalance ?? 0);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsStaking(true);
    try {
      await api.post('/blockchain/stake', { amount: parseFloat(stakeAmount) });
      setStakeAmount('');
      if (isCustodial) {
        onAction?.();
      } else {
        await fetchTokenBalance();
      }
    } catch (error) {
      console.error('Failed to stake:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;

    setIsUnstaking(true);
    try {
      await api.post('/blockchain/unstake', { amount: parseFloat(unstakeAmount) });
      setUnstakeAmount('');
      if (isCustodial) {
        onAction?.();
      } else {
        await fetchTokenBalance();
      }
    } catch (error) {
      console.error('Failed to unstake:', error);
    } finally {
      setIsUnstaking(false);
    }
  };

  const setMaxStake = () => {
    setStakeAmount(availableBalance.toString());
  };

  const setMaxUnstake = () => {
    setUnstakeAmount(currentStaked.toString());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          {t('wallet.stake')}
        </CardTitle>
        <CardDescription>
          Stake your MULTA tokens to earn rewards and participate in governance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex rounded-lg border border-surface-200 p-1 dark:border-surface-700">
          <button
            type="button"
            onClick={() => setActiveTab('stake')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'stake'
                ? 'bg-brand-500 text-white'
                : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
            }`}
          >
            <Lock className="h-4 w-4" />
            {t('wallet.stake')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unstake')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'unstake'
                ? 'bg-brand-500 text-white'
                : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
            }`}
          >
            <Unlock className="h-4 w-4" />
            {t('wallet.unstake')}
          </button>
        </div>

        {/* Stake Form */}
        {activeTab === 'stake' && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  Amount to Stake
                </label>
                <button
                  type="button"
                  onClick={setMaxStake}
                  className="text-xs text-brand-500 hover:underline"
                >
                  Max: {availableBalance.toLocaleString()} MULTA
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button
                  onClick={handleStake}
                  disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
                  isLoading={isStaking}
                >
                  {t('wallet.stake')}
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-800">
              <h4 className="text-sm font-medium text-surface-900 dark:text-white">
                Staking Benefits
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-surface-600 dark:text-surface-400">
                <li>- Earn up to 12% APY on staked tokens</li>
                <li>- Participate in governance voting</li>
                <li>- Priority access to new features</li>
              </ul>
            </div>
          </div>
        )}

        {/* Unstake Form */}
        {activeTab === 'unstake' && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  Amount to Unstake
                </label>
                <button
                  type="button"
                  onClick={setMaxUnstake}
                  className="text-xs text-brand-500 hover:underline"
                >
                  Staked: {currentStaked.toLocaleString()} MULTA
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button
                  onClick={handleUnstake}
                  disabled={isUnstaking || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
                  isLoading={isUnstaking}
                  variant="outline"
                >
                  {t('wallet.unstake')}
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Unstaking Notice
              </h4>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Unstaking has a 7-day cooldown period. Your tokens will be available after the cooldown ends.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
