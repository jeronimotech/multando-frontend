'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ClaimRewardsCardProps {
  pendingRewards: number;
  onClaim: () => Promise<void>;
}

export function ClaimRewardsCard({ pendingRewards, onClaim }: ClaimRewardsCardProps) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await onClaim();
      setClaimed(true);
      setTimeout(() => setClaimed(false), 3000);
    } finally {
      setClaiming(false);
    }
  };

  const { t } = useTranslation();

  if (pendingRewards <= 0) return null;

  return (
    <Card className="relative overflow-hidden border-accent-200 bg-gradient-to-r from-accent-50 to-accent-100/50 dark:border-accent-800 dark:from-accent-950/30 dark:to-accent-900/20">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10">
              <Gift className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">
                {t('wallet_components.pending_rewards')}
              </p>
              <p className="flex items-center gap-1 text-2xl font-bold text-accent-600 dark:text-accent-400">
                <Sparkles className="h-5 w-5" />
                {pendingRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} MULTA
              </p>
            </div>
          </div>
          <Button
            variant={claimed ? 'secondary' : 'primary'}
            size="lg"
            onClick={handleClaim}
            disabled={claiming || claimed}
            className={claimed ? 'bg-success-500 hover:bg-success-500 text-white' : 'bg-accent-500 hover:bg-accent-600'}
          >
            {claiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('wallet_components.claiming')}
              </>
            ) : claimed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('wallet_components.claimed')}
              </>
            ) : (
              t('wallet_components.claim_rewards')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
