import { useState } from 'react'

export default function Configurar({ config, onUpdate }) {
  const [showKey, setShowKey] = useState(false)
  const [saved,   setSaved]   = useState(false)

  const handle = (key) => (e) => onUpdate({ [key]: e.target.value })

  const handleBudget = (e) => onUpdate({ budget: Number(e.target.value) })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 className="section-title">Configurar</h1>
      <p className="section-sub">API Key y presupuesto</p>

      <div className="config-form">
        <div className="config-group">
          <label className="config-label">Anthropic API Key</label>

          <div className="key-notice" role="note">
            <span className="key-notice-icon">🔒</span>
            <div className="key-notice-body">
              <span className="key-notice-title">Tu clave se guarda solo en este navegador</span>
              <ul className="key-notice-list">
                <li className="key-notice-item">
                  Almacenada en <code style={{ fontSize: '10px', color: 'var(--accent)' }}>localStorage</code> — nunca en el código ni en el repositorio
                </li>
                <li className="key-notice-item">
                  Viaja únicamente desde tu navegador a la API de Anthropic, sin pasar por ningún servidor intermedio
                </li>
                <li className="key-notice-item">
                  Si limpias los datos del navegador, tendrás que volver a introducirla
                </li>
                <li className="key-notice-item">
                  El build de producción no contiene ni referencia ninguna clave
                </li>
              </ul>
              <p className="key-where">
                Consíguela en console.anthropic.com → API Keys
              </p>
            </div>
          </div>

          <div className="input-wrap">
            <input
              className="config-input has-toggle"
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-api03-..."
              value={config.apiKey}
              onChange={handle('apiKey')}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              className="toggle-vis"
              onClick={() => setShowKey(v => !v)}
              type="button"
              aria-label={showKey ? 'Ocultar clave' : 'Mostrar clave'}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="config-group">
          <label className="config-label">Presupuesto Mensual</label>
          <p className="config-hint">~{Math.round(config.budget / 4.3)}€ por semana</p>
          <div className="budget-row">
            <input
              className="budget-slider"
              type="range"
              min={200}
              max={1200}
              step={10}
              value={config.budget}
              onChange={handleBudget}
            />
            <span className="budget-value">{config.budget}€</span>
          </div>
        </div>

        <button
          className={`save-btn${saved ? ' saved' : ''}`}
          onClick={handleSave}
          type="button"
        >
          {saved ? '✓ Guardado' : 'Guardar Configuración'}
        </button>

        {saved && (
          <p className="save-feedback">
            Configuración guardada · se usará al generar la lista IA
          </p>
        )}
      </div>
    </div>
  )
}
