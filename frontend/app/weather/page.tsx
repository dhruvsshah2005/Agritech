'use client'

import React, { useEffect, useState } from 'react'
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
} from 'lucide-react'

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

  useEffect(() => {
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

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return null

  const current = data.timelines.minutely[0].values
  const daily = data.timelines.daily.slice(0, 7)
  const hourly = data.timelines.hourly.slice(0, 5)

  const CurrentIcon = iconMap[current.weatherCode] || Cloud

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Weather Forecast</h1>
            <p className="opacity-90">7-day forecast for your region</p>
          </div>
          <div className="bg-background/20 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Your Location</span>
            </div>
            <div className="mt-1">
              <div>Lat: {lat?.toFixed(4)}</div>
              <div>Lon: {lon?.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CURRENT */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-6xl font-bold">
                {Math.round(current.temperature)}°C
              </p>
              <p className="text-muted-foreground">Current Weather</p>
            </div>
            <CurrentIcon className="w-24 h-24 text-primary" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
            <Stat icon={Wind} label="Wind" value={`${current.windSpeed} km/h`} />
            <Stat icon={Eye} label="Visibility" value={`${current.visibility} km`} />
            <Stat
              icon={Gauge}
              label="Pressure"
              value={`${current.pressureSurfaceLevel} mb`}
            />
          </div>
        </CardContent>
      </Card>

      {/* 7 DAY */}
      <div>
        <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {daily.map((d: any, i: number) => {
            const Icon = iconMap[d.values.weatherCodeMax] || Cloud
            return (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <p className="font-semibold mb-2">
                    {new Date(d.time).toLocaleDateString('en-US', {
                      weekday: 'short',
                    })}
                  </p>
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-bold">
                    {Math.round(d.values.temperatureMax)}° /
                    {Math.round(d.values.temperatureMin)}°
                  </p>
                  <p className="text-sm text-primary">
                    {d.values.precipitationProbabilityMax}% Rain
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* HOURLY */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
          <CardDescription>Next hours</CardDescription>
        </CardHeader>
        <CardContent>
          {hourly.map((h: any, i: number) => (
            <div
              key={i}
              className="flex justify-between p-3 mb-2 bg-muted/50 rounded-lg"
            >
              <span>
                {new Date(h.time).toLocaleTimeString([], { hour: 'numeric' })}
              </span>
              <span>{Math.round(h.values.temperature)}°C</span>
              <span>💧 {h.values.humidity}%</span>
              <span>💨 {h.values.windSpeed} km/h</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 bg-background/50 p-3 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
