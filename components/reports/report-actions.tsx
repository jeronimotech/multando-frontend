'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useVerificationVote } from '@/hooks/use-reports';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { Report } from '@/types/report';
import {
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  X,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Link as LinkIcon,
} from 'lucide-react';

interface ReportActionsProps {
  report: Report;
  isOwner: boolean;
  isVerifier: boolean;
  isPending: boolean;
  className?: string;
}

// Share dropdown menu
interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  reportUrl: string;
  reportTitle: string;
}

function ShareMenu({ isOpen, onClose, reportUrl, reportTitle }: ShareMenuProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [reportUrl]);

  const handleShareTwitter = useCallback(() => {
    const text = encodeURIComponent(reportTitle);
    const url = encodeURIComponent(reportUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }, [reportTitle, reportUrl]);

  const handleShareFacebook = useCallback(() => {
    const url = encodeURIComponent(reportUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }, [reportUrl]);

  const handleShareWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${reportTitle} ${reportUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [reportTitle, reportUrl]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-surface-200 bg-white p-2 shadow-lg dark:border-surface-700 dark:bg-surface-800">
        <p className="mb-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">
          {t('common.share')}
        </p>

        <button
          onClick={handleCopyLink}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">{t('common.copied')}</span>
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              <span>{t('common.copy_link')}</span>
            </>
          )}
        </button>

        <div className="my-2 border-t border-surface-200 dark:border-surface-700" />

        <button
          onClick={handleShareTwitter}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
        >
          <Twitter className="h-4 w-4 text-[#1DA1F2]" />
          <span>{t('common.share_twitter')}</span>
        </button>

        <button
          onClick={handleShareFacebook}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
        >
          <Facebook className="h-4 w-4 text-[#4267B2]" />
          <span>{t('common.share_facebook')}</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          <span>{t('common.share_whatsapp')}</span>
        </button>
      </div>
    </>
  );
}

// Delete confirmation dialog
interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function DeleteDialog({ isOpen, onClose, onConfirm, isLoading }: DeleteDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">
            {t('common.confirm')}
          </h3>
          <p className="mb-6 text-surface-500 dark:text-surface-400">
            {t('reports.delete_confirm')}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? t('common.loading') : t('common.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Verification action buttons
interface VerificationActionsProps {
  reportId: string;
  onVerify: () => void;
  onReject: (reason: string) => void;
  isLoading: boolean;
}

function VerificationActions({ reportId, onVerify, onReject, isLoading }: VerificationActionsProps) {
  const { t } = useTranslation();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (!rejectReason.trim()) {
      setReasonError(t('verification.reason_required'));
      return;
    }

    onReject(rejectReason);
  };

  const handleCancelReject = () => {
    setShowRejectInput(false);
    setRejectReason('');
    setReasonError('');
  };

  if (showRejectInput) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              setReasonError('');
            }}
            placeholder={t('verification.reason_placeholder')}
            className={cn(reasonError && 'border-red-500')}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelReject}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {reasonError && (
          <p className="text-xs text-red-500">{reasonError}</p>
        )}
        <Button
          onClick={handleReject}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          <XCircle className="mr-2 h-4 w-4" />
          {t('verification.reject')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={onVerify}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {t('verification.verify')}
      </Button>
      <Button
        variant="outline"
        onClick={handleReject}
        disabled={isLoading}
        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <XCircle className="mr-2 h-4 w-4" />
        {t('verification.reject')}
      </Button>
    </div>
  );
}

export function ReportActions({
  report,
  isOwner,
  isVerifier,
  isPending,
  className,
}: ReportActionsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const verifyMutation = useVerificationVote();

  const reportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reports/${report.id}`
    : '';
  const reportTitle = `Traffic Violation Report #${report.shortId}`;

  const handleEdit = () => {
    router.push(`/reports/${report.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // In real app, call delete API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowDeleteDialog(false);
      router.push('/reports');
    } catch (error) {
      console.error('Failed to delete report:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerify = async () => {
    await verifyMutation.mutateAsync({
      reportId: report.id,
      vote: 'up',
    });
    router.refresh();
  };

  const handleReject = async (reason: string) => {
    await verifyMutation.mutateAsync({
      reportId: report.id,
      vote: 'down',
      reason,
    });
    router.refresh();
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Share button (always shown) */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowShareMenu(!showShareMenu)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {t('common.share')}
        </Button>
        <ShareMenu
          isOpen={showShareMenu}
          onClose={() => setShowShareMenu(false)}
          reportUrl={reportUrl}
          reportTitle={reportTitle}
        />
      </div>

      {/* Owner actions (Edit/Delete) - only shown if owner and pending */}
      {isOwner && isPending && (
        <>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('common.delete')}
          </Button>
        </>
      )}

      {/* Verifier actions (Verify/Reject) - only shown if verifier and pending */}
      {isVerifier && isPending && !isOwner && (
        <VerificationActions
          reportId={report.id}
          onVerify={handleVerify}
          onReject={handleReject}
          isLoading={verifyMutation.isPending}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ReportActions;
