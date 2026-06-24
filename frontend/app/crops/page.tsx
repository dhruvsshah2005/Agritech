'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplets, Bug, Leaf } from 'lucide-react'

// Define the valid crop keys for TypeScript
type CropKey = 'wheat' | 'rice' | 'cotton'

export default function Crops() {
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
      image: '🌾',
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
      image: '🍚',
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
      image: '☁️',
    },
  }

  const currentCrop = crops[selectedCrop]

  const careGuide = [
    {
      title: 'Watering',
      icon: Droplets,
      tips: ['Water every 3-4 days', 'Best time: Early morning', 'Avoid waterlogging'],
    },
    {
      title: 'Pest Control',
      icon: Bug,
      tips: ['Scout for armyworms weekly', 'Use neem oil spray', 'Rotate pesticides'],
    },
    {
      title: 'Fertilizing',
      icon: Leaf,
      tips: ['Apply NPK (10:26:26)', 'Split into 2-3 doses', 'First dose at tillering'],
    },
  ]

  const stages = [
    { name: 'Germination', date: 'Oct 15 - Oct 30', icon: '🌱', completed: true },
    { name: 'Vegetative', date: 'Oct 30 - Jan 15', icon: '🌿', completed: true },
    { name: 'Reproductive', date: 'Jan 15 - Feb 20', icon: '🌾', completed: false },
    { name: 'Maturity', date: 'Feb 20 - Mar 20', icon: '🎯', completed: false },
  ]

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Crop Management</h1>
        <p className="text-lg opacity-90">Monitor and manage your crops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(crops) as CropKey[]).map((key) => (
          <Card
            key={key}
            onClick={() => setSelectedCrop(key)}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCrop === key ? 'ring-2 ring-green-500 bg-green-50/50' : ''
            }`}
          >
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">{crops[key].image}</div>
              <p className="font-bold text-lg">{crops[key].name}</p>
              <p className="text-sm text-green-600 mb-3">{crops[key].hindiName}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${crops[key].progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 uppercase font-semibold">{crops[key].status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentCrop.image}</span>
              <div>
                <CardTitle className="text-2xl">{currentCrop.name}</CardTitle>
                <CardDescription className="text-lg font-medium">{currentCrop.hindiName}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Health Status</p>
              <p className="text-xl font-bold text-green-600">{currentCrop.health}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Growth Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stages.map((stage, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${stage.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{stage.icon}</span>
                    <p className="font-bold text-sm">{stage.name}</p>
                    {stage.completed && <span className="ml-auto text-green-600">✓</span>}
                  </div>
                  <p className="text-xs text-gray-500">{stage.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Season</p>
              <p className="font-bold text-sm">{currentCrop.season}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Sowing Date</p>
              <p className="font-bold text-sm">{currentCrop.sowingDate}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Harvest Estimate</p>
              <p className="font-bold text-sm">{currentCrop.expectedHarvest}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Target Yield</p>
              <p className="font-bold text-sm">{currentCrop.yieldExpectation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Care Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careGuide.map((guide) => {
            const Icon = guide.icon
            return (
              <Card key={guide.title} className="hover:border-green-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                    <Icon className="w-5 h-5" />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button className="bg-green-600 hover:bg-green-700">Record Observation</Button>
        <Button variant="outline">Get Expert Advice</Button>
        <Button variant="outline">View Market Prices</Button>
      </div>
    </div>
  )
}