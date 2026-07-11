'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sun,
  Droplets,
  Wind,
  Cloud,
  AlertCircle,
  TrendingUp,
  Sprout,
  Camera,
  Mic,
  ChevronRight,
  Calendar,
  Leaf,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/i18n'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const today = new Date()
    setFormattedDate(
      today.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  const stats = [
    {
      label: 'Temperature',
      value: '32°C',
      icon: Sun,
      trend: '↑ 2°',
      trendUp: true,
      color: 'text-orange-500',
      bgFrom: 'from-orange-500/20',
      bgTo: 'to-amber-500/10',
      iconBg: 'bg-orange-500/15',
    },
    {
      label: 'Humidity',
      value: '65%',
      icon: Droplets,
      trend: '↑ 5%',
      trendUp: true,
      color: 'text-blue-500',
      bgFrom: 'from-blue-500/20',
      bgTo: 'to-cyan-500/10',
      iconBg: 'bg-blue-500/15',
    },
    {
      label: 'Wind Speed',
      value: '12 km/h',
      icon: Wind,
      trend: '↓ 3',
      trendUp: false,
      color: 'text-teal-500',
      bgFrom: 'from-teal-500/20',
      bgTo: 'to-emerald-500/10',
      iconBg: 'bg-teal-500/15',
    },
    {
      label: 'Rainfall',
      value: '2.5 mm',
      icon: Cloud,
      trend: '↑ 1.2',
      trendUp: true,
      color: 'text-indigo-500',
      bgFrom: 'from-indigo-500/20',
      bgTo: 'to-violet-500/10',
      iconBg: 'bg-indigo-500/15',
    },
  ]

  const quickActions = [
    {
      label: 'Scan Crop Disease',
      icon: Camera,
      href: '/voice-assistant?mode=scan',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      label: 'AI Voice Chat',
      icon: Mic,
      href: '/voice-assistant',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'Check Weather',
      icon: Cloud,
      href: '/weather',
      gradient: 'from-sky-500 to-blue-600',
    },
    {
      label: 'Crop Guide',
      icon: Sprout,
      href: '/crops',
      gradient: 'from-emerald-500 to-green-600',
    },
  ]

  const alerts = [
    {
      title: 'Monsoon Alert',
      description: 'Heavy rainfall expected in 2 days',
      severity: 'high' as const,
    },
    {
      title: 'Pest Warning',
      description: 'Armyworm activity detected in your district',
      severity: 'medium' as const,
    },
  ]

  const recommendations = [
    {
      title: 'Best time for irrigation: 5 AM - 7 AM',
      subtitle: 'Low wind speeds and cool temperatures',
      icon: Droplets,
      accentColor: 'bg-primary',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
    },
    {
      title: 'Apply fertilizer before monsoon',
      subtitle: 'Expected heavy rainfall in 2 days',
      icon: Leaf,
      accentColor: 'bg-secondary',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      title: 'Monitor for pests in wheat fields',
      subtitle: 'Armyworm activity reported nearby',
      icon: AlertCircle,
      accentColor: 'bg-accent',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
    },
  ]

  const userName = user?.email?.split('@')[0] || 'Farmer'

  return (
    <div className="space-y-8 pb-8">
      {/* ──────────────── Welcome Hero Banner ──────────────── */}
      <div className="gradient-hero rounded-2xl p-8 md:p-10 text-white relative overflow-hidden animate-fade-in">
        {/* Decorative floating elements */}
        <div className="absolute top-4 right-8 opacity-10 animate-float">
          <Sun className="w-24 h-24" />
        </div>
        <div className="absolute bottom-4 right-32 opacity-[0.07] animate-float" style={{ animationDelay: '2s' }}>
          <Leaf className="w-16 h-16" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            नमस्ते, {userName}! 🌾
          </h1>

          <p className="text-lg text-white/80 mb-1">
            {t('home')} — Your Farming Companion
          </p>

          <p className="text-sm text-white/60 flex items-center gap-2 mt-3">
            <Sun className="w-4 h-4 text-amber-300" />
            Partly cloudy · 32°C · Humidity 65% · Light breeze
          </p>
        </div>
      </div>

      {/* ──────────────── Stat Cards Row ──────────────── */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weather Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className={`glass-card hover-lift animate-fade-in-up stagger-${index + 1} border-0 overflow-hidden relative`}
              >
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} opacity-40`} />

                <CardContent className="pt-6 pb-5 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground stat-value" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                        {stat.value}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${
                          stat.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>

                    <div className={`${stat.iconBg} p-3 rounded-xl`}>
                      <Icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ──────────────── Quick Actions Grid ──────────────── */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className={`animate-fade-in-up stagger-${index + 1} group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} p-5 md:p-6 text-white text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] cursor-pointer`}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                <div className="relative z-10">
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm md:text-base leading-tight">{action.label}</p>
                  <ChevronRight className="w-4 h-4 mt-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ──────────────── Active Alerts Section ──────────────── */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Active Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, idx) => (
            <Card
              key={idx}
              className={`animate-fade-in-up stagger-${idx + 1} border-0 overflow-hidden hover-lift transition-all duration-300 ${
                alert.severity === 'high'
                  ? 'bg-red-50 dark:bg-red-950/30'
                  : 'bg-amber-50 dark:bg-amber-950/30'
              }`}
            >
              {/* Colored left border accent */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                  alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                }`}
              />

              <CardHeader className="pb-2 pl-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div
                      className={`p-1.5 rounded-lg ${
                        alert.severity === 'high'
                          ? 'bg-red-100 dark:bg-red-900/40'
                          : 'bg-amber-100 dark:bg-amber-900/40'
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 ${
                          alert.severity === 'high' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      />
                    </div>
                    <span className="text-foreground">{alert.title}</span>
                  </CardTitle>

                  <Badge
                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    className={`text-xs font-bold uppercase tracking-wider ${
                      alert.severity === 'high'
                        ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pl-6">
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ──────────────── Recommendations Section ──────────────── */}
      <Card className="glass-card border-0 animate-fade-in-up overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="gradient-text">Today&apos;s Recommendations</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Based on your location and current conditions
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {recommendations.map((rec, idx) => {
            const RecIcon = rec.icon
            return (
              <div
                key={idx}
                className={`animate-fade-in-up stagger-${idx + 1} flex items-start gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-all duration-300 group cursor-default`}
              >
                {/* Accent bar */}
                <div className={`w-1 self-stretch ${rec.accentColor} rounded-full flex-shrink-0`} />

                {/* Icon */}
                <div className={`${rec.iconBg} p-2.5 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <RecIcon className={`w-5 h-5 ${rec.iconColor}`} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.subtitle}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
