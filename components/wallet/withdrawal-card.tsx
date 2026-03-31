'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';

interface WithdrawalLimits {
  daily_limit: number;
  monthly_limit: number;
  daily_used: number;
  monthly_used: number;
  daily_remaining: number;
  monthly_remaining: number;
  withdrawal_fee: number;
  verification_threshold: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  destination_address: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed' | 'cancelled';
  created_at: string;
}

interface WithdrawResponse {
  withdrawal_id: string;
  requires_verification: boolean;
}

interface WithdrawalCardProps {
  balance: number;
  onWithdrawalComplete?: () => void;
}

const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function isValidSolanaAddress(address: string): boolean {
  return BASE58_REGEX.test(address);
}

export function WithdrawalCard({ balance, onWithdrawalComplete }: WithdrawalCardProps) {
  const { t } = useTranslation();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [limits, setLimits] = useState<WithdrawalLimits | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP verification state
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [withdrawalId, setWithdrawalId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchLimits = useCallback(async () => {
    try {
      const data = await api.get<WithdrawalLimits>('/api/v1/wallet/limits');
      setLimits(data);
    } catch {
      // silently fail, limits will show as unavailable
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const data = await api.get<{ items: Withdrawal[] }>(
        '/api/v1/wallet/withdrawals?page=1&page_size=5'
      );
      setWithdrawals(data.items ?? []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchLimits();
    fetchWithdrawals();
  }, [fetchLimits, fetchWithdrawals]);

  const fee = limits?.withdrawal_fee ?? 0.5;
  const parsedAmount = parseFloat(amount) || 0;
  const receiveAmount = Math.max(0, parsedAmount - fee);

  const validate = (): string | null => {
    if (!destinationAddress || !isValidSolanaAddress(destinationAddress)) {
      return t('custodial_wallet.invalid_address');
    }
    if (parsedAmount <= 0 || parsedAmount > balance) {
      return t('custodial_wallet.insufficient_balance');
    }
    if (limits && parsedAmount > limits.daily_remaining) {
      return t('custodial_wallet.exceeds_daily_limit');
    }
    if (limits && parsedAmount > limits.monthly_remaining) {
      return t('custodial_wallet.exceeds_monthly_limit');
    }
    return null;
  };

  const handleSetMax = () => {
    const maxByBalance = balance;
    const maxByDaily = limits?.daily_remaining ?? Infinity;
    const maxByMonthly = limits?.monthly_remaining ?? Infinity;
    const max = Math.min(maxByBalance, maxByDaily, maxByMonthly);
    setAmount(max > 0 ? max.toString() : '0');
  };

  const handleSubmit = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<WithdrawResponse>('/api/v1/wallet/withdraw', {
        amount: parsedAmount,
        destination_address: destinationAddress,
      });

      if (response.requires_verification) {
        setWithdrawalId(response.withdrawal_id);
        setShowOtpDialog(true);
      } else {
        // Withdrawal submitted without OTP
        setAmount('');
        setDestinationAddress('');
        await fetchWithdrawals();
        await fetchLimits();
        onWithdrawalComplete?.();
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? t('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!withdrawalId || otpCode.length !== 6) return;

    setIsVerifying(true);
    try {
      await api.post('/api/v1/wallet/withdraw/verify', {
        withdrawal_id: withdrawalId,
        code: otpCode,
      });
      setShowOtpDialog(false);
      setOtpCode('');
      setWithdrawalId(null);
      setAmount('');
      setDestinationAddress('');
      await fetchWithdrawals();
      await fetchLimits();
      onWithdrawalComplete?.();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? t('errors.generic'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelWithdrawal = async (id: string) => {
    try {
      await api.delete(`/api/v1/wallet/withdraw/${id}`);
      await fetchWithdrawals();
      await fetchLimits();
    } catch {
      // silently fail
    }
  };

  const statusIcon = (status: Withdrawal['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-brand-500" />;
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-success-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-danger-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-surface-400" />;
    }
  };

  const statusLabel = (status: Withdrawal['status']) => {
    const map: Record<string, string> = {
      pending: t('custodial_wallet.status_pending'),
      processing: t('custodial_wallet.status_processing'),
      confirmed: t('custodial_wallet.status_confirmed'),
      failed: t('custodial_wallet.status_failed'),
      cancelled: t('custodial_wallet.status_cancelled'),
    };
    return map[status] ?? status;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowUpRight className="h-5 w-5" />
            {t('custodial_wallet.withdraw_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Destination Address */}
          <Input
            label={t('custodial_wallet.destination_address')}
            placeholder={t('custodial_wallet.destination_placeholder')}
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            error={
              destinationAddress && !isValidSolanaAddress(destinationAddress)
                ? t('custodial_wallet.invalid_address')
                : undefined
            }
          />

          {/* Amount */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                {t('custodial_wallet.amount')}
              </label>
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs font-medium text-brand-500 hover:underline"
              >
                {t('custodial_wallet.max')}
              </button>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Fee & receive breakdown */}
          {parsedAmount > 0 && (
            <div className="space-y-2 rounded-lg bg-surface-50 p-3 dark:bg-surface-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 dark:text-surface-400">
                  {t('custodial_wallet.fee')}
                </span>
                <span className="text-surface-900 dark:text-white">
                  {fee} MULTA
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-surface-600 dark:text-surface-400">
                  {t('custodial_wallet.you_receive')}
                </span>
                <span className="text-success-600 dark:text-success-400">
                  {receiveAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  MULTA
                </span>
              </div>
            </div>
          )}

          {/* Limits */}
          {limits && (
            <div className="space-y-2 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 dark:text-surface-400">
                  {t('custodial_wallet.daily_limit')}
                </span>
                <span className="text-surface-900 dark:text-white">
                  {limits.daily_used.toLocaleString()} / {limits.daily_limit.toLocaleString()} MULTA{' '}
                  <span className="text-xs text-surface-500">
                    ({limits.daily_remaining.toLocaleString()} {t('custodial_wallet.remaining')})
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 dark:text-surface-400">
                  {t('custodial_wallet.monthly_limit')}
                </span>
                <span className="text-surface-900 dark:text-white">
                  {limits.monthly_used.toLocaleString()} / {limits.monthly_limit.toLocaleString()} MULTA{' '}
                  <span className="text-xs text-surface-500">
                    ({limits.monthly_remaining.toLocaleString()} {t('custodial_wallet.remaining')})
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-600 dark:bg-danger-950/30 dark:text-danger-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting || !amount || !destinationAddress}
            isLoading={isSubmitting}
          >
            {isSubmitting
              ? t('custodial_wallet.withdrawing')
              : t('custodial_wallet.withdraw_button')}
          </Button>

          {/* Withdrawal History */}
          {withdrawals.length > 0 && (
            <div className="pt-2">
              <h4 className="mb-3 text-sm font-medium text-surface-700 dark:text-surface-300">
                {t('custodial_wallet.withdrawal_history')}
              </h4>
              <div className="space-y-2">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between rounded-lg border border-surface-200 p-3 dark:border-surface-700"
                  >
                    <div className="flex items-center gap-2">
                      {statusIcon(w.status)}
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">
                          {w.amount.toLocaleString()} MULTA
                        </p>
                        <p className="text-xs text-surface-500">
                          {new Date(w.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-surface-600 dark:text-surface-400">
                        {statusLabel(w.status)}
                      </span>
                      {w.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleCancelWithdrawal(w.id)}
                          className="text-xs text-danger-500 hover:underline"
                        >
                          {t('custodial_wallet.cancel_withdrawal')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {withdrawals.length === 0 && (
            <p className="pt-2 text-center text-sm text-surface-500 dark:text-surface-400">
              {t('custodial_wallet.no_withdrawals')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent size="sm">
          <DialogClose />
          <DialogHeader>
            <DialogTitle>{t('custodial_wallet.verify_withdrawal')}</DialogTitle>
            <DialogDescription>
              {t('custodial_wallet.verify_desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4">
            <Input
              label={t('custodial_wallet.verify_code')}
              placeholder="000000"
              value={otpCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpCode(val);
              }}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOtpDialog(false);
                setOtpCode('');
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleVerify}
              disabled={otpCode.length !== 6 || isVerifying}
              isLoading={isVerifying}
            >
              {isVerifying
                ? t('custodial_wallet.withdrawing')
                : t('custodial_wallet.verify_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
