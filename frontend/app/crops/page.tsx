'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Droplets, Bug, Leaf, Wheat, Sprout, Cloud, Calendar, TrendingUp,
  Target, CheckCircle2, Circle, ArrowRight, Sun, Scissors
} from 'lucide-react'

// Define the valid crop keys for TypeScript
type CropKey = 'wheat' | 'rice' | 'cotton'

export default function Crops() {
  const { t } = useLanguage()
  const [selectedCrop, setSelectedCrop] = useState<CropKey>('wheat')

  const crops = {
    wheat: {
      name: 'Wheat',
      hindiName: 'गेहूँ',
      season: 'Rabi (October - March)',
      status: 'Growing',
      progress: 65,
      sowingDate: 'October 15, 2024',
      expectedHarvest: 'March 20, 2025',
      yieldExpectation: '4.5 tons/acre',
      health: 'Good',
      icon: Wheat,
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      ringColor: 'ring-amber-500/30',
    },
    rice: {
      name: 'Rice',
      hindiName: 'धान',
      season: 'Kharif (June - September)',
      status: 'Completed',
      progress: 100,
      sowingDate: 'June 20, 2024',
      expectedHarvest: 'September 25, 2024',
      yieldExpectation: '4.0 tons/acre',
      health: 'Harvested',
      icon: Sprout,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
      ringColor: 'ring-emerald-500/30',
    },
    cotton: {
      name: 'Cotton',
      hindiName: 'कपास',
      season: 'Kharif (June - October)',
      status: 'Upcoming',
      progress: 0,
      sowingDate: 'June 1, 2025',
      expectedHarvest: 'November 15, 2025',
      yieldExpectation: '15 bales/acre',
      health: 'Planning',
      icon: Cloud,
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-500/10',
      textColor: 'text-sky-600',
      ringColor: 'ring-sky-500/30',
    },
  }

  const currentCrop = crops[selectedCrop]

  const careGuide = [
    {
      title: 'Watering',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      tips: ['Water every 3-4 days', 'Best time: Early morning', 'Avoid waterlogging'],
    },
    {
      title: 'Pest Control',
      icon: Bug,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      tips: ['Scout for armyworms weekly', 'Use neem oil spray', 'Rotate pesticides'],
    },
    {
      title: 'Fertilizing',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      tips: ['Apply NPK (10:26:26)', 'Split into 2-3 doses', 'First dose at tillering'],
    },
  ]

  const stages = [
    { name: t('sowing'), date: 'Oct 15 - Oct 30', icon: Sprout, completed: true },
    { name: t('vegetative'), date: 'Oct 30 - Jan 15', icon: Leaf, completed: true },
    { name: t('flowering'), date: 'Jan 15 - Feb 20', icon: Wheat, completed: false },
    { name: t('harvest'), date: 'Feb 20 - Mar 20', icon: Target, completed: false },
  ]

  const infoItems = [
    { label: t('season'), value: currentCrop.season, icon: Sun, color: 'bg-amber-500/10', iconColor: 'text-amber-600' },
    { label: t('sowingDate'), value: currentCrop.sowingDate, icon: Calendar, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { label: t('harvestEstimate'), value: currentCrop.expectedHarvest, icon: Scissors, color: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
    { label: t('targetYield'), value: currentCrop.yieldExpectation, icon: TrendingUp, color: 'bg-purple-500/10', iconColor: 'text-purple-600' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Growing':
        return 'bg-primary/10 text-primary border border-primary/20'
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
      case 'Upcoming':
        return 'bg-secondary/10 text-secondary-foreground border border-secondary/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="p-4 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="gradient-hero text-white rounded-2xl p-8 md:p-10 shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0yaDJ2LTRoLTJ2NHptLTItNGgtMnYyaDJ2LTJ6bTQgMHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('crops')}</h1>
              <p className="text-lg text-white/80">Monitor and manage your crops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(crops) as CropKey[]).map((key, idx) => {
          const CropIcon = crops[key].icon
          return (
            <div
              key={key}
              onClick={() => setSelectedCrop(key)}
              className={`glass-card hover-lift rounded-2xl p-6 cursor-pointer animate-fade-in-up stagger-${idx + 1} transition-all duration-300 ${
                selectedCrop === key
                  ? `ring-2 ring-primary shadow-lg shadow-primary/10`
                  : 'hover:ring-1 hover:ring-primary/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${crops[key].color} flex items-center justify-center shadow-lg`}>
                  <CropIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg text-foreground">{t(key)}</p>
                  <p className="text-sm text-primary font-medium">{crops[key].hindiName}</p>
                </div>
                {selectedCrop === key && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadge(crops[key].status)}`}>
                    {crops[key].status}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{crops[key].progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="progress-bar-fill h-full"
                    style={{ width: `${crops[key].progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Crop Detail Card */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm animate-fade-in-up overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCrop.color} flex items-center justify-center shadow-lg`}>
                <currentCrop.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">{t(selectedCrop)}</CardTitle>
                <CardDescription className="text-lg font-medium text-primary">{currentCrop.hindiName}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Health Status</p>
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm ${getStatusBadge(currentCrop.status)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-glow-pulse" />
                {currentCrop.health}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-10">
          {/* Growth Timeline — Horizontal Stepper */}
          <div className="animate-fade-in-up">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 gradient-text">
              {t('growthTimeline')}
            </h3>
            <div className="relative">
              <div className="flex items-start justify-between">
                {stages.map((stage, idx) => {
                  const StageIcon = stage.icon
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 relative">
                      {/* Connecting line */}
                      {idx < stages.length - 1 && (
                        <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5">
                          <div className={`h-full rounded-full transition-all duration-500 ${
                            stage.completed ? 'bg-primary' : 'bg-border'
                          }`} />
                        </div>
                      )}
                      {/* Node */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        stage.completed
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'bg-muted text-muted-foreground border-2 border-border'
                      }`}>
                        {stage.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StageIcon className="w-4 h-4" />
                        )}
                      </div>
                      <p className={`mt-3 text-sm font-bold text-center ${
                        stage.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {stage.name}
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">{stage.date}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Info Boxes with Colored Icon Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
            {infoItems.map((item, idx) => {
              const InfoIcon = item.icon
              return (
                <div key={idx} className={`glass-card rounded-2xl p-5 hover-lift stagger-${idx + 1}`}>
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <InfoIcon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-bold text-sm text-foreground">{item.value}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-5 gradient-text">{t('careGuide')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careGuide.map((guide, idx) => {
            const Icon = guide.icon
            return (
              <div key={guide.title} className={`glass-card hover-lift rounded-2xl overflow-hidden animate-fade-in-up stagger-${idx + 1}`}>
                {/* Colored top accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${guide.color}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-11 h-11 rounded-xl ${guide.bgColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{guide.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-border animate-fade-in-up">
        <Button className="gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 rounded-xl px-6">
          {t('recordObservation')}
        </Button>
      </div>
    </div>
  )
}