'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Simple fallback components if UI components fail
const FallbackCard = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border ${className}`}>
    {children}
  </div>
)
const FallbackCardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>
const FallbackCardTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>
const FallbackCardContent = ({ children }) => <div className="p-4">{children}</div>
const FallbackButton = ({ children, onClick, className = "", disabled = false, variant = "default", size = "default" }) => {
  const baseClass = "px-4 py-2 rounded font-medium transition-colors"
  const variantClass = variant === "outline" 
    ? "border border-gray-300 hover:bg-gray-50" 
    : "bg-blue-500 text-white hover:bg-blue-600"
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
const FallbackInput = ({ type = "text", placeholder, value, onChange, className = "", required = false }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
)
const FallbackBadge = ({ children, variant = "default" }) => {
  const variantClass = variant === "secondary" ? "bg-gray-200 text-gray-800" : "bg-blue-100 text-blue-800"
  return <span className={`px-2 py-1 rounded text-xs font-medium ${variantClass}`}>{children}</span>
}

// Try to import UI components, fall back to simple ones if they fail
let Card, CardContent, CardHeader, CardTitle, Button, Input, Badge
try {
  const uiComponents = require('@/components/ui/card')
  Card = uiComponents.Card || FallbackCard
  CardContent = uiComponents.CardContent || FallbackCardContent  
  CardHeader = uiComponents.CardHeader || FallbackCardHeader
  CardTitle = uiComponents.CardTitle || FallbackCardTitle
} catch {
  Card = FallbackCard
  CardContent = FallbackCardContent
  CardHeader = FallbackCardHeader
  CardTitle = FallbackCardTitle
}

try {
  Button = require('@/components/ui/button').Button || FallbackButton
} catch {
  Button = FallbackButton
}

try {
  Input = require('@/components/ui/input').Input || FallbackInput
} catch {
  Input = FallbackInput
}

try {
  Badge = require('@/components/ui/badge').Badge || FallbackBadge
} catch {
  Badge = FallbackBadge
}

// Simple icon replacements
const LayoutDashboard = () => "📊"
const FileText = () => "📄"
const DollarSign = () => "💰"
const LogOut = () => "🚪"
const Eye = () => "👁️"
const Plus = () => "➕"
const Refresh = () => "🔄"
const Calendar = () => "📅"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [articles, setArticles] = useState([])
  const [priceStats, setPriceStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  // Article creation state
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [articleForm, setArticleForm] = useState({ topic: '' })
  const [articleLoading, setArticleLoading] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/blog?limit=1')
      if (response.ok) {
        // Check if we have admin session cookie
        const hasSession = document.cookie.includes('admin_session')
        setIsAuthenticated(hasSession)
        if (hasSession) {
          loadDashboardData()
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      setIsAuthenticated(false)
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setUser(data.user)
        loadDashboardData()
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch (error) {
      setLoginError('Network error. Please try again.')
    }

    setLoginLoading(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load articles from blog API
      const articlesResponse = await fetch('/api/blog?limit=100')
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json()
        setArticles(articlesData.data || [])
      }

      // Load price stats
      const priceResponse = await fetch('/api/admin/prices')
      if (priceResponse.ok) {
        const priceData = await priceResponse.json()
        setPriceStats(priceData.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const updatePrices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: 3, delayMs: 10000 })
      })
      
      const data = await response.json()
      if (response.ok) {
        alert(`Success: ${data.message}`)
        loadDashboardData()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert('Network error during price update')
    }
    setLoading(false)
  }

  const createArticle = async (e) => {
    e.preventDefault()
    setArticleLoading(true)
    
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: articleForm.topic })
      })
      
      const data = await response.json()
      if (response.ok) {
        alert('Article created successfully with enhanced SEO optimization!')
        setShowArticleForm(false)
        setArticleForm({ topic: '' })
        loadDashboardData()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert('Network error during article creation')
    }
    
    setArticleLoading(false)
  }

  // Login form
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/30"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/30"
                  required
                />
                {loginError && (
                  <div className="text-red-500 text-sm">{loginError}</div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ValorisVisio Admin
          </h1>
          <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2">
            <LogOut />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: () => <LayoutDashboard /> },
            { id: 'articles', label: 'Articles', icon: () => <FileText /> },
            { id: 'prices', label: 'Prices', icon: () => <DollarSign /> }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText />
                  Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{articles.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total articles</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign />
                  Cryptocurrencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{priceStats?.statistics?.totalCoins || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tracked coins</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar />
                  Last Update
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {priceStats?.statistics?.lastUpdate 
                    ? new Date(priceStats.statistics.lastUpdate).toLocaleString()
                    : 'Never'
                  }
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Price data</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Articles Management</h2>
              <Button 
                onClick={() => setShowArticleForm(true)}
                className="flex items-center gap-2"
              >
                <Plus />
                New Article
              </Button>
            </div>
            
            {/* Article Creation Form */}
            {showArticleForm && (
              <Card className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
                <CardHeader>
                  <CardTitle>Create New Article</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createArticle} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter article topic (e.g., 'Bitcoin price analysis')"
                      value={articleForm.topic}
                      onChange={(e) => setArticleForm({ topic: e.target.value })}
                      className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/30"
                      required
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={articleLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        {articleLoading ? 'Creating...' : 'Create Article'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setShowArticleForm(false)
                          setArticleForm({ topic: '' })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-4">
              {articles.map(article => (
                <Card key={article._id} className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{article.summary || article.seo_description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                          {article.category && (
                            <Badge variant="secondary">
                              {article.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Prices Tab */}
        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Price Data Management</h2>
              <Button onClick={updatePrices} disabled={loading} className="flex items-center gap-2">
                <Refresh />
                {loading ? 'Updating...' : 'Update Prices'}
              </Button>
            </div>
            
            {priceStats && (
              <div className="grid gap-4">
                <Card className="backdrop-blur-sm bg-white/60 dark:bg-black/20 border-white/20">
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {priceStats.recentUpdates?.map(coin => (
                        <div key={coin._id} className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-black/20">
                          <div>
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({coin.symbol.toUpperCase()})</span>
                          </div>
                          <div className="text-right">
                            <div className="font-mono">${coin.current_price?.toFixed(6)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(coin.lastUpdated).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}