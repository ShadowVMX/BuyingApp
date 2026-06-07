import { useState } from 'react'
import { meals } from '../data/diet'

function MealBlock({ meal }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`meal-block${open ? ' open' : ''}`}>
      <button className="meal-header" onClick={() => setOpen(v => !v)}>
        <span className="meal-emoji">{meal.emoji}</span>
        <div className="meal-meta">
          <span className="meal-name">{meal.name}</span>
          <span className="meal-time">{meal.time}</span>
        </div>
        <span className="meal-chevron">▾</span>
      </button>

      {open && (
        <div className="meal-body">
          <div className="meal-items-box" style={{ paddingTop: '12px' }}>
            <ul className="items-list">
              {meal.items.map((item, i) => (
                <li key={i} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-amount">{item.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MiDieta() {
  return (
    <div>
      <h1 className="section-title">Mi Dieta</h1>
      <p className="section-sub">Protocolo Juanma · DavFit</p>
      <div className="meals-list">
        {meals.map(meal => (
          <MealBlock key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  )
}
