'use client';

import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full z-[60] mt-1 hidden w-40 rounded-lg border border-surface-200 bg-white py-1 shadow-lg group-hover:block dark:border-surface-700 dark:bg-surface-800">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
              locale === lang.code
                ? 'bg-brand-50 text-brand-500 dark:bg-brand-900/20'
                : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto text-brand-500">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
