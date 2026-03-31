"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement profile update logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {t('profile_page.title')}
        </h1>
        <p className="mt-1 text-surface-600 dark:text-surface-300">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {t('profile.personal_info')}
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            {t('profile.personal_info_subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                <span className="text-2xl font-medium text-brand-500">JD</span>
              </div>
              <div>
                <Button variant="outline" size="sm" type="button">
                  {t('profile.change_avatar')}
                </Button>
                <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
                  {t('profile.avatar_hint')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('auth.first_name')}
                type="text"
                name="firstName"
                defaultValue="John"
              />
              <Input
                label={t('auth.last_name')}
                type="text"
                name="lastName"
                defaultValue="Doe"
              />
            </div>

            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              defaultValue="john@example.com"
            />

            <Input
              label={t('profile.phone')}
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
            />

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                {t('profile.save_changes')}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {t('profile.password')}
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            {t('profile.password_subtitle')}
          </p>

          <form className="mt-6 space-y-6">
            <Input
              label={t('profile.current_password')}
              type="password"
              name="currentPassword"
            />

            <Input
              label={t('profile.new_password')}
              type="password"
              name="newPassword"
            />

            <Input
              label={t('profile.confirm_new_password')}
              type="password"
              name="confirmPassword"
            />

            <div className="flex justify-end">
              <Button type="submit">{t('profile.update_password')}</Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-danger-200 dark:border-danger-800">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-danger">{t('profile.danger_zone')}</h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            {t('profile.danger_zone_subtitle')}
          </p>

          <div className="mt-6">
            <Button variant="ghost" className="text-danger hover:bg-danger-50 hover:text-danger dark:hover:bg-danger-900/20">
              {t('profile.delete_account')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
