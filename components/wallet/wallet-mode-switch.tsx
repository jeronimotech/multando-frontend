'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Key,
  AlertTriangle,
  ExternalLink,
  X,
} from 'lucide-react';
import { useMultaWallet } from '@/hooks/use-wallet';
import { api } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';

type WalletMode = 'custodial' | 'self_custodial';

interface WalletModeSwitchProps {
  currentMode: WalletMode;
  onModeChanged: () => void;
}

// Validate Solana address format (base58, 32-44 chars)
function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function WalletModeSwitch({ currentMode, onModeChanged }: WalletModeSwitchProps) {
  const { t } = useTranslation();
  const { publicKey, connected } = useMultaWallet();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [targetMode, setTargetMode] = useState<WalletMode | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  const isCustodial = currentMode === 'custodial';

  const handleRequestSwitch = () => {
    setTargetMode(isCustodial ? 'self_custodial' : 'custodial');
    setError(null);
    setManualAddress('');
    setShowConfirmDialog(true);
  };

  // Get the wallet address from either Solana adapter or manual input
  const resolvedAddress = connected && publicKey ? publicKey : manualAddress.trim();
  const canConfirmAdvanced = targetMode === 'self_custodial'
    ? isValidSolanaAddress(resolvedAddress)
    : true;

  const handleConfirmSwitch = async () => {
    if (!targetMode) return;

    if (targetMode === 'self_custodial' && !canConfirmAdvanced) {
      setError(t('custodial_wallet.invalid_address'));
      return;
    }

    setIsSwitching(true);
    setError(null);
    try {
      await api.post('/api/v1/wallet/switch-mode', {
        mode: targetMode,
        ...(targetMode === 'self_custodial' && resolvedAddress
          ? { wallet_address: resolvedAddress }
          : {}),
      });
      setShowConfirmDialog(false);
      onModeChanged();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? t('errors.generic'));
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
      <Card className="border-surface-200 dark:border-surface-700">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
                {isCustodial ? (
                  <Shield className="h-5 w-5 text-brand-500" />
                ) : (
                  <Key className="h-5 w-5 text-brand-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">
                  {isCustodial
                    ? t('custodial_wallet.managed_mode')
                    : t('custodial_wallet.advanced_mode')}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {isCustodial
                    ? t('custodial_wallet.managed_mode_desc')
                    : t('custodial_wallet.advanced_mode_desc')}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRequestSwitch}>
              {isCustodial
                ? t('custodial_wallet.switch_to_advanced')
                : t('custodial_wallet.switch_to_managed')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-surface-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {t('custodial_wallet.switch_confirm_title')}
              </h3>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
              {targetMode === 'self_custodial'
                ? t('custodial_wallet.switch_to_advanced_warning')
                : t('custodial_wallet.switch_to_managed_warning')}
            </p>

            {/* Warning box */}
            <div className="flex items-start gap-3 rounded-lg bg-warning-50 p-4 dark:bg-warning-900/20 mb-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400" />
              <div>
                <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
                  {targetMode === 'self_custodial'
                    ? t('custodial_wallet.advanced_mode')
                    : t('custodial_wallet.managed_mode')}
                </p>
                <p className="mt-1 text-sm text-warning-700 dark:text-warning-300">
                  {targetMode === 'self_custodial'
                    ? t('custodial_wallet.advanced_mode_desc')
                    : t('custodial_wallet.managed_mode_desc')}
                </p>
              </div>
            </div>

            {/* Solana wallet input for self-custodial */}
            {targetMode === 'self_custodial' && (
              <div className="mb-4 space-y-3">
                {/* Auto-detected from Solana adapter */}
                {connected && publicKey ? (
                  <div className="rounded-lg border border-success-200 bg-success-50 p-3 dark:border-success-800 dark:bg-success-950/30">
                    <p className="text-xs font-medium text-success-700 dark:text-success-300 mb-1">
                      Solana wallet detected
                    </p>
                    <p className="font-mono text-sm text-success-800 dark:text-success-200 break-all">
                      {publicKey}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Manual address input */}
                    <div>
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        {t('custodial_wallet.destination_address')}
                      </p>
                      <Input
                        placeholder="e.g. 7xKXt..."
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        error={
                          manualAddress && !isValidSolanaAddress(manualAddress)
                            ? t('custodial_wallet.invalid_address')
                            : undefined
                        }
                        helperText="Solana (SOL) — Phantom, Solflare, Backpack, etc."
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <span>Need a Solana wallet?</span>
                      <a
                        href="https://phantom.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-brand-500 hover:text-brand-600"
                      >
                        Get Phantom <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-600 dark:bg-danger-950/30 dark:text-danger-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDialog(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmSwitch}
                disabled={isSwitching || !canConfirmAdvanced}
                isLoading={isSwitching}
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
