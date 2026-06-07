export const meals = [
  {
    id: 'desayuno',
    name: 'Desayuno',
    emoji: '☀️',
    time: '08:00',
    options: [
      {
        id: 'des-a',
        label: 'Avena con claras y plátano',
        macros: '~555 kcal · P 38g · C 80g · G 8g',
        items: [
          { name: 'Avena en copos', amount: '80 g' },
          { name: 'Claras de huevo', amount: '200 ml · ≈5 claras' },
          { name: 'Plátano', amount: '1 mediano · 120 g' },
          { name: 'Canela molida', amount: 'al gusto' },
        ],
      },
      {
        id: 'des-b',
        label: 'Tostadas con huevos y aguacate',
        macros: '~500 kcal · P 28g · C 48g · G 22g',
        items: [
          { name: 'Pan integral de molde', amount: '60 g · 2 rebanadas' },
          { name: 'Huevos enteros', amount: '2 unidades' },
          { name: 'Aguacate', amount: '50 g' },
          { name: 'Tomate cherry', amount: '100 g' },
          { name: 'AOVE', amount: '5 ml' },
        ],
      },
      {
        id: 'des-c',
        label: 'Yogur griego con avena y fresas',
        macros: '~415 kcal · P 30g · C 58g · G 6g',
        items: [
          { name: 'Yogur griego 0% M.G.', amount: '250 g' },
          { name: 'Avena en copos finos', amount: '50 g' },
          { name: 'Fresas frescas', amount: '150 g' },
          { name: 'Miel', amount: '10 g' },
        ],
      },
    ],
  },
  {
    id: 'media-manana',
    name: 'Media Mañana',
    emoji: '🍎',
    time: '11:00',
    options: [
      {
        id: 'mm-a',
        label: 'Pavo con manzana y almendras',
        macros: '~230 kcal · P 25g · C 20g · G 6g',
        items: [
          { name: 'Pechuga de pavo en lonchas', amount: '100 g' },
          { name: 'Manzana', amount: '1 mediana · 150 g' },
          { name: 'Almendras crudas', amount: '15 g' },
        ],
      },
      {
        id: 'mm-b',
        label: 'Requesón con nueces y miel',
        macros: '~285 kcal · P 22g · C 18g · G 15g',
        items: [
          { name: 'Requesón', amount: '200 g' },
          { name: 'Nueces', amount: '20 g' },
          { name: 'Miel', amount: '10 g' },
          { name: 'Melocotón', amount: '1 mediano · 120 g' },
        ],
      },
      {
        id: 'mm-c',
        label: 'Batido de proteína con arroz',
        macros: '~330 kcal · P 34g · C 40g · G 3g',
        items: [
          { name: 'Whey protein (vainilla)', amount: '30 g · 1 scoop' },
          { name: 'Arroz blanco cocido', amount: '100 g' },
          { name: 'Plátano pequeño', amount: '80 g' },
          { name: 'Agua fría', amount: '300 ml' },
        ],
      },
    ],
  },
  {
    id: 'comida',
    name: 'Comida',
    emoji: '🍽️',
    time: '14:00',
    options: [
      {
        id: 'com-a',
        label: 'Arroz con pollo y brócoli',
        macros: '~680 kcal · P 52g · C 82g · G 12g',
        items: [
          { name: 'Arroz blanco (en seco)', amount: '100 g' },
          { name: 'Pechuga de pollo', amount: '200 g' },
          { name: 'Brócoli', amount: '150 g' },
          { name: 'AOVE', amount: '10 ml' },
          { name: 'Sal y especias', amount: 'al gusto' },
        ],
      },
      {
        id: 'com-b',
        label: 'Patata con merluza y ensalada',
        macros: '~620 kcal · P 48g · C 70g · G 14g',
        items: [
          { name: 'Patata', amount: '200 g' },
          { name: 'Merluza al horno', amount: '200 g' },
          { name: 'Lechuga romana', amount: '80 g' },
          { name: 'Tomate', amount: '1 mediano · 100 g' },
          { name: 'AOVE', amount: '10 ml' },
        ],
      },
      {
        id: 'com-c',
        label: 'Pasta integral con ternera',
        macros: '~720 kcal · P 50g · C 90g · G 14g',
        items: [
          { name: 'Pasta integral (en seco)', amount: '90 g' },
          { name: 'Carne picada de ternera 5%', amount: '150 g' },
          { name: 'Tomate triturado natural', amount: '200 g' },
          { name: 'Cebolla', amount: '50 g' },
          { name: 'AOVE', amount: '10 ml' },
        ],
      },
    ],
  },
  {
    id: 'media-tarde',
    name: 'Media Tarde',
    emoji: '⏰',
    time: '17:30',
    options: [
      {
        id: 'mt-a',
        label: 'Requesón con melocotón',
        macros: '~240 kcal · P 22g · C 28g · G 4g',
        items: [
          { name: 'Requesón', amount: '200 g' },
          { name: 'Melocotón fresco', amount: '1 grande · 180 g' },
          { name: 'Canela', amount: 'al gusto' },
        ],
      },
      {
        id: 'mt-b',
        label: 'Pan integral con pavo',
        macros: '~255 kcal · P 22g · C 30g · G 4g',
        items: [
          { name: 'Pan integral de molde', amount: '40 g · 1–2 rebanadas' },
          { name: 'Pechuga de pavo', amount: '80 g' },
          { name: 'Tomate en rodajas', amount: '1 mediano' },
          { name: 'AOVE', amount: '5 ml' },
        ],
      },
      {
        id: 'mt-c',
        label: 'Yogur con almendras y fresas',
        macros: '~280 kcal · P 20g · C 18g · G 14g',
        items: [
          { name: 'Yogur griego 0% M.G.', amount: '200 g' },
          { name: 'Almendras crudas', amount: '25 g' },
          { name: 'Fresas frescas', amount: '100 g' },
        ],
      },
    ],
  },
  {
    id: 'cena',
    name: 'Cena',
    emoji: '🌙',
    time: '21:00',
    options: [
      {
        id: 'cen-a',
        label: 'Pollo con verduras salteadas',
        macros: '~450 kcal · P 48g · C 18g · G 18g',
        items: [
          { name: 'Pechuga de pollo', amount: '200 g' },
          { name: 'Calabacín', amount: '150 g' },
          { name: 'Pimiento rojo', amount: '100 g' },
          { name: 'Cebolla', amount: '50 g' },
          { name: 'AOVE', amount: '15 ml' },
        ],
      },
      {
        id: 'cen-b',
        label: 'Salmón con espárragos',
        macros: '~480 kcal · P 44g · C 8g · G 30g',
        items: [
          { name: 'Salmón fresco (lomo)', amount: '180 g' },
          { name: 'Espárragos trigueros', amount: '150 g' },
          { name: 'Ensalada variada (bolsa)', amount: '80 g' },
          { name: 'AOVE', amount: '10 ml' },
          { name: 'Limón', amount: '½ unidad' },
        ],
      },
      {
        id: 'cen-c',
        label: 'Tortilla de claras con atún',
        macros: '~380 kcal · P 52g · C 8g · G 16g',
        items: [
          { name: 'Claras de huevo', amount: '240 ml · 6 claras' },
          { name: 'Atún al natural', amount: '2 latas · 160 g escurrido' },
          { name: 'Espinacas frescas', amount: '100 g' },
          { name: 'Tomate', amount: '1 mediano' },
          { name: 'AOVE', amount: '10 ml' },
        ],
      },
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
      { name: 'Whey Protein', amount: '40 g', note: 'proteína de suero · absorción rápida' },
      { name: 'Dextrosa', amount: '30 g', note: 'carbohidrato de absorción rápida · repone glucógeno' },
      { name: 'Creatina Monohidrato', amount: '7 g', note: 'fuerza, volumen muscular y recuperación' },
      { name: 'BCAAs', amount: '5 g', note: 'leucina, isoleucina y valina · anticatabólico' },
      { name: 'Glutamina', amount: '5 g', note: 'recuperación muscular y salud intestinal' },
    ],
  },
  {
    id: 'desayuno-supl',
    timing: 'Desayuno',
    emoji: '🌅',
    description: 'Con la primera comida del día',
    items: [
      { name: 'Multivitamínico', amount: '1 cápsula', note: 'complejo de vitaminas y minerales esenciales' },
      { name: 'Vitamina C', amount: '500 mg', note: 'sistema inmunitario y síntesis de colágeno' },
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
