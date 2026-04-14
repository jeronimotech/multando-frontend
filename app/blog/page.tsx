'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Newspaper, Sparkles } from 'lucide-react';

export default function BlogPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30">
                <Newspaper className="h-10 w-10 text-brand-500" />
              </div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-1.5 text-sm font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
                <Sparkles className="h-4 w-4" />
                {t('blog.badge')}
              </div>
              <h1 className="text-4xl font-bold text-surface-900 dark:text-white md:text-5xl">
                {t('blog.title')}
              </h1>
              <p className="mx-auto mt-5 text-lg text-surface-600 dark:text-surface-300">
                {t('blog.subtitle')}
              </p>

              {/* Email signup (visual only) */}
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 max-w-md"
              >
                <label
                  htmlFor="blog-email"
                  className="block text-left text-sm font-medium text-surface-700 dark:text-surface-300"
                >
                  {t('blog.signup_label')}
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="blog-email"
                    type="email"
                    required
                    disabled={submitted}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('blog.signup_placeholder')}
                    className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-60 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                  />
                  <Button type="submit" disabled={submitted}>
                    {submitted ? t('blog.signup_done') : t('blog.signup_submit')}
                  </Button>
                </div>
                <p className="mt-2 text-left text-xs text-surface-500 dark:text-surface-400">
                  {t('blog.signup_notice')}
                </p>
              </form>

              <div className="mt-10">
                <Link href="/">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t('blog.back_home')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
