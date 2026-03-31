'use client';

import { useCallback, useMemo } from 'react';
import en from '@/i18n/messages/en.json';
import es from '@/i18n/messages/es.json';
import { useLanguage } from '@/contexts/language-context';

type Messages = typeof en;
type MessageKey = string;

const messages: Record<string, Messages> = { en, es };

/**
 * Get a nested value from an object using a dot-separated path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path; // Return the key as fallback
    }
  }

  return typeof value === 'string' ? value : path;
}

/**
 * Hook for accessing translations
 *
 * Uses the global language context by default.
 *
 * @param overrideLocale - Optional locale to override the context (defaults to context locale)
 * @returns Object with translation function and locale info
 *
 * @example
 * ```tsx
 * const { t, locale } = useTranslation();
 *
 * // Simple usage
 * t('common.login') // "Iniciar Sesion" (if locale is 'es')
 *
 * // Nested keys
 * t('reports.vehicle_plate') // "Placa del Vehiculo"
 * ```
 */
export function useTranslation(overrideLocale?: string) {
  // Try to get locale from context, fall back to override or 'en'
  let contextLocale = 'en';
  try {
    const { locale } = useLanguage();
    contextLocale = locale;
  } catch {
    // Context not available, use fallback
  }

  const locale = overrideLocale || contextLocale;
  // Ensure we have a valid locale, fallback to 'en'
  const validLocale = locale in messages ? locale : 'en';
  const currentMessages = messages[validLocale];

  /**
   * Translate a key to the current locale
   *
   * @param key - Dot-separated key path (e.g., 'common.login')
   * @returns Translated string or the key if not found
   */
  const t = useCallback(
    (key: MessageKey): string => {
      return getNestedValue(currentMessages as unknown as Record<string, unknown>, key);
    },
    [currentMessages]
  );

  /**
   * Translate with interpolation
   *
   * @param key - Dot-separated key path
   * @param params - Object with values to interpolate
   * @returns Translated string with interpolated values
   *
   * @example
   * ```tsx
   * // If translation is "Hello, {name}!"
   * tParams('greeting', { name: 'John' }) // "Hello, John!"
   * ```
   */
  const tParams = useCallback(
    (key: MessageKey, params: Record<string, string | number>): string => {
      let result = getNestedValue(currentMessages as unknown as Record<string, unknown>, key);

      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });

      return result;
    },
    [currentMessages]
  );

  /**
   * Check if a translation key exists
   *
   * @param key - Dot-separated key path
   * @returns Boolean indicating if the key exists
   */
  const hasKey = useCallback(
    (key: MessageKey): boolean => {
      const value = getNestedValue(currentMessages as unknown as Record<string, unknown>, key);
      return value !== key;
    },
    [currentMessages]
  );

  return useMemo(
    () => ({
      t,
      tParams,
      hasKey,
      locale: validLocale,
      availableLocales: Object.keys(messages),
    }),
    [t, tParams, hasKey, validLocale]
  );
}

/**
 * Get translations for server components (non-hook version)
 *
 * @param locale - The locale to use
 * @returns Translation function
 */
export function getTranslations(locale: string = 'en') {
  const validLocale = locale in messages ? locale : 'en';
  const currentMessages = messages[validLocale];

  return (key: MessageKey): string => {
    return getNestedValue(currentMessages as unknown as Record<string, unknown>, key);
  };
}

/**
 * Type helper for getting available translation keys
 * This helps with autocomplete in IDEs
 */
export type TranslationKey =
  | `common.${keyof Messages['common']}`
  | `home.${keyof Messages['home']}`
  | `auth.${keyof Messages['auth']}`
  | `reports.${keyof Messages['reports']}`
  | `verification.${keyof Messages['verification']}`
  | `profile.${keyof Messages['profile']}`
  | `wallet.${keyof Messages['wallet']}`
  | `navigation.${keyof Messages['navigation']}`
  | `errors.${keyof Messages['errors']}`;

export default useTranslation;
