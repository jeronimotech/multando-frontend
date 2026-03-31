"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthorityAuth } from "@/hooks/use-authority-auth";

export default function AuthoritySettingsPage() {
  const { authority, maskedApiKey } = useAuthorityAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-sm text-surface-600 dark:text-surface-300">
          Manage your authority account and API settings
        </p>
      </div>

      {/* Authority Information */}
      <Card>
        <CardHeader>
          <CardTitle>Authority Information</CardTitle>
          <CardDescription>Your authority account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Authority Name
              </label>
              <Input value={authority?.name || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Jurisdiction
              </label>
              <Input value={authority?.jurisdiction || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Email
              </label>
              <Input value={authority?.email || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Account Created
              </label>
              <Input
                value={
                  authority?.createdAt
                    ? new Date(authority.createdAt).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            Your API key is used to authenticate requests to the Multando API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Current API Key
            </label>
            <div className="flex gap-2">
              <Input value={maskedApiKey} readOnly className="font-mono" />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(authority?.apiKey || "")}
              >
                Copy
              </Button>
            </div>
            <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
              Keep your API key secure. Do not share it publicly.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              To regenerate your API key, please contact the Multando administrator.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Receive daily report summaries via email
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-surface-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-surface-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-surface-700" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900 dark:text-white">High Priority Alerts</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Get instant alerts for critical violations
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-surface-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-surface-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-surface-700" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900 dark:text-white">Weekly Analytics</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Receive weekly analytics reports
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-surface-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-surface-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-surface-700" />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900 dark:text-white">
                Deactivate Authority Account
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                This will disable API access and remove dashboard access
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
