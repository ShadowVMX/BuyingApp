export const meals = [
  {
    id: 'desayuno',
    name: 'Desayuno',
    emoji: '☀️',
    time: '08:00',
    items: [
      { name: 'Huevo entero',     amount: '1 ud' },
      { name: 'Claras de huevo',  amount: '120 g' },
      { name: 'Pan de centeno',   amount: '120 g' },
      { name: 'Pavo natural',     amount: '60 g' },
      { name: 'Hummus',           amount: '60 g' },
    ],
  },
  {
    id: 'media-manana',
    name: 'Media Mañana',
    emoji: '🍎',
    time: '11:00',
    items: [
      { name: 'Queso batido desnatado', amount: '200 g' },
      { name: 'Fruta',                  amount: '50 g' },
      { name: 'Nueces',                 amount: '15 g' },
    ],
  },
  {
    id: 'comida',
    name: 'Comida',
    emoji: '🍽️',
    time: '14:00',
    items: [
      { name: 'Pollo o pescado',                              amount: '200 g' },
      { name: 'Pan de centeno / Pasta integral / Patatas',    amount: '160 g / 80 g / 320 g' },
      { name: 'Verduras',                                     amount: '100 g mín.' },
      { name: 'Aceite de oliva',                              amount: '10 g' },
    ],
  },
  {
    id: 'media-tarde',
    name: 'Media Tarde',
    emoji: '⏰',
    time: '17:30',
    items: [
      { name: 'Queso batido desnatado', amount: '200 g' },
      { name: 'Fruta',                  amount: '50 g' },
      { name: 'Nueces',                 amount: '15 g' },
    ],
  },
  {
    id: 'cena',
    name: 'Cena',
    emoji: '🌙',
    time: '21:00',
    items: [
      { name: 'Pollo / Pescado blanco / Pescado azul',     amount: '200 g / 300 g / 200 g' },
      { name: 'Pan de centeno / Pasta integral / Patatas', amount: '160 g / 80 g / 320 g' },
      { name: 'Verduras',                                  amount: '100 g mín.' },
      { name: 'Aceite de oliva',                           amount: '10 g' },
    ],
  },
]

export const supplements = [
  {
    id: 'post-entreno',
    timing: 'Post-Entreno',
    emoji: '💪',
    description: 'Inmediatamente después del entrenamiento',
    items: [
      { name: 'Whey Protein',        amount: '40 g',                  note: 'proteína de suero · absorción rápida' },
      { name: 'Dextrosa',            amount: '30 g',                  note: 'carbohidrato de absorción rápida · repone glucógeno' },
      { name: 'Creatina Monohidrato',amount: '7 g',                   note: 'fuerza, volumen muscular y recuperación' },
      { name: 'BCAAs',               amount: '5 g',                   note: 'leucina, isoleucina y valina · anticatabólico' },
      { name: 'Glutamina',           amount: '5 g',                   note: 'recuperación muscular y salud intestinal' },
    ],
  },
  {
    id: 'desayuno-supl',
    timing: 'Desayuno',
    emoji: '🌅',
    description: 'Con la primera comida del día',
    items: [
      { name: 'Multivitamínico', amount: '1 cápsula',     note: 'complejo de vitaminas y minerales esenciales' },
      { name: 'Vitamina C',      amount: '500 mg',         note: 'sistema inmunitario y síntesis de colágeno' },
    ],
  },
  {
    id: 'omega-3',
    timing: 'Comidas Principales (×3)',
    emoji: '🐟',
    description: 'Desayuno, comida y cena',
    items: [
      { name: 'Omega 3', amount: '1–2 cápsulas · 1 g EPA+DHA', note: 'inflamación, salud cardiovascular y función cognitiva' },
    ],
  },
]
