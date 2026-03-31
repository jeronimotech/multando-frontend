'use client';

import { useEffect, useState } from 'react';
import { useMultaWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake' | 'unstake' | 'reward';
  amount: number;
  timestamp: string;
  signature: string;
  status: 'confirmed' | 'pending' | 'failed';
  counterparty?: string;
}

const typeLabels: Record<Transaction['type'], string> = {
  send: 'Sent',
  receive: 'Received',
  stake: 'Staked',
  unstake: 'Unstaked',
  reward: 'Reward',
};

const typeIcons: Record<Transaction['type'], React.ReactNode> = {
  send: <ArrowUpRight className="h-4 w-4 text-danger-500" />,
  receive: <ArrowDownLeft className="h-4 w-4 text-success-500" />,
  stake: <ArrowUpRight className="h-4 w-4 text-blue-500" />,
  unstake: <ArrowDownLeft className="h-4 w-4 text-blue-500" />,
  reward: <ArrowDownLeft className="h-4 w-4 text-success-500" />,
};

export function TransactionHistory() {
  const { connected, publicKey } = useMultaWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const response = await api.get<Transaction[]>('/blockchain/transactions');
      setTransactions(response);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchTransactions();
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-surface-600 dark:text-surface-400">
          Connect your wallet to view transaction history
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateSignature = (sig: string) => {
    return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
  };

  const getSolscanUrl = (signature: string) => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    return `https://solscan.io/tx/${signature}?cluster=${network}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTransactions}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-surface-600 dark:text-surface-400">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                    {typeIcons[tx.type]}
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">
                      {typeLabels[tx.type]}
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      {formatDate(tx.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        tx.type === 'send' || tx.type === 'stake'
                          ? 'text-danger-600 dark:text-danger-400'
                          : 'text-success-600 dark:text-success-400'
                      }`}
                    >
                      {tx.type === 'send' || tx.type === 'stake' ? '-' : '+'}
                      {tx.amount.toLocaleString()} MULTA
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      {truncateSignature(tx.signature)}
                    </p>
                  </div>
                  <a
                    href={getSolscanUrl(tx.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
