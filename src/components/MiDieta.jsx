import { useState } from 'react'
import { meals } from '../data/diet'

function MealBlock({ meal }) {
  const [open, setOpen]       = useState(false)
  const [selected, setSelected] = useState(meal.options[0].id)

  const option = meal.options.find(o => o.id === selected)

  return (
    <div className={`meal-block${open ? ' open' : ''}`}>
      <button className="meal-header" onClick={() => setOpen(v => !v)}>
        <span className="meal-emoji">{meal.emoji}</span>
        <div className="meal-meta">
          <span className="meal-name">{meal.name}</span>
          <span className="meal-time">{meal.time}</span>
        </div>
        <span className="meal-selected-preview">{option?.label}</span>
        <span className="meal-chevron">▾</span>
      </button>

      {open && (
        <div className="meal-body">
          <div className="options-row">
            {meal.options.map(opt => (
              <button
                key={opt.id}
                className={`option-pill${selected === opt.id ? ' selected' : ''}`}
                onClick={() => setSelected(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {option && (
            <div className="meal-items-box">
              <span className="macros-tag">{option.macros}</span>
              <ul className="items-list">
                {option.items.map((item, i) => (
                  <li key={i} className="item-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">{item.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MiDieta() {
  return (
    <div>
      <h1 className="section-title">Mi Dieta</h1>
      <p className="section-sub">Protocolo Juanma · DavFit — selecciona tu opción por comida</p>
      <div className="meals-list">
        {meals.map(meal => (
          <MealBlock key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  )
}
