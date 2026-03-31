import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api } from '@/lib/api';

export interface TokenBalance {
  balance: number;
  stakedBalance: number;
  pendingRewards: number;
}

export function useMultaWallet() {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);

  // Fetch SOL balance
  useEffect(() => {
    if (!publicKey) {
      setSolBalance(null);
      return;
    }

    const fetchBalance = async () => {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    };

    fetchBalance();
    const id = connection.onAccountChange(publicKey, (info) => {
      setSolBalance(info.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [publicKey, connection]);

  // Fetch MULTA token balance
  const fetchTokenBalance = useCallback(async () => {
    if (!publicKey) return;

    try {
      const response = await api.get<TokenBalance>('/blockchain/balance');
      setTokenBalance(response);
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
    }
  }, [publicKey]);

  // Link wallet to account
  const linkWallet = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    setIsLinking(true);
    try {
      const message = `Link wallet to Multando account\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      await api.post('/auth/link-wallet', {
        wallet_address: publicKey.toBase58(),
        signature: Buffer.from(signature).toString('base64'),
        message,
      });

      setIsLinked(true);
    } catch (error) {
      console.error('Failed to link wallet:', error);
      throw error;
    } finally {
      setIsLinking(false);
    }
  }, [publicKey, signMessage]);

  return {
    publicKey: publicKey?.toBase58() ?? null,
    connected,
    disconnect,
    solBalance,
    tokenBalance,
    isLinking,
    isLinked,
    linkWallet,
    fetchTokenBalance,
  };
}
