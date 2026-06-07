import { supplements } from '../data/diet'

export default function Suplementos() {
  return (
    <div>
      <h1 className="section-title">Suplementos</h1>
      <p className="section-sub">Protocolo completo · toma diaria</p>

      <div className="supls-list">
        {supplements.map(group => (
          <div key={group.id} className="supl-card">
            <div className="supl-card-header">
              <span className="supl-emoji">{group.emoji}</span>
              <div>
                <div className="supl-timing">{group.timing}</div>
                <div className="supl-desc">{group.description}</div>
              </div>
            </div>

            <div className="supl-items">
              {group.items.map((item, i) => (
                <div key={i} className="supl-item">
                  <div className="supl-item-row">
                    <span className="supl-name">{item.name}</span>
                    <span className="supl-amount">{item.amount}</span>
                  </div>
                  <div className="supl-note">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
