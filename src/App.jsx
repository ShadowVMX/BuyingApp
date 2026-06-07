import { useState } from 'react'
import MiDieta from './components/MiDieta'
import Suplementos from './components/Suplementos'
import Configurar from './components/Configurar'
import ListaIA from './components/ListaIA'
import './App.css'

const TABS = [
  { id: 'dieta',      label: 'Mi Dieta',    icon: '🥗' },
  { id: 'suplementos',label: 'Suplementos', icon: '💊' },
  { id: 'configurar', label: 'Configurar',  icon: '⚙️' },
  { id: 'lista',      label: 'Lista IA',    icon: '🤖' },
]

const CONFIG_KEY = 'mercafit-config'

const defaultConfig = {
  apiKey: '',
  budget: 600,
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig
  } catch {
    return defaultConfig
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dieta')
  const [config, setConfig] = useState(loadConfig)
  const [aiResult,  setAiResult]  = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError,   setAiError]   = useState(null)

  const updateConfig = (updates) => {
    setConfig(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(CONFIG_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">MercaFit</span>
        </div>
        <p className="app-tagline">Nutrición de élite · Presupuesto real</p>
      </header>

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.id === 'lista' && aiLoading && <span className="tab-loading-dot" />}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {activeTab === 'dieta'       && <MiDieta />}
        {activeTab === 'suplementos' && <Suplementos />}
        {activeTab === 'configurar'  && <Configurar config={config} onUpdate={updateConfig} />}
        {activeTab === 'lista'       && (
          <ListaIA
            config={config}
            result={aiResult}   setResult={setAiResult}
            loading={aiLoading} setLoading={setAiLoading}
            error={aiError}     setError={setAiError}
          />
        )}
      </main>
    </div>
  )
}
