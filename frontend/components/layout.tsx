'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Leaf,
  Mic,
  Cloud,
  Sprout,
  AlertCircle,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import EmergencyAlertBanner from '@/components/EmergencyAlertBanner';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: t('home'), icon: Leaf },
    { path: '/voice-assistant', label: t('voice'), icon: Mic },
    { path: '/weather', label: t('weather'), icon: Cloud },
    { path: '/crops', label: t('crops'), icon: Sprout },
    { path: '/alerts', label: t('alerts'), icon: AlertCircle },
    { path: '/settings', label: t('settings'), icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Use window.location instead of router.push if your auth state 
      // is sticky; this forces a full clean state.
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Extract initials from user email for the avatar
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ═══════════════════════════════════════════════
          PREMIUM HEADER
          ═══════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 w-full gradient-primary text-white shadow-lg"
        style={{ animation: 'slideDown 0.4s ease-out' }}
      >
        {/* Subtle bottom border glow */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />

        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Leaf className="w-7 h-7 drop-shadow-md" />
              <div
                className="absolute -inset-1 rounded-full bg-white/10 blur-sm -z-10"
              />
            </div>
            <span className="text-xl font-bold tracking-tight drop-shadow-sm">
              Kisaan Sahayak
            </span>
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                {/* User avatar circle */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                               text-sm font-semibold text-white ring-1 ring-white/25
                               transition-all duration-300 hover:bg-white/30 hover:ring-white/40"
                  >
                    {userInitial}
                  </div>
                  <span className="hidden sm:inline-block text-xs text-white/75 font-medium max-w-[160px] truncate">
                    {user.email}
                  </span>
                </div>

                {/* Logout button */}
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-2 bg-white/10 hover:bg-white/25 text-white border border-white/10
                             hover:border-white/25 backdrop-blur-sm rounded-lg
                             transition-all duration-300 ease-out cursor-pointer
                             hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xs:inline">{t('logout')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Real-time Socket.IO Emergency Alerts Overlay */}
      <EmergencyAlertBanner />

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════ */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 pb-28">
        {children}
      </main>

      {/* ═══════════════════════════════════════════════
          PREMIUM BOTTOM NAVIGATION
          ═══════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        style={{ animation: 'slideUp 0.4s ease-out' }}
      >
        {/* Top edge glow line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Glassmorphism background */}
        <div className="backdrop-blur-xl bg-card/80 border-t border-border/50">
          <div className="max-w-6xl mx-auto px-2 py-2">
            <div className="flex justify-between items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                const isAlerts = item.path === '/alerts';

                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`
                      relative flex flex-col items-center justify-center
                      min-w-[56px] py-1.5 px-1 rounded-xl
                      transition-all duration-300 ease-out cursor-pointer
                      ${isActive
                        ? 'text-primary'
                        : 'text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground'
                      }
                    `}
                  >
                    {/* Icon wrapper */}
                    <div className="relative">
                      {/* Active background glow */}
                      {isActive && (
                        <div className="absolute -inset-2 rounded-xl bg-primary/8 blur-sm" />
                      )}

                      <Icon
                        className={`
                          relative w-[22px] h-[22px] transition-all duration-300
                          ${isActive
                            ? 'fill-primary/15 stroke-[2.5px] scale-110'
                            : 'stroke-[1.5px]'
                          }
                        `}
                      />

                      {/* Notification badge on Alerts */}
                      {isAlerts && (
                        <span className="notification-badge">3</span>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`
                        text-[10px] mt-1.5 leading-none transition-all duration-300
                        ${isActive ? 'font-bold' : 'font-medium'}
                      `}
                    >
                      {item.label}
                    </span>

                    {/* Active pill indicator */}
                    <div
                      className={`
                        mt-1 rounded-full bg-primary transition-all duration-300 ease-out
                        ${isActive
                          ? 'w-5 h-[3px] opacity-100'
                          : 'w-0 h-[3px] opacity-0'
                        }
                      `}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Inline keyframe for slideUp (nav entrance from bottom) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}