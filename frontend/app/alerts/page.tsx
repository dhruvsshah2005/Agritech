'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Bug, Cloud, Droplets, TrendingUp, X, Bell, CheckCircle } from 'lucide-react'

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'weather',
      severity: 'high',
      title: 'Monsoon Alert',
      description: 'Heavy rainfall expected in 2 days. Prepare for potential waterlogging in low-lying areas.',
      timestamp: '2 hours ago',
      icon: Cloud,
      read: false,
    },
    {
      id: 2,
      type: 'pest',
      severity: 'medium',
      title: 'Armyworm Detected',
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300'
      case 'medium':
        return 'bg-yellow-50 border-yellow-300'
      case 'low':
        return 'bg-blue-50 border-blue-300'
      default:
        return 'bg-muted'
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600 text-white'
      case 'medium':
        return 'bg-yellow-600 text-white'
      case 'low':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-primary'
    }
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
        <p className="text-lg opacity-90">Stay informed about weather, pests, and crop health</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold text-foreground">{alerts.length}</p>
              </div>
              <Bell className="w-10 h-10 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-300/50 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-900">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{alerts.filter((a) => a.severity === 'high').length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-300/50 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-900">Unread</p>
                <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {unreadCount}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="crop">Crop</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <Card key={alert.id} className={`border-2 ${getSeverityColor(alert.severity)} ${alert.read ? 'opacity-70' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-foreground">{alert.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadgeColor(alert.severity)}`}>
                            {alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low'}
                          </span>
                          {alert.read && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!alert.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(alert.id)}
                          className="whitespace-nowrap"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-4">
          {alerts.filter((a) => !a.read).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">You have no unread alerts</p>
              </CardContent>
            </Card>
          ) : (
            alerts.filter((a) => !a.read).map((alert) => {
              const Icon = alert.icon
              return (
                <Card key={alert.id} className={`border-2 ${getSeverityColor(alert.severity)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-bold text-foreground mb-1">{alert.title}</p>
                          <p className="text-sm text-foreground mb-2">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="weather" className="space-y-4 mt-4">
          {alerts.filter((a) => a.type === 'weather').map((alert) => {
            const Icon = alert.icon
            return (
              <Card key={alert.id} className={`border-2 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-bold text-foreground mb-1">{alert.title}</p>
                      <p className="text-sm text-foreground mb-2">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="crop" className="space-y-4 mt-4">
          {alerts.filter((a) => a.type === 'crop' || a.type === 'pest').map((alert) => {
            const Icon = alert.icon
            return (
              <Card key={alert.id} className={`border-2 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-bold text-foreground mb-1">{alert.title}</p>
                      <p className="text-sm text-foreground mb-2">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
