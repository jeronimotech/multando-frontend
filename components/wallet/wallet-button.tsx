'use client';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useMultaWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Link2 } from 'lucide-react';

export function WalletButton() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected, disconnect, isLinked, linkWallet, isLinking } = useMultaWallet();

  if (!connected) {
    return (
      <Button onClick={() => setVisible(true)} variant="outline">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isLinked && (
        <Button onClick={linkWallet} disabled={isLinking} size="sm">
          <Link2 className="mr-2 h-4 w-4" />
          {isLinking ? 'Linking...' : 'Link Wallet'}
        </Button>
      )}
      <Button variant="outline" size="sm">
        {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
      </Button>
      <Button variant="ghost" size="sm" onClick={disconnect}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
