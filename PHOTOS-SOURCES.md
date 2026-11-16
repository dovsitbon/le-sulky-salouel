# Photos du site : sources et licences

Relevé du 16 novembre 2026. **8 photos réelles du commerce, 3 photos libres de droits.**

## Photos réelles du Sulky

Source : fiche Google Maps « Le Sulky », 23 route de Rouen, 80480 Salouël (galerie de la fiche, photos publiées par l'établissement, mai 2024 pour la première).
Droits : photos du commerce, utilisées sur son propre site. **À confirmer avec le gérant** (et à remplacer par ses originaux en pleine résolution s'il les a).
Originaux téléchargés dans `assets/raw/` (non versionné), liste des adresses dans `assets/raw/urls.txt`.

| Fichier (public/media) | Emplacement | Contenu | Original |
|---|---|---|---|
| hero/bar-comptoir-salle-renovee.webp | Hero, tuile Bar | Salle rénovée, comptoir bois, tabourets bleus, étagères éclairées | g2 |
| bar/comptoir-et-rayon-tabac.webp | Page « Bar tabac à Salouël » | Comptoir et rayon tabac après rénovation | g1 |
| facade/enseigne-pmu-presse-terrasse.webp | Infos pratiques | Enseigne « Le Sulky PMU Presse » et terrasse | g7 |
| bar/cafe-au-comptoir.webp | Bloc « Le café du matin » | Café au comptoir (recadré, sans personne) | g9 |
| bar/terrasse-biere-pression.webp | Service et tuile « Bar & café » | Bière pression en terrasse | g5 |
| services/caisse-et-rayon-tabac.webp | Service et tuile « Tabac » | Caisse et linéaire tabac | g4 |
| bar/salle-ecran-tv.webp | Service et tuile « PMU » | Salle, tables et écran TV | g6 |
| services/presse-magazines.webp | Service et tuile « Presse » | Rayon presse (recadré, sans visage) | g8 |

Écartées : g3 (ancienne salle avant rénovation, clients de face) et g10 (étagères éclairées en violet, doublon).

## Photos libres de droits (illustrations)

Licence Unsplash : usage commercial autorisé, sans attribution obligatoire (https://unsplash.com/license). Sur le site, elles portent la mention « Photo d'illustration » et un texte alternatif qui ne les présente pas comme le commerce.

| Fichier (public/media) | Emplacement | Photo | Auteur | Lien |
|---|---|---|---|---|
| services/course-de-trot-unsplash.webp | Bloc « Courses & matchs », tuile/carte PMU courses | Trotteur attelé sur piste | Quinn Simonson | https://unsplash.com/photos/PPfJwpOWSJg |
| services/colis-carton-unsplash.webp | Point relais (carte, tuile, bloc, page relais) | Colis en carton | Brandable Box | https://unsplash.com/photos/8mCsyImZRGY |
| services/boules-loto-unsplash.webp | FDJ (carte, tuile) | Boules de loto dans une machine | dylan nolte | https://unsplash.com/photos/RSsqjpezn6o |

## Encore à photographier sur place

- L'équipe au comptoir (emplacement `equipe`, non affiché pour l'instant)
- Le coin colis réel, le coin jeux FDJ, l'écran des courses pendant une réunion (pour remplacer les 3 illustrations)

Pour remplacer une photo : déposer le fichier dans `public/media/…`, puis mettre à jour son chemin et ses dimensions dans `data/photos.json` (retirer `stock: true`).
