'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  User, MapPin, Bell, Languages, HelpCircle, Phone, Wheat,
  Ruler, CheckCircle2, Cloud, Bug, Leaf, TrendingUp, Mail,
  ChevronDown, ChevronUp, Shield, Info, MessageCircle, Settings as SettingsIcon
} from 'lucide-react'
import { useLanguage, LanguageCode } from '@/lib/i18n'

export default function Settings() {
  const { language: currentLang, changeLanguage, t } = useLanguage()

  const [profile, setProfile] = useState({
    name: 'Raj Kumar',
    phone: '+91 98765 43210',
    location: 'Meerut, Uttar Pradesh',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    farmSize: '5 acres',
    crops: 'Wheat, Rice, Cotton',
  })

  const [notifications, setNotifications] = useState({
    weather: true,
    pests: true,
    cropHealth: true,
    priceUpdates: false,
    emailNotifications: false,
  })

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLang)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Sync state if language context changes
  useEffect(() => {
    setSelectedLanguage(currentLang)
  }, [currentLang])

  const handleUpdateLanguage = () => {
    changeLanguage(selectedLanguage)
    setSuccessMessage(t('languageUpdated'))
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // List of Indian languages in native script
  const indianLanguages: { code: LanguageCode; native: string }[] = [
    { code: 'hi', native: 'हिन्दी (Hindi)' },
    { code: 'en', native: 'English' },
    { code: 'bn', native: 'বাংলা (Bengali)' },
    { code: 'te', native: 'తెలుగు (Telugu)' },
    { code: 'mr', native: 'मराठी (Marathi)' },
    { code: 'ta', native: 'தமிழ் (Tamil)' },
    { code: 'gu', native: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', native: 'ಕನ್ನಡ (Kannada)' },
    { code: 'pa', native: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ml', native: 'മലയാളം (Malayalam)' },
    { code: 'or', native: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'as', native: 'অসমীয়া (Assamese)' },
    { code: 'ur', native: 'اردو (Urdu)' },
    { code: 'sa', native: 'संस्कृतम् (Sanskrit)' },
    { code: 'es', native: 'Español (Spanish)' },
    { code: 'ne', native: 'नेपाली (Nepali)' },
  ]

  const notificationSettings = [
    { key: 'weather' as const, label: 'Weather Alerts', description: 'Get notified about monsoons, storms, and weather changes', icon: Cloud, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { key: 'pests' as const, label: 'Pest Warnings', description: 'Alerts when pest activity is detected in your area', icon: Bug, color: 'bg-red-500/10', iconColor: 'text-red-600' },
    { key: 'cropHealth' as const, label: 'Crop Health', description: 'Updates about your crop growth stages and health', icon: Leaf, color: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
    { key: 'priceUpdates' as const, label: 'Price Updates', description: 'Market price changes for your crops', icon: TrendingUp, color: 'bg-amber-500/10', iconColor: 'text-amber-600' },
    { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive a daily summary via email', icon: Mail, color: 'bg-purple-500/10', iconColor: 'text-purple-600' },
  ]

  const faqItems = [
    {
      question: 'How do I add a new crop to my farm?',
      answer: 'Navigate to the Crops section from the sidebar, then click the "Add Crop" button. Fill in the crop details including the variety, sowing date, and field area. The system will automatically start tracking its growth stages.',
    },
    {
      question: 'How accurate are the weather predictions?',
      answer: 'Our weather predictions use data from the Indian Meteorological Department (IMD) and multiple satellite sources. Forecasts are typically 85-90% accurate for 3-day predictions and updated every 6 hours.',
    },
    {
      question: 'Can I use the app offline?',
      answer: 'Yes! The app caches essential data locally. You can view your crop information, care guides, and recent alerts offline. New data will sync automatically when you reconnect to the internet.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can email us at support@kisaansahayak.in or call our toll-free helpline at 1800-XXX-XXXX, available Monday to Saturday, 8 AM to 8 PM IST.',
    },
  ]

  const profileFields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text' },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
    { key: 'farmSize', label: 'Farm Size', icon: Ruler, type: 'text' },
    { key: 'crops', label: 'Crops Grown', icon: Wheat, type: 'text' },
  ]

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="gradient-hero text-white rounded-2xl p-8 md:p-10 shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0yaDJ2LTRoLTJ2NHptLTItNGgtMnYyaDJ2LTJ6bTQgMHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('settingsTitle')}</h1>
              <p className="text-lg text-white/80">{t('settingsSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="glass-card border border-primary/30 px-5 py-4 rounded-xl text-sm shadow-sm font-medium animate-fade-in-up flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground">{successMessage}</span>
        </div>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 rounded-xl h-12">
          <TabsTrigger value="profile" className="gap-2 rounded-lg"><User className="w-4 h-4"/> Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-lg"><Bell className="w-4 h-4"/> Alerts</TabsTrigger>
          <TabsTrigger value="language" className="gap-2 rounded-lg"><Languages className="w-4 h-4"/> Language</TabsTrigger>
          <TabsTrigger value="help" className="gap-2 rounded-lg"><HelpCircle className="w-4 h-4"/> Help</TabsTrigger>
        </TabsList>

        {/* ═══════════ PROFILE TAB ═══════════ */}
        <TabsContent value="profile" className="space-y-6 animate-fade-in-up">
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Manage your profile details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {profileFields.map((field, idx) => {
                const FieldIcon = field.icon
                return (
                  <div key={field.key} className={`grid gap-2 animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FieldIcon className="w-4 h-4 text-muted-foreground" />
                      {field.label}
                    </label>
                    <Input
                      type={field.type}
                      className="premium-input rounded-xl h-11"
                      value={profile[field.key as keyof typeof profile]}
                      onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <Button className="w-full gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 rounded-xl h-12 text-base font-semibold">
            {t('saveProfile')}
          </Button>
        </TabsContent>

        {/* ═══════════ NOTIFICATIONS TAB ═══════════ */}
        <TabsContent value="notifications" className="space-y-6 animate-fade-in-up">
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationSettings.map((item, idx) => {
                const ItemIcon = item.icon
                const isEnabled = notifications[item.key]
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleNotification(item.key)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                      isEnabled
                        ? 'bg-primary/5 border border-primary/15'
                        : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <ItemIcon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    {/* Toggle Switch */}
                    <div
                      className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${
                        isEnabled ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          isEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <Button className="w-full gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 rounded-xl h-12 text-base font-semibold">
            Save Preferences
          </Button>
        </TabsContent>

        {/* ═══════════ LANGUAGE TAB ═══════════ */}
        <TabsContent value="language" className="space-y-6 animate-fade-in-up">
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t('appLanguage')}</CardTitle>
                  <CardDescription>{t('selectLanguageDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {indianLanguages.map((lang, idx) => (
                  <div
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`hover-lift p-4 border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                      selectedLanguage === lang.code
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md shadow-primary/10'
                        : 'hover:bg-muted/50 border-border'
                    }`}
                  >
                    <span className={`font-semibold text-lg ${
                      selectedLanguage === lang.code ? 'text-primary' : 'text-foreground'
                    }`}>
                      {lang.native}
                    </span>
                    {selectedLanguage === lang.code && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={handleUpdateLanguage}
            className="w-full gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 rounded-xl h-12 text-base font-semibold"
          >
            {t('updateLanguage')}
          </Button>
        </TabsContent>

        {/* ═══════════ HELP TAB ═══════════ */}
        <TabsContent value="help" className="space-y-6 animate-fade-in-up">
          {/* FAQ Section */}
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                  <CardDescription>Find answers to common questions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                    openFaq === idx
                      ? 'border-primary/20 bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/15'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-sm text-foreground pr-4">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* App Info & Support */}
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">App Information</CardTitle>
                  <CardDescription>Version details and support</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Version</p>
                  <p className="font-bold text-foreground">1.0.0</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Build</p>
                  <p className="font-bold text-foreground">Stable Release</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Need Help?</p>
                  <p className="text-sm text-muted-foreground">Contact us at <span className="text-primary font-medium">support@kisaansahayak.in</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Privacy & Security</p>
                  <p className="text-sm text-muted-foreground">Your data is encrypted and stored securely in India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}