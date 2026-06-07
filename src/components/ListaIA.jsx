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
  return `Eres un experto en nutrición deportiva y en la tienda Mercadona España.

La dieta del atleta es alta en proteínas, estructurada en 5 comidas al día (desayuno, media mañana, comida, media tarde, cena), enfocada en rendimiento y composición corporal.

CONTEXTO DEL USUARIO:
- Presupuesto semanal disponible: ~${weeklyBudget}€ (${config.budget}€/mes)
${config.preferences ? `- Preferencias alimentarias: ${config.preferences}` : ''}
${config.exclusions   ? `- Alimentos excluidos: ${config.exclusions}`        : ''}

Usa web search para verificar precios actuales reales de productos en Mercadona España y genera una respuesta en español con exactamente estos tres bloques:

## 🛒 Lista de Compra Semanal — Mercadona

Lista completa de los productos necesarios para cubrir las 5 comidas diarias durante 7 días. Para cada producto incluye: nombre exacto del producto en Mercadona, cantidad necesaria para la semana y precio estimado actual. Organiza por categorías: Proteínas, Lácteos y Huevos, Carbohidratos, Verduras y Frutas, Aceites y Condimentos.

## 💰 Resumen de Costes

Coste subtotal por categoría. Coste total semanal. Indica si entra dentro del presupuesto de ${weeklyBudget}€/semana o cuánto se excede/ahorra.

## 📅 Menú 3 Días de Ejemplo

Menú completo de 3 días usando únicamente los productos de la lista. Para cada día incluye las 5 comidas con cantidades. Al final de cada día indica los macros totales estimados: calorías totales, proteínas (g), carbohidratos (g) y grasas (g).

Usa precios reales actuales de Mercadona España. Sé específico con los nombres de los productos.`
}

export default function ListaIA({ config }) {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

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
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
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
