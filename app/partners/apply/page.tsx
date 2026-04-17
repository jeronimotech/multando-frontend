'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { usePartnerApply } from '@/hooks/use-partners';
import { CheckCircle2, Store } from 'lucide-react';

const CATEGORIES = [
  'Restaurant',
  'Retail',
  'Gym & Fitness',
  'Gas Station',
  'Services',
  'Fashion',
  'Other',
];

export default function PartnerApplyPage() {
  const { t } = useTranslation();
  const applyMutation = usePartnerApply();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(form);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <Store className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                  {t('partners.apply_form_title')}
                </h1>
              </div>

              {applyMutation.isSuccess ? (
                <div className="rounded-2xl border border-success-200 bg-success-50 p-8 text-center dark:border-success-900 dark:bg-success-900/20">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-lg font-semibold text-success-800 dark:text-success-300">
                    {t('partners.form_success')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      {t('partners.form_name')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      {t('partners.form_email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      {t('partners.form_phone')}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      {t('partners.form_category')}
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                    >
                      <option value="">{t('partners.form_category')}</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      {t('partners.form_description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? '...' : t('partners.form_submit')}
                  </Button>

                  {applyMutation.isError && (
                    <p className="text-center text-sm text-danger-600 dark:text-danger-400">
                      {(applyMutation.error as Error)?.message || 'Something went wrong'}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
