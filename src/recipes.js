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
      kitchenBag: ['pomme', 'glachon'], // Les ingrédients vont dans "l'atelier"
      kitchenOutil: 'louche',
      kitchenRune: 'rune_louche',
      kitchenCarburant: 'charbon',
    },
  },
  // ... vous pourrez ajouter d'autres recettes ici
];