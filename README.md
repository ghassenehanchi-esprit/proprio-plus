# ProprioPlus

Ce projet utilise **Laravel 12** avec **React** et Inertia pour construire une plateforme de vente immobilière. Tout le contenu est prévu en français.

> **Note :** L'application est uniquement orientée vers la **vente** de biens immobiliers. Aucune fonctionnalité de prêt ou de financement n'est prévue.

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

## Signature électronique et génération de PDF

Le projet s'appuie sur le composant React **react-signature-canvas** pour
capturer les signatures. Pour générer des PDF, installez l'extension gratuite
`barryvdh/laravel-dompdf` :

```bash
composer require barryvdh/laravel-dompdf
composer require dropbox/sign
```

Une fois la dépendance ajoutée, un nouveau point d'entrée permet de télécharger
une **attestation de loyer** signée :

```text
GET /pdf/attestation/{listing}
```

Cette route génère un PDF au format proche des attestations de loyer françaises
en incluant la signature enregistrée.

Si vous renseignez une clé API **HELLOSIGN_API_KEY** dans votre fichier `.env`,
l'application utilisera l'API gratuite de **Dropbox Sign** (ex‑HelloSign) pour
envoyer une demande de signature électronique officielle. Sans cette clé, la
signature manuelle via `react-signature-canvas` sera utilisée.

### Étapes de signature

Le processus de vente est sécurisé par plusieurs documents électroniques :

1. **Mandat de vente** : le propriétaire signe le mandat directement depuis l'application.
2. **Bon de visite** : chaque visiteur peut signer numériquement son passage.
3. **Offre d'achat** : l'acheteur propose son prix via un formulaire signé.
4. **Compromis de vente** puis **acte définitif** : les deux parties finalisent la vente.

Les signatures sont stockées en base et peuvent être intégrées dans les PDF générés via l'API ci-dessus.

