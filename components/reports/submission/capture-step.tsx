'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReportForm } from '@/hooks/use-report-form';
import {
  Camera,
  Video,
  ImagePlus,
  X,
  Sparkles,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';

// Infraction categories for filtering
const CATEGORIES = ['All', 'Speed', 'Safety', 'Parking', 'Behavior'] as const;

// Placeholder infractions (would come from API)
const INFRACTIONS = [
  { code: 'SPD001', name: 'Speeding', category: 'Speed', icon: '🏎️', severity: 'high', points: 15, tokens: 10 },
  { code: 'DRK001', name: 'Drunk Driving', category: 'Safety', icon: '🍺', severity: 'critical', points: 25, tokens: 20 },
  { code: 'PRK001', name: 'Illegal Parking', category: 'Parking', icon: '🅿️', severity: 'low', points: 5, tokens: 3 },
  { code: 'RLT001', name: 'Running Red Light', category: 'Safety', icon: '🚦', severity: 'high', points: 20, tokens: 15 },
  { code: 'STP001', name: 'Running Stop Sign', category: 'Safety', icon: '🛑', severity: 'medium', points: 15, tokens: 10 },
  { code: 'LNE001', name: 'Illegal Lane Change', category: 'Behavior', icon: '↔️', severity: 'medium', points: 10, tokens: 8 },
  { code: 'PHN001', name: 'Phone While Driving', category: 'Safety', icon: '📱', severity: 'high', points: 15, tokens: 10 },
  { code: 'SBT001', name: 'No Seatbelt', category: 'Safety', icon: '🔒', severity: 'medium', points: 10, tokens: 5 },
  { code: 'HLM001', name: 'No Helmet', category: 'Safety', icon: '⛑️', severity: 'medium', points: 10, tokens: 8 },
  { code: 'OTH001', name: 'Other Infraction', category: 'Behavior', icon: '⚠️', severity: 'low', points: 5, tokens: 3 },
];

export function CaptureStep() {
  const {
    evidences,
    addEvidence,
    removeEvidence,
    infraction,
    setInfraction,
  } = useReportForm();

  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        if (evidences.length >= 5) return;
        const evidence = {
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        };
        addEvidence(evidence);
      });

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [evidences.length, addEvidence]
  );

  const filteredInfractions = INFRACTIONS.filter((inf) => {
    const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || inf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const severityColor = {
    low: 'text-success-600 bg-success-50',
    medium: 'text-warning-600 bg-warning-50',
    high: 'text-danger-600 bg-danger-50',
    critical: 'text-danger-700 bg-danger-100',
  };

  return (
    <div className="space-y-8">
      {/* Evidence capture section */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
          {t('report_capture.add_evidence')}
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
          {t('report_capture.add_evidence_desc')}
        </p>

        {/* Evidence preview grid */}
        {evidences.length > 0 && (
          <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
            {evidences.map((ev) => (
              <div
                key={ev.id}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700"
              >
                {ev.type === 'image' ? (
                  <img
                    src={ev.previewUrl}
                    alt="Evidence"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={ev.previewUrl}
                    className="h-full w-full object-cover"
                  />
                )}
                <button
                  onClick={() => removeEvidence(ev.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                  aria-label={t('report_capture.remove_evidence')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {ev === evidences[0] && (
                  <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded-full bg-brand-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                    <Sparkles className="h-2.5 w-2.5" />
                    {t('report_capture.ai_scan')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Capture buttons */}
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Camera className="h-5 w-5" />}
            onClick={() => fileInputRef.current?.click()}
            disabled={evidences.length >= 5}
          >
            {evidences.length === 0 ? t('report_capture.take_photo') : t('report_capture.add_more')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<ImagePlus className="h-5 w-5" />}
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
                fileInputRef.current.setAttribute('capture', 'environment');
              }
            }}
            disabled={evidences.length >= 5}
          >
            {t('report_capture.gallery')}
          </Button>
        </div>
        {evidences.length >= 5 && (
          <p className="mt-2 text-sm text-surface-500">{t('report_capture.max_files')}</p>
        )}
      </div>

      {/* Infraction selection */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
          {t('report_capture.what_violation')}
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
          {t('report_capture.select_violation')}
        </p>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder={t('report_capture.search_infractions')}
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category filter pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Infraction grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredInfractions.map((inf) => (
            <button
              key={inf.code}
              onClick={() =>
                setInfraction({
                  code: inf.code,
                  name: inf.name,
                  category: inf.category,
                  severity: inf.severity,
                  points: inf.points,
                  tokens: inf.tokens,
                } as any)
              }
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                infraction?.code === inf.code
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-950/30'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800'
              )}
            >
              <span className="text-2xl">{inf.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-surface-900 dark:text-white">
                  {inf.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                      severityColor[inf.severity as keyof typeof severityColor]
                    )}
                  >
                    {inf.severity}
                  </span>
                  <span className="text-xs text-surface-500">
                    +{inf.tokens} MULTA
                  </span>
                </div>
              </div>
              {infraction?.code === inf.code && (
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredInfractions.length === 0 && (
          <div className="py-8 text-center text-surface-500">
            {t('report_capture.no_results')}
          </div>
        )}
      </div>
    </div>
  );
}

