"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePendingVerification } from "@/hooks/use-reports";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Wallet,
  User,
  Bell,
  Menu,
  X,
  Trophy,
  LogOut,
  Settings,
  ChevronDown,
  Loader2,
} from "lucide-react";

const navigation = [
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "reports", href: "/reports", icon: FileText },
  { name: "verification", href: "/verify", icon: ShieldCheck, showBadge: true },
  { name: "achievements", href: "/achievements", icon: Trophy },
  { name: "wallet", href: "/wallet", icon: Wallet },
  { name: "profile", href: "/profile", icon: User },
];

// Bottom nav shows on mobile — subset of navigation
const mobileNav = [
  { name: "home", href: "/dashboard", icon: LayoutDashboard },
  { name: "reports", href: "/reports", icon: FileText },
  { name: "verify", href: "/verify", icon: ShieldCheck, showBadge: true },
  { name: "wallet", href: "/wallet", icon: Wallet },
  { name: "profile", href: "/profile", icon: User },
];

/**
 * Get user initials from first and last name
 */
function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "?";
}

/**
 * Get display name from user data
 */
function getUserDisplayName(firstName?: string, lastName?: string): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return "User";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { data: pendingReports } = usePendingVerification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pendingCount = pendingReports?.length || 0;

  // Client-side auth check (backup for middleware)
  if (!authLoading && !isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const userInitials = getUserInitials(user?.firstName, user?.lastName);
  const userDisplayName = getUserDisplayName(user?.firstName, user?.lastName);
  const userEmail = user?.email || "";

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-surface-200 px-6 dark:border-surface-700">
        <Link
          href="/"
          className="text-xl font-bold text-brand-500"
          onClick={() => setSidebarOpen(false)}
        >
          Multando
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col p-4">
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
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400"
                      : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{t(`navigation.${item.name}`)}</span>
                  {item.showBadge && pendingCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-semibold text-white">
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-surface-200 p-4 dark:border-surface-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {userInitials}
            </span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-surface-900 dark:text-white">
              {userDisplayName}
            </p>
            <p className="truncate text-xs text-surface-500 dark:text-surface-400">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: fixed, mobile: slide-in */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-surface-200 bg-white transition-transform duration-300 dark:border-surface-700 dark:bg-surface-800",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1 text-surface-400 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-700"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-surface-700 dark:bg-surface-800/80 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden dark:text-surface-300 dark:hover:bg-surface-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <Link
            href="/"
            className="text-lg font-bold text-brand-500 lg:hidden"
          >
            Multando
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
            </button>
            {/* User dropdown — desktop only */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                  <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                    {userInitials}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-surface-400" />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-surface-200 bg-white py-1 shadow-lg dark:border-surface-700 dark:bg-surface-800">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="my-1 border-t border-surface-100 dark:border-surface-700" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Skip navigation link */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* Page content */}
        <main id="main-content" className="p-4 pb-24 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:hidden dark:border-surface-700 dark:bg-surface-900/95">
        <div className="flex items-center justify-around px-2 py-1">
          {mobileNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-brand-500"
                    : "text-surface-400 dark:text-surface-500"
                )}
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      active && "text-brand-500"
                    )}
                  />
                  {item.showBadge && pendingCount > 0 && (
                    <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger-500 px-1 text-[8px] font-bold text-white">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
