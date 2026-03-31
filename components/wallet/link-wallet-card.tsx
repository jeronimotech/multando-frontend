'use client';

import { useMultaWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, Check, Wallet } from 'lucide-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function LinkWalletCard() {
  const { connected, publicKey, isLinked, linkWallet, isLinking, solBalance } = useMultaWallet();
  const { setVisible } = useWalletModal();

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Connect your Solana wallet to access token features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setVisible(true)} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Link your wallet to your Multando account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="rounded-lg border border-surface-200 p-4 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-surface-600 dark:text-surface-400">Wallet Address</span>
            <span className="font-mono text-sm text-surface-900 dark:text-white">
              {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-surface-600 dark:text-surface-400">SOL Balance</span>
            <span className="font-medium text-surface-900 dark:text-white">
              {solBalance?.toFixed(4) ?? '0.0000'} SOL
            </span>
          </div>
        </div>

        {/* Link Status */}
        {isLinked ? (
          <div className="flex items-center gap-2 rounded-lg bg-success-50 p-4 text-success-700 dark:bg-success-900/20 dark:text-success-400">
            <Check className="h-5 w-5" />
            <span className="font-medium">Wallet linked to your account</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Link your wallet to your Multando account to receive rewards directly to your wallet address.
            </p>
            <Button
              onClick={linkWallet}
              disabled={isLinking}
              isLoading={isLinking}
              className="w-full"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {isLinking ? 'Signing message...' : 'Link Wallet'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
