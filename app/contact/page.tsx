'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Briefcase, Newspaper, Handshake, Clock } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name || 'website'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:hola@multando.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1 py-16">
        <div className="container-app">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30">
                <MessageSquare className="h-8 w-8 text-brand-500" />
              </div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('contact.title')}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-surface-600 dark:text-surface-300">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Primary email card */}
              <div className="lg:col-span-2">
                <Card className="border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 h-6 w-6 shrink-0 text-brand-500" />
                      <div>
                        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                          {t('contact.email_main_title')}
                        </h2>
                        <a
                          href="mailto:hola@multando.com"
                          className="mt-2 inline-block text-xl font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                          hola@multando.com
                        </a>
                        <p className="mt-3 flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                          <Clock className="h-4 w-4" />
                          {t('contact.response_time')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Other emails */}
                <div className="mt-4 space-y-3">
                  <EmailRow
                    icon={<Briefcase className="h-5 w-5 text-brand-500" />}
                    label={t('contact.support_label')}
                    email="soporte@multando.com"
                  />
                  <EmailRow
                    icon={<Newspaper className="h-5 w-5 text-brand-500" />}
                    label={t('contact.press_label')}
                    email="prensa@multando.com"
                  />
                  <EmailRow
                    icon={<Handshake className="h-5 w-5 text-brand-500" />}
                    label={t('contact.partnerships_label')}
                    email="partners@multando.com"
                  />
                  <EmailRow
                    icon={<Mail className="h-5 w-5 text-brand-500" />}
                    label={t('contact.jobs_label')}
                    email="jobs@multando.com"
                  />
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <Card className="border-surface-200 dark:border-surface-700">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {t('contact.form_title')}
                    </h2>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                      {t('contact.form_subtitle')}
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-surface-700 dark:text-surface-300"
                        >
                          {t('contact.form_name')}
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-surface-700 dark:text-surface-300"
                        >
                          {t('contact.form_email')}
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-surface-700 dark:text-surface-300"
                        >
                          {t('contact.form_message')}
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={6}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {t('contact.form_notice')}
                        </p>
                        <Button type="submit">{t('contact.form_submit')}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmailRow({
  icon,
  label,
  email,
}: {
  icon: React.ReactNode;
  label: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
          {label}
        </p>
        <a
          href={`mailto:${email}`}
          className="text-sm font-medium text-surface-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
