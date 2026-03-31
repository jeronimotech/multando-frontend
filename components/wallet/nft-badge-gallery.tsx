'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface NFTBadge {
  id: string;
  name: string;
  imageUrl?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  mintAddress?: string;
}

interface NFTBadgeGalleryProps {
  badges: NFTBadge[];
  className?: string;
}

const rarityConfig: Record<string, { border: string; bg: string; text: string; label: string }> = {
  common: { border: 'border-surface-300', bg: 'bg-surface-100', text: 'text-surface-600', label: 'Common' },
  uncommon: { border: 'border-success-300', bg: 'bg-success-50', text: 'text-success-700', label: 'Uncommon' },
  rare: { border: 'border-brand-300', bg: 'bg-brand-50', text: 'text-brand-700', label: 'Rare' },
  epic: { border: 'border-purple-300', bg: 'bg-purple-50', text: 'text-purple-700', label: 'Epic' },
  legendary: { border: 'border-accent-400', bg: 'bg-accent-50', text: 'text-accent-700', label: 'Legendary' },
};

// Mock badges
const DEFAULT_BADGES: NFTBadge[] = [
  { id: '1', name: 'First Reporter', rarity: 'common', earned: true },
  { id: '2', name: 'Active Citizen', rarity: 'common', earned: true },
  { id: '3', name: 'Trusted Source', rarity: 'uncommon', earned: true },
  { id: '4', name: 'Token Staker', rarity: 'common', earned: true },
  { id: '5', name: 'Watchdog', rarity: 'rare', earned: false },
  { id: '6', name: 'Civic Champion', rarity: 'epic', earned: false },
];

export function NFTBadgeGallery({ badges = DEFAULT_BADGES, className }: NFTBadgeGalleryProps) {
  const { t } = useTranslation();
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-5 w-5 text-accent-500" />
          {t('wallet_components.nft_badges')}
          <span className="ml-auto text-sm font-normal text-surface-500">
            {earned.length}/{badges.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
          {badges.map((badge) => {
            const rarity = rarityConfig[badge.rarity];
            return (
              <div
                key={badge.id}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all',
                  badge.earned
                    ? cn(rarity.border, 'hover:shadow-sm')
                    : 'border-surface-200 opacity-50 dark:border-surface-700'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    badge.earned ? rarity.bg : 'bg-surface-100 dark:bg-surface-700'
                  )}
                >
                  {badge.earned ? (
                    <Award className={cn('h-6 w-6', rarity.text)} />
                  ) : (
                    <Lock className="h-5 w-5 text-surface-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-900 dark:text-white">
                    {badge.name}
                  </p>
                  <p className={cn('text-[10px] font-medium capitalize', rarity.text)}>
                    {rarity.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
