export const recipes = [
  {
    name: 'olivier_cake',
    result: {
      // L'ID du cube original 'poto-bois' qui doit exister dans cubes.js
      originalCubeId: 'result_secret_1',
    },
    ingredients: {
      // Les IDs des cubes originaux requis pour la recette
      kitchenReceptacle: 'cake_moule', // Le chaudron va dans la zone "réceptacle"
      kitchenBag: [
        'farine',
        'levure',
        'oeuf',
        'huile',
        'vin_blanc',
        'porto',
        'olivier_pousse',
        'jambon',
        'gruyere',
      ], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'batteur',
      kitchenRune: 'rune_batteur',
      kitchenCarburant: 'beure',
    },
    secret: ['block_BI_1_1', 'block_BI_1_2', 'block_BI_1_3', 'block_BI_1_4', 'block_BI_1_5'], // Les IDs des cubes à rendre visibles (disp: true)
    discover: ['indice_secret_1', 'result_secret_1'] // Les IDs des cubes à marquer comme découverts (find: true)
  },
   {
    name: 'recette secrète 1',
    result: {
      // L'ID du cube original 'poto-bois' qui doit exister dans cubes.js
      originalCubeId: 'block_B_secret_1',
    },
    ingredients: {
      // Les IDs des cubes originaux requis pour la recette
      kitchenReceptacle: 'petit_chaudron', // Le chaudron va dans la zone "réceptacle"
      kitchenBag: [
        'block_BI_1_1',
        'block_BI_1_2',
        'block_BI_1_3',
        'block_BI_1_4',
        'block_BI_1_5'
      ], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'louche',
      kitchenRune: 'rune_louche',
      kitchenCarburant: 'charbon',
    },
    secret: [], // Les IDs des cubes à rendre visibles (disp: true)
    discover: ['page_B_secret_1_1', 'page_B_secret_1_2', 'block_B_secret_1'] // Les IDs des cubes à marquer comme découverts (find: true)
  },
  {
    name: 'ragout_facon_bucheron',
    result: {
      // L'ID du cube original 'poto-bois' qui doit exister dans cubes.js
      originalCubeId: 'result_secret_2',
    },
    ingredients: {
      // Les IDs des cubes originaux requis pour la recette
      kitchenReceptacle: 'petit_chaudron', // Le chaudron va dans la zone "réceptacle"
      kitchenBag: [
        'ecorce',
        'branche_sapin',
        'sciure',
        'champignon',
        'carotte',
        'patate',
        'sel',
      ], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'louche',
      kitchenRune: 'rune_louche',
      kitchenCarburant: 'charbon',
    },
    secret: ['block_BI_2_1', 'block_BI_2_2', 'block_BI_2_3', 'block_BI_2_4', 'block_BI_2_5', 'block_BI_2_6'], // Les IDs des cubes à rendre visibles (disp: true)
    discover: ['indice_secret_2', 'result_secret_2'] // Les IDs des cubes à marquer comme découverts (find: true)
  },
   {
    name: 'recette secrète 2',
    result: {
      // L'ID du cube original 'poto-bois' qui doit exister dans cubes.js
      originalCubeId: 'block_B_secret_2',
    },
    ingredients: {
      // Les IDs des cubes originaux requis pour la recette
      kitchenReceptacle: 'petit_chaudron', // Le chaudron va dans la zone "réceptacle"
      kitchenBag: [
        'block_BI_2_1',
        'block_BI_2_2',
        'block_BI_2_3',
        'block_BI_2_4',
        'block_BI_2_5',
        'block_BI_2_6'
      ], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'louche',
      kitchenRune: 'rune_louche',
      kitchenCarburant: 'charbon',
    },
    secret: [], // Les IDs des cubes à rendre visibles (disp: true)
    discover: ['page_B_secret_2_1', 'page_B_secret_2_2', 'page_B_secret_2_3', 'block_B_secret_2'] // Les IDs des cubes à marquer comme découverts (find: true)
  },
];