import { useState } from 'react'

function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function Markdown({ text }) {
  return (
    <div className="md-content">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## '))
          return <h2 key={i} className="md-h2">{parseInline(line.slice(3))}</h2>
        if (line.startsWith('### '))
          return <h3 key={i} className="md-h3">{parseInline(line.slice(4))}</h3>
        if (/^[-*•] /.test(line))
          return <div key={i} className="md-li">{parseInline(line.replace(/^[-*•] /, ''))}</div>
        if (/^\d+\. /.test(line))
          return <div key={i} className="md-li">{parseInline(line.replace(/^\d+\. /, ''))}</div>
        if (line.trim() === '')
          return <div key={i} className="md-spacer" />
        return <p key={i} className="md-p">{parseInline(line)}</p>
      })}
    </div>
  )
}

function buildPrompt(config, weeklyBudget) {
  return `Lista de compra semanal Mercadona para dieta fitness alta en proteínas (5 comidas/día). Presupuesto: ${weeklyBudget}€/semana.${config.preferences ? ` Preferencias: ${config.preferences}.` : ''}${config.exclusions ? ` Excluir: ${config.exclusions}.` : ''}

Busca precios actuales Mercadona España y responde en español con estos dos bloques:

## 🛒 Lista de Compra Semanal — Mercadona
Productos por categoría (Proteínas, Lácteos/Huevos, Carbohidratos, Verduras/Frutas, Condimentos). Formato: producto — cantidad — precio.

## 💰 Resumen de Costes
Subtotal por categoría, total semanal y comparativa con ${weeklyBudget}€.`
}

export default function ListaIA({ config, result, setResult, loading, setLoading, error, setError }) {
  const weeklyBudget = Math.round(config.budget / 4.3)
  const hasKey = Boolean(config.apiKey?.trim())

  const generate = async () => {
    if (!hasKey) {
      setError('Añade tu API Key de Anthropic en la pestaña Configurar para generar la lista.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': config.apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'web-search-2025-03-05',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 1 }],
          messages: [{ role: 'user', content: buildPrompt(config, weeklyBudget) }],
        }),
      })

      if (!res.ok) {
        let msg = `Error HTTP ${res.status}`
        try {
          const e = await res.json()
          msg = e.error?.message || msg
        } catch (_) {}
        throw new Error(msg)
      }

      const data = await res.json()

      const text = (data.content ?? [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n\n')
        .trim()

      if (!text) {
        throw new Error('No se recibió respuesta de texto. Verifica tu API Key y vuelve a intentarlo.')
      }

      setResult(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lista-ia">
      <h1 className="section-title">Lista IA</h1>
      <p className="section-sub">Generada por Claude con precios reales de Mercadona</p>

      <div className="ai-config-summary">
        <div className="ai-config-row">
          <span className="ai-config-label">API Key</span>
          <span className={`ai-config-value ${hasKey ? 'ok' : 'warn'}`}>
            {hasKey ? '● Configurada' : '✗ Sin configurar'}
          </span>
        </div>
        <div className="ai-config-row">
          <span className="ai-config-label">Presupuesto</span>
          <span className="ai-config-value">{config.budget}€/mes · ~{weeklyBudget}€/sem</span>
        </div>
        {config.preferences && (
          <div className="ai-config-row">
            <span className="ai-config-label">Preferencias</span>
            <span className="ai-config-value">{config.preferences}</span>
          </div>
        )}
        {config.exclusions && (
          <div className="ai-config-row">
            <span className="ai-config-label">Exclusiones</span>
            <span className="ai-config-value">{config.exclusions}</span>
          </div>
        )}
      </div>

      <button
        className="gen-btn"
        onClick={generate}
        disabled={loading || !hasKey}
        type="button"
      >
        {loading ? 'Generando lista...' : '✦ Generar Lista de Compra'}
      </button>

      {loading && (
        <div className="loading-box">
          <div className="loading-spinner" />
          <p className="loading-text">Claude está buscando precios en Mercadona…</p>
        </div>
      )}

      {error && (
        <div className="error-box">⚠ {error}</div>
      )}

      {result && (
        <div className="result-box">
          <Markdown text={result} />
        </div>
      )}
    </div>
  )
}
