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
  return `Genera una lista de compra semanal de Mercadona España basada exactamente en esta dieta fija para 7 días:

CANTIDADES SEMANALES EXACTAS (7 días):
- Huevos enteros: 7 ud
- Claras de huevo: 840 g
- Pan de centeno: 840 g (desayuno) + 2240 g (comidas+cenas) = 3080 g total
- Pavo natural lonchas: 420 g
- Hummus: 420 g
- Queso batido desnatado: 2800 g (media mañana + media tarde)
- Fruta variada: 700 g
- Nueces: 210 g
- Pollo o pescado (comida): 1400 g
- Pollo/pescado blanco/azul (cena): 1400 g
- Verduras variadas: 1400 g mínimo
- Aceite de oliva: 140 ml
- Pasta integral o patatas (alternativa al pan): opcional

Presupuesto: ${weeklyBudget}€/semana.

Usa web search para obtener precios de referencia en Mercadona España. Después genera SIEMPRE la lista completa: si algún precio no aparece exacto en los resultados, usa una estimación razonable basada en precios típicos de supermercado español. Nunca rechaces ni dejes la lista incompleta.

Responde en español con estos dos bloques y nada más:

## 🛒 Lista de Compra Semanal — Mercadona
Productos según las cantidades anteriores. Formato: producto — cantidad a comprar — precio estimado.

## 💰 Resumen de Costes
Subtotal por categoría y total semanal comparado con ${weeklyBudget}€.`
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
          max_tokens: 1500,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 1 }],
          tool_choice: { type: 'any' },
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
