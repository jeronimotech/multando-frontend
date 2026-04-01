'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import {
  Code2,
  Terminal,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Smartphone,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Braces,
  Puzzle,
  Wifi,
  Key,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// SDK options
const SDKS = [
  { id: 'flutter', name: 'Flutter', icon: '🐦', lang: 'dart', install: 'flutter pub add multando_sdk', color: 'bg-blue-500' },
  { id: 'react-native', name: 'React Native', icon: '⚛️', lang: 'tsx', install: 'npm install @multando/react-native-sdk', color: 'bg-cyan-500' },
  { id: 'ios', name: 'iOS (Swift)', icon: '🍎', lang: 'swift', install: '.package(url: "https://github.com/multando/ios-sdk", from: "1.0.0")', color: 'bg-surface-800' },
  { id: 'android', name: 'Android (Kotlin)', icon: '🤖', lang: 'kotlin', install: 'implementation("com.multando:sdk:1.0.0")', color: 'bg-green-600' },
] as const;

// Code examples per SDK
const CODE_EXAMPLES: Record<string, Record<string, string>> = {
  flutter: {
    init: `import 'package:multando_sdk/multando_sdk.dart';

final client = MultandoClient.initialize(
  MultandoConfig(
    baseUrl: 'https://api.multando.com/api/v1',
    locale: 'en',
  ),
);

// Login
await client.auth.login('user@example.com', 'password');`,
    report: `// Create a report
final report = await client.reports.create(
  ReportCreate(
    infractionId: 5,
    incidentDatetime: DateTime.now(),
    location: LocationData(
      lat: 18.4861,
      lon: -69.9312,
      address: 'Av. Winston Churchill',
    ),
    vehiclePlate: 'A123456',
  ),
);

print('Report created: \${report.shortId}');`,
    ui: `// Drop-in report form widget
MultandoProvider(
  client: client,
  child: ReportForm(
    onReportCreated: (report) {
      print('Created: \${report.shortId}');
    },
    locale: 'es',
  ),
)`,
  },
  'react-native': {
    init: `import { MultandoProvider, useMultando } from '@multando/react-native-sdk';

// Wrap your app
<MultandoProvider config={{
  baseUrl: 'https://api.multando.com/api/v1',
  locale: 'en',
}}>
  <App />
</MultandoProvider>

// In any component
const { auth, reports } = useMultando();
await auth.login('user@example.com', 'password');`,
    report: `import { useReports } from '@multando/react-native-sdk';

function MyComponent() {
  const { create, list, isLoading } = useReports();

  const handleSubmit = async () => {
    const report = await create({
      infractionId: 5,
      incidentDatetime: new Date().toISOString(),
      location: { lat: 18.4861, lon: -69.9312 },
      vehiclePlate: 'A123456',
    });
    console.log('Created:', report.shortId);
  };
}`,
    ui: `import { ReportForm } from '@multando/react-native-sdk';

// Drop-in report form component
<ReportForm
  onSuccess={(report) => navigation.goBack()}
  locale="es"
/>`,
  },
  ios: {
    init: `import MultandoSDK

// Initialize
let client = MultandoSDK.initialize(config: .init(
    baseURL: "https://api.multando.com/api/v1",
    locale: .en
))

// Login
try await client.auth.login(
    email: "user@example.com",
    password: "password"
)`,
    report: `// Create a report
let report = try await client.reports.create(.init(
    infractionId: 5,
    incidentDatetime: Date(),
    location: .init(
        lat: 18.4861,
        lon: -69.9312,
        address: "Av. Winston Churchill"
    ),
    vehiclePlate: "A123456"
))

print("Report: \\(report.shortId)")`,
    ui: `// SwiftUI drop-in view
ReportFormView(client: client) { report in
    print("Created: \\(report.shortId)")
}
.navigationTitle("Report Infraction")`,
  },
  android: {
    init: `import com.multando.sdk.MultandoSDK
import com.multando.sdk.core.MultandoConfig

// Initialize in Application.onCreate
MultandoSDK.initialize(
    context = this,
    config = MultandoConfig(
        baseUrl = "https://api.multando.com/api/v1",
        locale = "en"
    )
)

// Login
MultandoSDK.auth.login("user@example.com", "password")`,
    report: `// Create a report
val report = MultandoSDK.reports.create(
    ReportCreate(
        infractionId = 5,
        incidentDatetime = Instant.now().toString(),
        location = LocationData(
            lat = 18.4861,
            lon = -69.9312,
            address = "Av. Winston Churchill"
        ),
        vehiclePlate = "A123456"
    )
)

println("Report: \${report.shortId}")`,
    ui: `// Jetpack Compose drop-in screen
@Composable
fun MyScreen() {
    MultandoTheme {
        ReportFormScreen(
            onReportCreated = { report ->
                // Handle success
            }
        )
    }
}`,
  },
};

// API endpoints reference
const API_SECTIONS = [
  {
    title: 'Authentication',
    icon: Key,
    endpoints: [
      { method: 'POST', path: '/auth/register', desc: 'Register a new user' },
      { method: 'POST', path: '/auth/login', desc: 'Login and get JWT tokens' },
      { method: 'POST', path: '/auth/refresh', desc: 'Refresh access token' },
      { method: 'GET', path: '/auth/me', desc: 'Get current user profile', auth: true },
      { method: 'POST', path: '/auth/link-wallet', desc: 'Link Solana wallet', auth: true },
    ],
  },
  {
    title: 'Reports',
    icon: FileText,
    endpoints: [
      { method: 'POST', path: '/reports', desc: 'Create an infraction report', auth: true },
      { method: 'GET', path: '/reports', desc: 'List reports (paginated, filterable)' },
      { method: 'GET', path: '/reports/{id}', desc: 'Get report detail by ID or short_id' },
      { method: 'GET', path: '/reports/by-plate/{plate}', desc: 'Reports by vehicle plate' },
      { method: 'DELETE', path: '/reports/{id}', desc: 'Delete a pending report', auth: true },
    ],
  },
  {
    title: 'Evidence',
    icon: Smartphone,
    endpoints: [
      { method: 'POST', path: '/uploads/presign', desc: 'Get presigned upload URL', auth: true },
      { method: 'POST', path: '/reports/{id}/evidence', desc: 'Attach evidence to report', auth: true },
    ],
  },
  {
    title: 'Reference Data',
    icon: BookOpen,
    endpoints: [
      { method: 'GET', path: '/infractions', desc: 'List all infraction types' },
      { method: 'GET', path: '/vehicle-types', desc: 'List all vehicle types' },
    ],
  },
  {
    title: 'Verification',
    icon: Shield,
    endpoints: [
      { method: 'POST', path: '/verification/{id}/verify', desc: 'Verify a report', auth: true },
      { method: 'POST', path: '/verification/{id}/reject', desc: 'Reject a report', auth: true },
      { method: 'GET', path: '/verification/queue', desc: 'Get verification queue', auth: true },
    ],
  },
  {
    title: 'Blockchain',
    icon: Zap,
    endpoints: [
      { method: 'GET', path: '/blockchain/balance', desc: 'Get MULTA token balance', auth: true },
      { method: 'POST', path: '/blockchain/stake', desc: 'Stake tokens', auth: true },
      { method: 'POST', path: '/blockchain/unstake', desc: 'Unstake tokens', auth: true },
      { method: 'GET', path: '/blockchain/staking-info', desc: 'Get staking APY and info' },
      { method: 'POST', path: '/blockchain/claim-rewards', desc: 'Claim staking rewards', auth: true },
    ],
  },
];

const FEATURES = [
  { icon: Zap, titleKey: 'developers.feature_3line', descKey: 'developers.feature_3line_desc' },
  { icon: Puzzle, titleKey: 'developers.feature_dropin', descKey: 'developers.feature_dropin_desc' },
  { icon: Wifi, titleKey: 'developers.feature_offline', descKey: 'developers.feature_offline_desc' },
  { icon: Shield, titleKey: 'developers.feature_auth', descKey: 'developers.feature_auth_desc' },
  { icon: Globe, titleKey: 'developers.feature_i18n', descKey: 'developers.feature_i18n_desc' },
  { icon: Braces, titleKey: 'developers.feature_types', descKey: 'developers.feature_types_desc' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-success-100 text-success-700',
  POST: 'bg-brand-100 text-brand-700',
  PUT: 'bg-warning-100 text-warning-700',
  DELETE: 'bg-danger-100 text-danger-700',
};

export default function DevelopersPage() {
  const { t } = useTranslation();
  const [activeSDK, setActiveSDK] = useState<string>('react-native');
  const [activeExample, setActiveExample] = useState<string>('init');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('Reports');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentSDK = SDKS.find((s) => s.id === activeSDK)!;
  const currentExamples = CODE_EXAMPLES[activeSDK];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-900 to-surface-800 py-20 sm:py-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="container-app relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
                <Terminal className="h-4 w-4" />
                {t('developers.developer_portal')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {t('developers.title')}
              </h1>
              <p className="mt-6 text-lg text-surface-300">
                {t('developers.subtitle')}
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  leftIcon={<Code2 className="h-5 w-5" />}
                  onClick={() =>
                    document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  {t('developers.quick_start')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-surface-600 text-white hover:bg-surface-700"
                  leftIcon={<BookOpen className="h-5 w-5" />}
                  onClick={() =>
                    document.getElementById('api-reference')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  {t('developers.api_reference')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="border-b border-surface-200 bg-white py-16 dark:border-surface-700 dark:bg-surface-900">
          <div className="container-app">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.titleKey} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/30">
                    <f.icon className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{t(f.titleKey)}</h3>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{t(f.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="py-20 bg-surface-50 dark:bg-surface-800">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
                {t('developers.quick_start')}
              </h2>
              <p className="mt-3 text-surface-500 dark:text-surface-400">
                {t('developers.choose_platform')}
              </p>
            </div>

            {/* SDK Selector */}
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {SDKS.map((sdk) => (
                <button
                  key={sdk.id}
                  onClick={() => {
                    setActiveSDK(sdk.id);
                    setActiveExample('init');
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all',
                    activeSDK === sdk.id
                      ? 'bg-surface-900 text-white shadow-lg dark:bg-white dark:text-surface-900'
                      : 'bg-white text-surface-600 hover:bg-surface-100 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
                  )}
                >
                  <span className="text-lg">{sdk.icon}</span>
                  {sdk.name}
                </button>
              ))}
            </div>

            {/* Install command */}
            <div className="mx-auto max-w-2xl mb-8">
              <div className="flex items-center gap-2 rounded-xl bg-surface-900 p-4 dark:bg-surface-950">
                <Terminal className="h-4 w-4 shrink-0 text-surface-400" />
                <code className="flex-1 overflow-x-auto text-sm text-surface-200">
                  {currentSDK.install}
                </code>
                <button
                  onClick={() => copyToClipboard(currentSDK.install, 'install')}
                  className="shrink-0 rounded p-1 text-surface-400 hover:text-white"
                >
                  {copiedId === 'install' ? (
                    <Check className="h-4 w-4 text-success-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Code example tabs */}
            <div className="mx-auto max-w-3xl">
              <div className="flex gap-1 rounded-t-xl bg-surface-800 p-1 dark:bg-surface-950">
                {[
                  { id: 'init', labelKey: 'developers.step_initialize' },
                  { id: 'report', labelKey: 'developers.step_create_report' },
                  { id: 'ui', labelKey: 'developers.step_ui_component' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveExample(tab.id)}
                    className={cn(
                      'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      activeExample === tab.id
                        ? 'bg-surface-700 text-white'
                        : 'text-surface-400 hover:text-surface-200'
                    )}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
              <div className="relative rounded-b-xl bg-surface-900 p-6 dark:bg-surface-950">
                <button
                  onClick={() =>
                    copyToClipboard(currentExamples[activeExample], `code-${activeExample}`)
                  }
                  className="absolute right-4 top-4 rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-white"
                >
                  {copiedId === `code-${activeExample}` ? (
                    <Check className="h-4 w-4 text-success-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre className="overflow-x-auto text-sm leading-relaxed text-surface-200">
                  <code>{currentExamples[activeExample]}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="py-20 bg-white dark:bg-surface-900">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
                {t('developers.api_reference')}
              </h2>
              <p className="mt-3 text-surface-500 dark:text-surface-400">
                {t('developers.base_url')}: <code className="rounded bg-surface-100 px-2 py-0.5 font-mono text-sm text-brand-600 dark:bg-surface-800 dark:text-brand-400">https://api.multando.com/api/v1</code>
              </p>
              <p className="mt-2">
                <a
                  href="/docs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                  {t('developers.full_docs')} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-3">
              {API_SECTIONS.map((section) => {
                const isExpanded = expandedSection === section.title;
                return (
                  <div
                    key={section.title}
                    className="rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800"
                  >
                    <button
                      onClick={() =>
                        setExpandedSection(isExpanded ? null : section.title)
                      }
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-50 dark:bg-surface-700">
                        <section.icon className="h-5 w-5 text-brand-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-900 dark:text-white">
                          {section.title}
                        </h3>
                        <p className="text-xs text-surface-500">
                          {section.endpoints.length} {t('developers.endpoints')}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-surface-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-surface-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-surface-100 dark:border-surface-700">
                        {section.endpoints.map((ep) => (
                          <div
                            key={`${ep.method}-${ep.path}`}
                            className="flex items-center gap-3 border-b border-surface-50 px-4 py-3 last:border-0 dark:border-surface-700/50"
                          >
                            <span
                              className={cn(
                                'inline-flex w-16 items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                                METHOD_COLORS[ep.method]
                              )}
                            >
                              {ep.method}
                            </span>
                            <code className="flex-1 font-mono text-sm text-surface-700 dark:text-surface-300">
                              {ep.path}
                            </code>
                            {ep.auth && (
                              <span className="flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-medium text-warning-700 dark:bg-warning-950 dark:text-warning-300">
                                <Key className="h-2.5 w-2.5" />
                                Auth
                              </span>
                            )}
                            <span className="hidden text-xs text-surface-500 sm:block">
                              {ep.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Environments Section */}
        <section className="py-20 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
                {t('developers.environments_title')}
              </h2>
              <p className="mt-3 text-surface-500 dark:text-surface-400">
                {t('developers.environments_desc')}
              </p>
            </div>

            <div className="mx-auto max-w-3xl grid gap-6 sm:grid-cols-2">
              {/* Sandbox */}
              <div className="rounded-xl border-2 border-accent-300 bg-accent-50/50 p-6 dark:border-accent-700 dark:bg-accent-950/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900/30">
                    <span className="text-lg">🧪</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 dark:text-white">{t('developers.sandbox_title')}</h3>
                    <p className="text-xs text-accent-600 dark:text-accent-400">{t('developers.sandbox_label')}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-1">{t('developers.base_url')}</p>
                    <code className="block rounded-lg bg-surface-900 px-3 py-2 font-mono text-xs text-accent-300">
                      https://sandbox-api.multando.com/api/v1
                    </code>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-1">{t('developers.api_key_format')}</p>
                    <code className="block rounded-lg bg-surface-900 px-3 py-2 font-mono text-xs text-accent-300">
                      mult_test_xxxxxxxxxxxxxxxx
                    </code>
                  </div>
                  <ul className="space-y-1 text-surface-600 dark:text-surface-400">
                    <li className="flex items-center gap-2"><span className="text-accent-500">●</span> {t('developers.sandbox_feature1')}</li>
                    <li className="flex items-center gap-2"><span className="text-accent-500">●</span> {t('developers.sandbox_feature2')}</li>
                    <li className="flex items-center gap-2"><span className="text-accent-500">●</span> {t('developers.sandbox_feature3')}</li>
                  </ul>
                </div>
              </div>

              {/* Production */}
              <div className="rounded-xl border-2 border-brand-300 bg-brand-50/50 p-6 dark:border-brand-700 dark:bg-brand-950/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
                    <span className="text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 dark:text-white">{t('developers.production_title')}</h3>
                    <p className="text-xs text-brand-600 dark:text-brand-400">{t('developers.production_label')}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-1">{t('developers.base_url')}</p>
                    <code className="block rounded-lg bg-surface-900 px-3 py-2 font-mono text-xs text-brand-300">
                      https://api.multando.com/api/v1
                    </code>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-1">{t('developers.api_key_format')}</p>
                    <code className="block rounded-lg bg-surface-900 px-3 py-2 font-mono text-xs text-brand-300">
                      mult_live_xxxxxxxxxxxxxxxx
                    </code>
                  </div>
                  <ul className="space-y-1 text-surface-600 dark:text-surface-400">
                    <li className="flex items-center gap-2"><span className="text-brand-500">●</span> {t('developers.production_feature1')}</li>
                    <li className="flex items-center gap-2"><span className="text-brand-500">●</span> {t('developers.production_feature2')}</li>
                    <li className="flex items-center gap-2"><span className="text-brand-500">●</span> {t('developers.production_feature3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 mx-auto max-w-3xl rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-950/30">
              <p className="text-sm text-warning-800 dark:text-warning-200 text-center">
                <strong>⚠️ {t('developers.env_warning_title')}</strong> — {t('developers.env_warning_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Architecture diagram */}
        <section className="py-20 bg-surface-50 dark:bg-surface-800">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
                {t('developers.how_it_works')}
              </h2>
              <p className="mt-3 text-surface-500 dark:text-surface-400">
                {t('developers.how_it_works_desc')}
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-4 sm:grid-cols-5">
                {[
                  { step: '1', labelKey: 'developers.your_app', sublabelKey: 'developers.sdk_integration', icon: Smartphone, color: 'bg-brand-500' },
                  { step: '', labelKey: '', sublabelKey: '', icon: ArrowRight, color: '', isArrow: true },
                  { step: '2', labelKey: 'developers.multando_api', sublabelKey: 'developers.validation_storage', icon: Globe, color: 'bg-success-500' },
                  { step: '', labelKey: '', sublabelKey: '', icon: ArrowRight, color: '', isArrow: true },
                  { step: '3', labelKey: 'developers.community', sublabelKey: 'developers.verification_rewards', icon: Shield, color: 'bg-accent-500' },
                ].map((item, i) =>
                  item.isArrow ? (
                    <div
                      key={i}
                      className="hidden items-center justify-center sm:flex"
                    >
                      <ArrowRight className="h-6 w-6 text-surface-300" />
                    </div>
                  ) : (
                    <Card key={i} variant="interactive" className="p-5 text-center">
                      <div
                        className={cn(
                          'mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white',
                          item.color
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <p className="mt-3 font-semibold text-surface-900 dark:text-white">
                        {t(item.labelKey)}
                      </p>
                      <p className="mt-1 text-xs text-surface-500">{t(item.sublabelKey)}</p>
                    </Card>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
          <div className="container-app text-center">
            <h2 className="text-3xl font-bold text-white">
              {t('developers.ready_integrate')}
            </h2>
            <p className="mt-3 text-brand-100">
              {t('developers.get_api_key_desc')}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-brand-600 hover:bg-brand-50"
                >
                  {t('developers.get_api_key')}
                </Button>
              </Link>
              <a
                href="https://github.com/multando"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  {t('developers.github')}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
