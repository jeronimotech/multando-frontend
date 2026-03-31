'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Shield, AlertTriangle, Mail, ExternalLink, Gift, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SecurityPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30">
                <Shield className="h-8 w-8 text-brand-500" />
              </div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                Security Policy
              </h1>
              <p className="mt-3 text-surface-500 dark:text-surface-400">
                How to report security vulnerabilities in the Multando platform
              </p>
            </div>

            <div className="space-y-8">
              {/* Scope */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-surface-900 dark:text-white">
                  Scope
                </h2>
                <p className="text-surface-600 dark:text-surface-300">
                  This security policy applies to all Multando services, including:
                </p>
                <ul className="mt-3 space-y-2 text-surface-600 dark:text-surface-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    Multando Web Application (multando.com)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    Multando API (api.multando.com)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    Multando Mobile SDKs (Flutter, React Native, iOS, Android)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    MULTA Rewards Smart Contract on Solana
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    WhatsApp Chatbot
                  </li>
                </ul>
              </section>

              {/* How to Report */}
              <Card className="border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-6 w-6 shrink-0 text-brand-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                        Reporting a Vulnerability
                      </h2>
                      <p className="mt-2 text-surface-600 dark:text-surface-300">
                        If you discover a security vulnerability, please report it responsibly:
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-surface-800">
                          <Mail className="h-5 w-5 text-brand-500" />
                          <div>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">Email</p>
                            <a href="mailto:security@multando.com" className="text-sm text-brand-500 hover:text-brand-600">
                              security@multando.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Include */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-surface-900 dark:text-white">
                  What to Include in Your Report
                </h2>
                <div className="space-y-3">
                  {[
                    'Description of the vulnerability and its potential impact',
                    'Steps to reproduce the issue',
                    'Affected component (web, API, mobile, smart contract, SDK)',
                    'Any proof-of-concept code or screenshots',
                    'Your contact information for follow-up',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-surface-600 dark:text-surface-300">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* Response Timeline */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-surface-900 dark:text-white">
                  <Clock className="mr-2 inline h-5 w-5" />
                  Response Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-300">Acknowledgment</span>
                    <span className="font-medium text-surface-900 dark:text-white">Within 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-300">Initial assessment</span>
                    <span className="font-medium text-surface-900 dark:text-white">Within 72 hours</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-300">Fix deployment</span>
                    <span className="font-medium text-surface-900 dark:text-white">Within 7-30 days</span>
                  </div>
                </div>
              </section>

              {/* Bug Bounty */}
              <Card className="border-accent-200 bg-accent-50/50 dark:border-accent-800 dark:bg-accent-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Gift className="mt-1 h-6 w-6 shrink-0 text-accent-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                        Bug Bounty Program
                      </h2>
                      <p className="mt-2 text-surface-600 dark:text-surface-300">
                        We offer MULTA token rewards for responsibly disclosed vulnerabilities:
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-white p-3 text-center dark:bg-surface-800">
                          <p className="text-lg font-bold text-danger-500">Critical</p>
                          <p className="text-sm text-surface-500">Up to 10,000 MULTA</p>
                        </div>
                        <div className="rounded-lg bg-white p-3 text-center dark:bg-surface-800">
                          <p className="text-lg font-bold text-warning-500">High</p>
                          <p className="text-sm text-surface-500">Up to 5,000 MULTA</p>
                        </div>
                        <div className="rounded-lg bg-white p-3 text-center dark:bg-surface-800">
                          <p className="text-lg font-bold text-brand-500">Medium</p>
                          <p className="text-sm text-surface-500">Up to 1,000 MULTA</p>
                        </div>
                        <div className="rounded-lg bg-white p-3 text-center dark:bg-surface-800">
                          <p className="text-lg font-bold text-surface-500">Low</p>
                          <p className="text-sm text-surface-500">Up to 250 MULTA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rules */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-surface-900 dark:text-white">
                  Responsible Disclosure Rules
                </h2>
                <div className="space-y-3 text-surface-600 dark:text-surface-300">
                  <p>Please <strong>DO NOT</strong>:</p>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Access or modify other users' data</li>
                    <li>Perform denial of service attacks</li>
                    <li>Send spam or social engineering attacks to our users</li>
                    <li>Publicly disclose the vulnerability before it's fixed</li>
                    <li>Use automated scanning tools without permission</li>
                  </ul>
                  <p className="mt-4">
                    We will not pursue legal action against researchers who follow these guidelines and report vulnerabilities responsibly.
                  </p>
                </div>
              </section>

              {/* Open Source */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-surface-900 dark:text-white">
                  Source Code
                </h2>
                <p className="text-surface-600 dark:text-surface-300">
                  Our SDKs and smart contract code are open source:
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="https://github.com/jeronimotech/multando-sdks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-500 hover:text-brand-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    github.com/jeronimotech/multando-sdks
                  </a>
                  <a
                    href="https://github.com/jeronimotech/multando-blockchain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-500 hover:text-brand-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    github.com/jeronimotech/multando-blockchain
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
