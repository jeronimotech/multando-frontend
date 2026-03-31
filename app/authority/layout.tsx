"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthorityAuth } from "@/hooks/use-authority-auth";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  Copy,
  Menu,
  X,
  ChevronDown,
  Users,
  Webhook,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/authority/dashboard", icon: LayoutDashboard },
  { name: "Reports", href: "/authority/reports", icon: FileText },
  { name: "Analytics", href: "/authority/analytics", icon: BarChart3 },
  { name: "Staff", href: "/authority/staff", icon: Users },
  { name: "Webhooks", href: "/authority/webhooks", icon: Webhook },
  { name: "Settings", href: "/authority/settings", icon: Settings },
];

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { authority, isAuthenticated, isLoading, logout, maskedApiKey } =
    useAuthorityAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.includes("/authority/login")) {
      router.push("/authority/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (pathname.includes("/authority/login")) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-surface-600 dark:text-surface-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/authority/dashboard" && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — slate/navy authority scheme with gold accents */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-surface-200 bg-surface-900 transition-transform duration-300 dark:border-surface-700",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1 text-surface-400 hover:bg-surface-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Authority Branding */}
        <div className="flex h-16 items-center border-b border-surface-700 px-6">
          <Link href="/authority/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-surface-900">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white"><img src="/logo.png" alt="" className="h-6 w-6 inline mr-1" />
              Authority
            </span>
          </Link>
        </div>

        {/* Jurisdiction badge */}
        <div className="mx-4 mt-4 rounded-lg bg-surface-800 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">
            Jurisdiction
          </p>
          <p className="text-sm font-medium text-white">
            {authority?.jurisdiction || "Traffic Authority"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-1 flex-col px-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-surface-300 hover:bg-surface-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* API Key */}
        <div className="border-t border-surface-700 p-4">
          <div className="rounded-lg bg-surface-800 p-3">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-surface-400">
              API Key
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-surface-900 px-2 py-1 font-mono text-xs text-surface-300">
                {maskedApiKey}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(authority?.apiKey || "")}
                className="rounded p-1 text-surface-400 hover:bg-surface-700 hover:text-white"
                title="Copy API Key"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Authority Info & Logout */}
        <div className="border-t border-surface-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
              <span className="text-sm font-medium text-amber-400">
                {authority?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white">
                {authority?.name || "Authority"}
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded p-2 text-surface-400 hover:bg-surface-800 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-surface-700 dark:bg-surface-800/80 lg:px-6">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden dark:text-surface-300 dark:hover:bg-surface-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <h1 className="text-lg font-semibold text-surface-900 dark:text-white">
              {authority?.name || "Authority Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
