/**
 * Ce fichier contient les définitions de types JSDoc pour le projet.
 * @see https://jsdoc.app/tags-typedef.html
 */

/**
 * @typedef {object} CubeInfo
 * @property {string} id - L'identifiant unique du cube.
 * @property {string} img_src - Le chemin vers l'image du cube.
 * @property {string} type - Le type de cube (ex: 'ingredient', 'outil').
 * @property {string} width - La largeur du cube (ex: '50px').
 * @property {string} height - La hauteur du cube (ex: '50px').
 * @property {string} x_out - La position horizontale (coordonnée X).
 * @property {string} y_out - La position verticale (coordonnée Y).
 * @property {number} opacity - L'opacité du cube.
 * @property {boolean} find - Si le cube a été trouvé par le joueur.
 * @property {boolean} disp - Si le cube doit être affiché initialement.
 * @property {number} [page] - Le numéro de la page du livre où se trouve le cube.
 * @property {'left' | 'right'} [side] - Le côté de la page (gauche ou droit).
 * @property {boolean} [stocked] - Si le cube est dans l'inventaire.
 */
export {}; // Nécessaire pour que le fichier soit traité comme un module.