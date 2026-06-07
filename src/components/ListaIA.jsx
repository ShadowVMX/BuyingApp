import { useState, useEffect } from 'react'

/* ── Helpers ──────────────────────────────────────────── */

function hashStr(str) {
  let h = 0
  for (let i = 0; i < Math.min(str.length, 200); i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return Math.abs(h).toString(36)
}

function parseProducts(text) {
  const products = []
  let inList = false
  for (const line of text.split('\n')) {
    if (/^##\s*🛒/.test(line)) { inList = true; continue }
    if (/^##/.test(line))       { inList = false; continue }
    if (!inList || !/^[-*•] /.test(line)) continue
    const clean = line.replace(/^[-*•] /, '').replace(/\*\*/g, '').trim()
    const parts = clean.split(/\s*[—–]\s*/)
    products.push({
      id:    products.length,
      name:  parts[0]?.trim() ?? clean,
      qty:   parts[1]?.trim() ?? '',
      price: parts[2]?.trim() ?? '',
    })
  }
  return products
}

function parseInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  )
}

function Markdown({ text }) {
  return (
    <div className="md-content">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## '))  return <h2 key={i} className="md-h2">{parseInline(line.slice(3))}</h2>
        if (line.startsWith('### ')) return <h3 key={i} className="md-h3">{parseInline(line.slice(4))}</h3>
        if (/^[-*•] /.test(line))   return <div key={i} className="md-li">{parseInline(line.replace(/^[-*•] /, ''))}</div>
        if (/^\d+\. /.test(line))   return <div key={i} className="md-li">{parseInline(line.replace(/^\d+\. /, ''))}</div>
        if (line.trim() === '')     return <div key={i} className="md-spacer" />
        return <p key={i} className="md-p">{parseInline(line)}</p>
      })}
    </div>
  )
}

function toPlainText(markdown) {
  const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  const lines = markdown.split('\n').map(line => {
    if (line.startsWith('## '))  return `\n${line.slice(3).toUpperCase()}\n${'─'.repeat(32)}`
    if (line.startsWith('### ')) return `\n${line.slice(4)}`
    if (/^[-*•] /.test(line))   return `□  ${line.replace(/^[-*•] /, '').replace(/\*\*/g, '')}`
    if (/^\d+\. /.test(line))   return `□  ${line.replace(/^\d+\. /, '').replace(/\*\*/g, '')}`
    return line.replace(/\*\*/g, '')
  })
  return `LISTA DE COMPRA — MERCADONA\n${date}\n${'═'.repeat(32)}\n${lines.join('\n').trim()}`
}

function buildPrompt(_config, weeklyBudget) {
  return `Para cada producto de esta lista, busca en tulistadelmerca.es/productos-mercadona/[nombre-producto] y lee el precio exacto de la página. No uses estimaciones si encuentras el precio real.

CANTIDADES EXACTAS PARA 7 DÍAS:
Proteínas:
- Huevos enteros: 7 ud → 2 paquetes de 6
- Claras líquidas: 840 g → 1 botella de 1 L
- Pavo natural en lonchas: 420 g
- Pollo + pescado blanco + pescado azul: 2.800 g en total (repartir entre los tres)

Lácteos:
- Queso batido desnatado: 2.800 g → 3 envases de 1 kg

Pan:
- Pan de centeno: 3.080 g → 4 panes

Otros:
- Hummus: 420 g
- Nueces: 210 g
- Aceite de oliva: 140 ml
- Fruta variada: 700 g
- Verduras variadas: 1.400 g mínimo

Presupuesto: ${weeklyBudget}€/semana.

Responde en español con estos dos bloques y nada más:

## 🛒 Lista de Compra Semanal — Mercadona
Formato por producto: nombre — cantidad a comprar — precio€

## 💰 Resumen de Costes
Subtotal por categoría y total semanal comparado con ${weeklyBudget}€.`
}

/* ── Checklist ────────────────────────────────────────── */

const CL_KEY = 'mercafit-checklist'

function Checklist({ result }) {
  const hash     = hashStr(result)
  const products = parseProducts(result)

  const [checked, setChecked] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CL_KEY) ?? '{}')
      return s.hash === hash ? new Set(s.checked) : new Set()
    } catch { return new Set() }
  })

  // Reset checked state when a new list is generated
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CL_KEY) ?? '{}')
      if (s.hash !== hash) setChecked(new Set())
    } catch {}
  }, [hash])

  const persist = (next) =>
    localStorage.setItem(CL_KEY, JSON.stringify({ hash, checked: [...next] }))

  const toggle = (id) => setChecked(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    persist(next)
    return next
  })

  const reset = () => {
    setChecked(new Set())
    localStorage.removeItem(CL_KEY)
  }

  if (products.length === 0) return null

  const count  = checked.size
  const total  = products.length
  const pct    = Math.round((count / total) * 100)
  const sorted = [...products].sort((a, b) =>
    (checked.has(a.id) ? 1 : 0) - (checked.has(b.id) ? 1 : 0)
  )

  return (
    <div className="checklist">
      <div className="checklist-header">
        <div className="checklist-meta">
          <span className="checklist-title">Lista de compra</span>
          <span className="checklist-counter">{count}/{total} productos · {pct}%</span>
        </div>
        <button className="reset-btn" onClick={reset} type="button">Resetear</button>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="checklist-items">
        {sorted.map(item => (
          <li
            key={item.id}
            className={`checklist-item${checked.has(item.id) ? ' checked' : ''}`}
            onClick={() => toggle(item.id)}
          >
            <span className="ci-box">{checked.has(item.id) ? '✓' : ''}</span>
            <div className="ci-body">
              <span className="ci-name">{item.name}</span>
              <span className="ci-qty">{item.qty}</span>
            </div>
            <span className="ci-price">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Main component ───────────────────────────────────── */

export default function ListaIA({ config, result, setResult, loading, setLoading, error, setError }) {
  const [copied, setCopied] = useState(false)
  const weeklyBudget = Math.round(config.budget / 4.3)
  const hasKey = Boolean(config.apiKey?.trim())

  const handleCopy = () => {
    navigator.clipboard.writeText(toPlainText(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([toPlainText(result)], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = 'lista-mercafit.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

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
          max_tokens: 1500,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 1 }],
          tool_choice: { type: 'any' },
          messages: [{ role: 'user', content: buildPrompt(config, weeklyBudget) }],
        }),
      })

      if (!res.ok) {
        let msg = `Error HTTP ${res.status}`
        try { const e = await res.json(); msg = e.error?.message || msg } catch (_) {}
        throw new Error(msg)
      }

      const data = await res.json()
      const text = (data.content ?? [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n\n')
        .trim()

      if (!text) throw new Error('No se recibió respuesta de texto. Verifica tu API Key y vuelve a intentarlo.')
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
      </div>

      <button className="gen-btn" onClick={generate} disabled={loading || !hasKey} type="button">
        {loading ? 'Generando lista...' : '✦ Generar Lista de Compra'}
      </button>

      {loading && (
        <div className="loading-box">
          <div className="loading-spinner" />
          <p className="loading-text">Claude está buscando precios en Mercadona…</p>
        </div>
      )}

      {error && <div className="error-box">⚠ {error}</div>}

      {result && (
        <>
          <Checklist result={result} />

          <div className="export-row">
            <button className="export-btn" onClick={handleCopy} type="button">
              {copied ? '✓ Copiado' : '📋 Copiar lista'}
            </button>
            <button className="export-btn" onClick={handleDownload} type="button">
              ⬇ Descargar .txt
            </button>
          </div>

          <div className="result-box">
            <Markdown text={result} />
          </div>
        </>
      )}
    </div>
  )
}
