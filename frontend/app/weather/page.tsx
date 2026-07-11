'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  RefreshCw,
  Thermometer,
  CloudSun,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const iconMap: Record<number, React.ElementType> = {
  1000: Sun,
  1100: Sun,
  1101: Cloud,
  1102: Cloud,
  1001: Cloud,
  4000: CloudRain,
  4200: CloudRain,
  4201: CloudRain,
}

export default function WeatherPage() {
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchWeather = useCallback(() => {
    setLoading(true)
    setError(null)
    setData(null)

    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude

        setLat(latitude)
        setLon(longitude)

        try {
          const res = await fetch(
            `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=P1r1gAub9Q9nbyGcQNXD4wWb80nWe3sv`
          )
          if (!res.ok) throw new Error('API error')
          const json = await res.json()
          setData(json)
        } catch {
          setError('Failed to fetch weather')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location permission denied')
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  /* ─── SKELETON LOADING STATE ─── */
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {/* Skeleton Hero */}
        <div className="skeleton h-40 rounded-xl" />

        {/* Skeleton Current Weather */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="skeleton h-16 w-48 rounded-lg" />
              <div className="skeleton h-5 w-32 rounded-md" />
            </div>
            <div className="skeleton h-24 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Skeleton 7-Day */}
        <div className="space-y-4">
          <div className="skeleton h-8 w-48 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Skeleton Hourly */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="skeleton h-7 w-40 rounded-md" />
          <div className="skeleton h-4 w-24 rounded-md" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  /* ─── ERROR STATE ─── */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="glass-card max-w-md w-full animate-scale-in">
          <CardContent className="pt-8 pb-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Weather Unavailable</h3>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
            <Button
              onClick={fetchWeather}
              className="gap-2"
              variant="default"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const current = data.timelines.minutely[0].values
  const daily = data.timelines.daily.slice(0, 7)
  const hourly = data.timelines.hourly.slice(0, 5)

  const CurrentIcon = iconMap[current.weatherCode] || Cloud

  return (
    <div className="space-y-6 p-6">
      {/* ═══ HERO HEADER ═══ */}
      <div className="gradient-hero text-primary-foreground rounded-xl p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium">
              <CloudSun className="w-4 h-4" />
              <span>Real-time Weather Data</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Weather Forecast
            </h1>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              7-day forecast for your region
            </p>
          </div>
          <div className="glass-card bg-white/10 border-white/20 p-4 rounded-xl text-sm self-start">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <MapPin className="w-4 h-4" />
              <span>Your Location</span>
            </div>
            <div className="space-y-0.5 text-primary-foreground/80 text-xs font-mono">
              <div>Lat: {lat?.toFixed(4)}</div>
              <div>Lon: {lon?.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CURRENT WEATHER ═══ */}
      <Card className="glass-card rounded-xl overflow-hidden animate-fade-in-up">
        <CardContent className="pt-8 pb-8 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Current Weather
              </p>
              <p className="text-7xl sm:text-8xl font-extrabold gradient-text leading-none tracking-tighter">
                {Math.round(current.temperature)}°
              </p>
              <p className="text-lg text-muted-foreground font-medium mt-1">
                {Math.round(current.temperature)}°C — Feels like now
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-125" />
              <CurrentIcon className="relative w-28 h-28 sm:w-32 sm:h-32 text-primary drop-shadow-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Stat
              icon={Droplets}
              label="Humidity"
              value={`${current.humidity}%`}
              delay="stagger-1"
            />
            <Stat
              icon={Wind}
              label="Wind"
              value={`${current.windSpeed} km/h`}
              delay="stagger-2"
            />
            <Stat
              icon={Eye}
              label="Visibility"
              value={`${current.visibility} km`}
              delay="stagger-3"
            />
            <Stat
              icon={Gauge}
              label="Pressure"
              value={`${current.pressureSurfaceLevel} mb`}
              delay="stagger-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* ═══ 7-DAY FORECAST ═══ */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">7-Day Forecast</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.map((d: any, i: number) => {
            const Icon = iconMap[d.values.weatherCodeMax] || Cloud
            return (
              <Card
                key={i}
                className={`glass-card hover-lift rounded-xl animate-fade-in-up stagger-${Math.min(i + 1, 6)} border-0`}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <p className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                    {new Date(d.time).toLocaleDateString('en-US', {
                      weekday: 'short',
                    })}
                  </p>
                  <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 bg-primary/8 rounded-full blur-lg scale-150" />
                    <Icon className="relative w-10 h-10 mx-auto text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <ArrowUp className="w-3.5 h-3.5 text-destructive/70" />
                      <span className="font-bold text-base">
                        {Math.round(d.values.temperatureMax)}°
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <ArrowDown className="w-3.5 h-3.5 text-accent/70" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {Math.round(d.values.temperatureMin)}°
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium">
                    <Droplets className="w-3 h-3" />
                    <span>{d.values.precipitationProbabilityMax}%</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ═══ HOURLY FORECAST ═══ */}
      <Card className="glass-card rounded-xl animate-fade-in-up stagger-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Hourly Forecast</CardTitle>
              <CardDescription>Next hours overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {hourly.map((h: any, i: number) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
            >
              <span className="font-semibold text-sm w-20">
                {new Date(h.time).toLocaleTimeString([], { hour: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="font-bold text-base">
                  {Math.round(h.values.temperature)}°C
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Droplets className="w-4 h-4 text-blue-500/70" />
                <span>{h.values.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Wind className="w-4 h-4 text-accent" />
                <span>{h.values.windSpeed} km/h</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── STAT COMPONENT ─── */
function Stat({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  delay?: string
}) {
  return (
    <div
      className={`flex items-center gap-3 glass-card rounded-xl p-4 animate-fade-in-up ${delay || ''}`}
    >
      <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="font-bold text-lg stat-value">{value}</p>
      </div>
    </div>
  )
}
