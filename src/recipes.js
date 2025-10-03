export const recipes = [
  {
    name: 'Poto-Bois',
    result: {
      // L'ID du cube original 'poto-bois' qui doit exister dans cubes.js
      originalCubeId: 'poto-bois',
      img_src: 'assets/page_cake_olivier_2.png',
      type: 'result', // Un type spécifique pour les objets fabriqués
    },
    ingredients: {
      // Les IDs des cubes originaux requis pour la recette
      kitchenReceptacle: 'petit_chaudron', // Le chaudron va dans la zone "réceptacle"
      kitchenBag: [, 'glachon', 'pomme'], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'louche',
      kitchenRune: 'rune_louche',
      kitchenCarburant: 'charbon',
    },
  },
  {
    name: 'olivier_cake',
    result: {
      // L'ID du cube original 'olivier_cake' qui doit exister dans cubes.js
      originalCubeId: 'olivier_cake',
      img_src: 'assets/page_cake_olivier_1.png',
      type: 'result', // Un type spécifique pour les objets fabriqués
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
  },
  // ... vous pourrez ajouter d'autres recettes ici
];