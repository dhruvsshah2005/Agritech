'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertCircle, Bug, Cloud, Droplets, TrendingUp, X, Bell,
  CheckCircle, CheckCheck, Leaf, ShieldCheck
} from 'lucide-react'

export default function Alerts() {
  const { t } = useLanguage()
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'weather',
      severity: 'high',
      title: t('monsoonAlert'),
      description: 'Heavy rainfall expected in 2 days. Prepare for potential waterlogging in low-lying areas.',
      timestamp: '2 hours ago',
      icon: Cloud,
      read: false,
    },
    {
      id: 2,
      type: 'pest',
      severity: 'medium',
      title: t('pestWarning'),
      description: 'Armyworm activity reported in your district. Begin preventive measures immediately.',
      timestamp: '5 hours ago',
      icon: Bug,
      read: false,
    },
    {
      id: 3,
      type: 'weather',
      severity: 'low',
      title: 'Ideal Irrigation Window',
      description: 'Best time for irrigation: Tomorrow 5 AM - 7 AM. Low wind speeds and cool temperatures.',
      timestamp: '1 day ago',
      icon: Droplets,
      read: true,
    },
    {
      id: 4,
      type: 'crop',
      severity: 'medium',
      title: 'Fertilizer Application Due',
      description: 'It\'s time to apply the second dose of fertilizer to your wheat field.',
      timestamp: '1 day ago',
      icon: TrendingUp,
      read: true,
    },
    {
      id: 5,
      type: 'weather',
      severity: 'low',
      title: 'Clear Skies Forecast',
      description: 'Clear weather expected on Friday and Saturday. Good for field work and spraying.',
      timestamp: '2 days ago',
      icon: Cloud,
      read: true,
    },
  ])

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  const markAsRead = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })))
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          card: 'border-l-4 border-l-destructive bg-destructive/5',
          badge: 'bg-destructive/15 text-destructive border border-destructive/20',
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
        }
      case 'medium':
        return {
          card: 'border-l-4 border-l-secondary bg-secondary/5',
          badge: 'bg-secondary/15 text-secondary-foreground border border-secondary/20',
          iconBg: 'bg-secondary/10',
          iconColor: 'text-secondary-foreground',
        }
      case 'low':
        return {
          card: 'border-l-4 border-l-accent bg-accent/5',
          badge: 'bg-accent/15 text-accent-foreground border border-accent/20',
          iconBg: 'bg-accent/10',
          iconColor: 'text-accent',
        }
      default:
        return {
          card: 'border-l-4 border-l-border bg-muted/5',
          badge: 'bg-muted text-muted-foreground',
          iconBg: 'bg-muted',
          iconColor: 'text-muted-foreground',
        }
    }
  }

  const unreadCount = alerts.filter((a) => !a.read).length
  const highCount = alerts.filter((a) => a.severity === 'high').length

  const renderAlertCard = (alert: typeof alerts[0], idx: number) => {
    const Icon = alert.icon
    const styles = getSeverityStyles(alert.severity)
    return (
      <Card
        key={alert.id}
        className={`${styles.card} rounded-xl overflow-hidden animate-fade-in-up stagger-${Math.min(idx + 1, 6)} transition-all duration-300 hover:shadow-md ${
          alert.read ? 'opacity-65' : ''
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className={`w-11 h-11 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${styles.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="font-bold text-foreground">{alert.title}</p>
                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${styles.badge}`}>
                    {alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low'}
                  </span>
                  {alert.read && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{alert.description}</p>
                <p className="text-xs text-muted-foreground/70">{alert.timestamp}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {!alert.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAsRead(alert.id)}
                  className="whitespace-nowrap text-xs rounded-lg hover:bg-primary/5 hover:border-primary/30"
                >
                  Mark Read
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissAlert(alert.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderEmptyState = (message: string) => (
    <Card className="glass-card rounded-2xl animate-fade-in">
      <CardContent className="pt-6 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-lg text-foreground mb-1">All caught up!</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="gradient-hero text-white rounded-2xl p-8 md:p-10 shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0yaDJ2LTRoLTJ2NHptLTItNGgtMnYyaDJ2LTJ6bTQgMHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('alerts')}</h1>
              <p className="text-lg text-white/80">Stay informed about weather, pests, and crop health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card hover-lift rounded-2xl p-6 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{t('totalAlerts')}</p>
              <p className="text-3xl font-bold text-foreground stat-value">{alerts.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        <div className="glass-card hover-lift rounded-2xl p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{t('highPriority')}</p>
              <p className="text-3xl font-bold text-destructive stat-value">{highCount}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
          </div>
        </div>

        <div className="glass-card hover-lift rounded-2xl p-6 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{t('unreadAlerts')}</p>
              <p className="text-3xl font-bold text-accent stat-value">{unreadCount}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List with Tabs */}
      <Tabs defaultValue="all" className="w-full animate-fade-in-up">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto sm:flex">
            <TabsTrigger value="all" className="rounded-lg">{t('all')}</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-lg">{t('unread')} ({unreadCount})</TabsTrigger>
            <TabsTrigger value="weather" className="rounded-lg">{t('weather')}</TabsTrigger>
            <TabsTrigger value="crop" className="rounded-lg">{t('crops')}</TabsTrigger>
          </TabsList>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              className="gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30"
            >
              <CheckCheck className="w-4 h-4" />
              {t('markAllRead')}
            </Button>
          )}
        </div>

        <TabsContent value="all" className="space-y-4 mt-0">
          {alerts.length === 0
            ? renderEmptyState('No alerts at this time')
            : alerts.map((alert, idx) => renderAlertCard(alert, idx))
          }
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-0">
          {alerts.filter((a) => !a.read).length === 0
            ? renderEmptyState('You have no unread alerts')
            : alerts.filter((a) => !a.read).map((alert, idx) => renderAlertCard(alert, idx))
          }
        </TabsContent>

        <TabsContent value="weather" className="space-y-4 mt-0">
          {alerts.filter((a) => a.type === 'weather').length === 0
            ? renderEmptyState('No weather alerts right now')
            : alerts.filter((a) => a.type === 'weather').map((alert, idx) => renderAlertCard(alert, idx))
          }
        </TabsContent>

        <TabsContent value="crop" className="space-y-4 mt-0">
          {alerts.filter((a) => a.type === 'crop' || a.type === 'pest').length === 0
            ? renderEmptyState('No crop or pest alerts at this time')
            : alerts.filter((a) => a.type === 'crop' || a.type === 'pest').map((alert, idx) => renderAlertCard(alert, idx))
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}
