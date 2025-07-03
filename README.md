# ProprioPlus

Ce projet utilise **Laravel 12** avec **React** et Inertia pour construire une plateforme de vente immobilière. Tout le contenu est prévu en français.

Un système de recommandations propose désormais automatiquement des annonces en fonction des recherches sauvegardées et des favoris des utilisateurs.

## Installation

1. Cloner le dépôt puis installer les dépendances PHP et Node.
2. Copier le fichier `.env.example` vers `.env` puis ajuster la configuration.
3. Lancer les migrations avec `php artisan migrate`.

## Développement

- Les pages React se trouvent dans `resources/js/Pages` et utilisent Chakra UI pour garantir un rendu responsive.
- Les anciens composants Vue ont été retirés pour simplifier la maintenance.

## Tests

Exécuter les tests avec :

```bash
php artisan test
```

