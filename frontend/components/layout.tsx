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

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Leaf },
    { path: '/voice-assistant', label: 'Voice', icon: Mic },
    { path: '/weather', label: 'Weather', icon: Cloud },
    { path: '/crops', label: 'Crops', icon: Sprout },
    { path: '/alerts', label: 'Alerts', icon: AlertCircle },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Simplified to avoid double-bar look */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">Kisaan Sahayak</span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs opacity-80">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-2 bg-white/10 hover:bg-white/20 text-white border-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xs:inline">Log out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 mb-20">
        {children}
      </main>

      {/* Bottom Navigation - Fixed at bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/10' : ''}`} />
                  <span className="text-[10px] mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}