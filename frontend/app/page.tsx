'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import Dashboard from '@/components/pages/dashboard'
import VoiceAssistant from '@/components/pages/voice-assistant'
import Weather from '@/components/pages/weather'
import Crops from '@/components/pages/crops'
import Alerts from '@/components/pages/alerts'
import Settings from '@/components/pages/settings'
import Login from '@/components/pages/login'
import Register from '@/components/pages/register'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [authState, setAuthState] = useState<'login' | 'register' | 'authenticated'>('login')
  const [userEmail, setUserEmail] = useState('')

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    setAuthState('authenticated')
  }

  const handleSwitchToRegister = () => {
    setAuthState('register')
  }

  const handleSwitchToLogin = () => {
    setAuthState('login')
  }

  const handleRegisterSuccess = (email: string) => {
    setUserEmail(email)
    setAuthState('authenticated')
  }

  const handleLogout = () => {
    setAuthState('login')
    setUserEmail('')
    setCurrentPage('dashboard')
  }

  if (authState === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
  }

  if (authState === 'register') {
    return <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'voice':
        return <VoiceAssistant />
      case 'weather':
        return <Weather />
      case 'crops':
        return <Crops />
      case 'alerts':
        return <Alerts />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} userEmail={userEmail} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  )
}
