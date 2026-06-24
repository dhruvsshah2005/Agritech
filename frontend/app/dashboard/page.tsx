'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cloud, Droplets, Sun, Wind, AlertCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Dashboard() {
  const stats = [
    { label: 'Temperature', value: '32°C', icon: Sun, color: 'text-orange-600' },
    { label: 'Humidity', value: '65%', icon: Droplets, color: 'text-blue-600' },
    { label: 'Wind Speed', value: '12 km/h', icon: Wind, color: 'text-teal-600' },
    { label: 'Rainfall', value: '2.5 mm', icon: Cloud, color: 'text-slate-600' },
  ]

  const alerts = [
    { title: 'Monsoon Alert', description: 'Heavy rainfall expected in 2 days', severity: 'high' },
    { title: 'Pest Warning', description: 'Armyworm activity detected in your district', severity: 'medium' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">नमस्ते, किसान!</h1>
        <p className="text-lg opacity-90">Welcome to Kisaan Sahayak - Your Farming Companion</p>
      </div>

      {/* Current Weather Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Weather Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className={`w-12 h-12 ${stat.color} opacity-70`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Active Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, idx) => (
            <Card key={idx} className={`border-2 ${
              alert.severity === 'high' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className={`w-5 h-5 ${
                    alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  {alert.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{alert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Today&apos;s Recommendations
          </CardTitle>
          <CardDescription>Based on your location and current conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full" />
            <div>
              <p className="font-semibold text-foreground">Best time for irrigation: 5 AM - 7 AM</p>
              <p className="text-sm text-muted-foreground">Low wind speeds and cool temperatures</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-secondary rounded-full" />
            <div>
              <p className="font-semibold text-foreground">Apply fertilizer before monsoon</p>
              <p className="text-sm text-muted-foreground">Expected heavy rainfall in 2 days</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-accent rounded-full" />
            <div>
              <p className="font-semibold text-foreground">Monitor for pests in wheat fields</p>
              <p className="text-sm text-muted-foreground">Armyworm activity reported nearby</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
