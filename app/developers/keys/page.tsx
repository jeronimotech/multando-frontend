'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/use-api-keys';
import type { CreateApiKeyRequest } from '@/hooks/use-api-keys';
import {
  Key,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Loader2,
} from 'lucide-react';

const ALL_SCOPES = [
  'reports:create',
  'reports:read',
  'infractions:read',
  'users:read',
  'balance:read',
];

const EXPIRATION_OPTIONS = [
  { value: '30', labelKey: 'api_keys.expires_30' },
  { value: '90', labelKey: 'api_keys.expires_90' },
  { value: '365', labelKey: 'api_keys.expires_365' },
  { value: 'never', labelKey: 'api_keys.expires_never' },
];

export default function ApiKeysPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const [showForm, setShowForm] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEnv, setFormEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [formScopes, setFormScopes] = useState<string[]>([...ALL_SCOPES]);
  const [formRateLimit, setFormRateLimit] = useState(60);
  const [formExpires, setFormExpires] = useState('90');

  const keys = data?.items ?? [];

  const handleCreate = async () => {
    if (!formName.trim()) return;

    const payload: CreateApiKeyRequest = {
      name: formName.trim(),
      environment: formEnv,
      scopes: formScopes,
      rate_limit: formRateLimit,
      expires_in_days: formExpires === 'never' ? null : Number(formExpires),
    };

    try {
      const result = await createMutation.mutateAsync(payload);
      setCreatedKey(result.key);
      setShowForm(false);
      // Reset form
      setFormName('');
      setFormEnv('sandbox');
      setFormScopes([...ALL_SCOPES]);
      setFormRateLimit(60);
      setFormExpires('90');
    } catch {
      // Error is available via createMutation.error
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeMutation.mutateAsync(id);
      setRevokeConfirmId(null);
    } catch {
      // Error is available via revokeMutation.error
    }
  };

  const toggleScope = (scope: string) => {
    setFormScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const copyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-surface-50 py-12 dark:bg-surface-800">
        <div className="container-app max-w-4xl">
          {/* Back link */}
          <Link
            href="/developers"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('navigation.developers')}
          </Link>

          {/* Page header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                {t('api_keys.title')}
              </h1>
              <p className="mt-1 text-surface-500 dark:text-surface-400">
                {t('api_keys.subtitle')}
              </p>
            </div>
            {!showForm && !createdKey && (
              <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="h-4 w-4" />}>
                {t('api_keys.create_new')}
              </Button>
            )}
          </div>

          {/* Created key alert */}
          {createdKey && (
            <div className="mb-8 rounded-xl border-2 border-warning-300 bg-warning-50 p-6 dark:border-warning-600 dark:bg-warning-950/30">
              <div className="mb-3 flex items-center gap-2 text-warning-700 dark:text-warning-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t('api_keys.key_created')}</h3>
              </div>
              <p className="mb-4 text-sm text-warning-600 dark:text-warning-400">
                {t('api_keys.key_warning')}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-lg bg-surface-900 px-4 py-3 font-mono text-sm text-green-400">
                  {createdKey}
                </code>
                <Button variant="outline" size="sm" onClick={copyKey}>
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1.5">
                    {copied ? t('api_keys.copied') : t('api_keys.copy')}
                  </span>
                </Button>
              </div>
              <button
                className="mt-4 text-sm text-surface-500 underline hover:text-surface-700 dark:text-surface-400"
                onClick={() => setCreatedKey(null)}
              >
                {t('common.close')}
              </button>
            </div>
          )}

          {/* Create form */}
          {showForm && (
            <div className="mb-8 rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900">
              <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">
                {t('api_keys.create_new')}
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('api_keys.form_name')}
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={t('api_keys.form_name_placeholder')}
                    className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
                  />
                </div>

                {/* Environment */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('api_keys.form_environment')}
                  </label>
                  <select
                    value={formEnv}
                    onChange={(e) => setFormEnv(e.target.value as 'sandbox' | 'production')}
                    className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                {/* Scopes */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('api_keys.form_scopes')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SCOPES.map((scope) => (
                      <label
                        key={scope}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-surface-200 bg-surface-50 px-3 py-1.5 text-sm transition-colors hover:border-brand-300 dark:border-surface-600 dark:bg-surface-800"
                      >
                        <input
                          type="checkbox"
                          checked={formScopes.includes(scope)}
                          onChange={() => toggleScope(scope)}
                          className="h-3.5 w-3.5 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="text-surface-700 dark:text-surface-300">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rate limit */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('api_keys.form_rate_limit')}
                  </label>
                  <input
                    type="number"
                    value={formRateLimit}
                    onChange={(e) => setFormRateLimit(Number(e.target.value))}
                    min={1}
                    max={1000}
                    className="w-32 rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                  />
                </div>

                {/* Expiration */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('api_keys.form_expires')}
                  </label>
                  <select
                    value={formExpires}
                    onChange={(e) => setFormExpires(e.target.value)}
                    className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                  >
                    {EXPIRATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleCreate}
                    disabled={!formName.trim() || formScopes.length === 0 || createMutation.isPending}
                  >
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('api_keys.create_button')}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>

                {createMutation.error && (
                  <p className="text-sm text-danger">
                    {(createMutation.error as any)?.message || t('common.error')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Keys table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-center dark:border-danger-800 dark:bg-danger-950/30">
              <p className="text-sm text-danger-700 dark:text-danger-400">
                {(error as any)?.message || t('common.error')}
              </p>
            </div>
          ) : keys.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-300 p-12 text-center dark:border-surface-600">
              <Key className="mx-auto mb-3 h-10 w-10 text-surface-400" />
              <p className="text-surface-500 dark:text-surface-400">{t('api_keys.no_keys')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-900">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800">
                    <th className="px-4 py-3 font-medium text-surface-600 dark:text-surface-400">
                      {t('api_keys.form_name')}
                    </th>
                    <th className="px-4 py-3 font-medium text-surface-600 dark:text-surface-400">
                      Prefix
                    </th>
                    <th className="hidden px-4 py-3 font-medium text-surface-600 dark:text-surface-400 md:table-cell">
                      {t('api_keys.form_scopes')}
                    </th>
                    <th className="hidden px-4 py-3 font-medium text-surface-600 dark:text-surface-400 lg:table-cell">
                      {t('api_keys.form_rate_limit')}
                    </th>
                    <th className="px-4 py-3 font-medium text-surface-600 dark:text-surface-400">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-surface-600 dark:text-surface-400" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {keys.map((apiKey) => (
                    <tr key={apiKey.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white">
                            {apiKey.name}
                          </p>
                          <p className="text-xs text-surface-400">
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-surface-100 px-2 py-0.5 font-mono text-xs dark:bg-surface-700">
                          {apiKey.key_prefix}...
                        </code>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {apiKey.scopes.map((scope) => (
                            <span
                              key={scope}
                              className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-surface-600 dark:text-surface-400 lg:table-cell">
                        {apiKey.rate_limit}/min
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            apiKey.is_active
                              ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                              : 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                          }`}
                        >
                          {apiKey.is_active ? t('api_keys.status_active') : t('api_keys.status_revoked')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {apiKey.is_active && (
                          <>
                            {revokeConfirmId === apiKey.id ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => handleRevoke(apiKey.id)}
                                  disabled={revokeMutation.isPending}
                                >
                                  {revokeMutation.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    t('common.confirm')
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setRevokeConfirmId(null)}
                                >
                                  {t('common.cancel')}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-surface-400 hover:text-danger"
                                onClick={() => setRevokeConfirmId(apiKey.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
