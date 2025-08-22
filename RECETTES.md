# Cahier de recette – Collector-Back

## 1. Informations générales
- **Projet** : Collector-Back
- **Type** : Backend (TypeScript / Node.js — NestJS)
- **Lien GitHub** : `https://github.com/zHatsuharu/collector-back`

---

## 2. Pré-requis techniques
- Node.js (version recommandée selon `package.json`)
- Gestionnaire de paquets : `pnpm` (ou `npm` si nécessaire)
- Base de données : PostgreSQL
- Accès réseau à une instance Postgres
- Accès à l’API Swagger locale (port 8000)

---

## 3. Installation & Configuration

### 3.1 Installer les dépendances
| Étape | Commande                   | Objectif                          |
|-------|----------------------------|-----------------------------------|
| 1     | `pnpm install`             | Installer tous les modules        |

### 3.2 Configuration de l’environnement
| Étape | Commande                                 | Objectif                                                       |
|-------|------------------------------------------|----------------------------------------------------------------|
| 2     | Copier `.env.exemple` en `.env`          | Préparer le fichier d’environnement                            |
| 3     | Modifier `.env`                          | Remplir les variables (connexion à PostgreSQL, ports, etc.)    |

### 3.3 Base de données & migrations
| Étape | Commande                        | Objectif                         |
|-------|----------------------------------|----------------------------------|
| 4     | `pnpm migrations:run`            | Appliquer les migrations        |

---

## 4. Exécution du projet

### 4.1 Mode développement
| Étape | Commande              | Objectif                                  |
|-------|-----------------------|-------------------------------------------|
| 5     | `pnpm start`          | Lancer l’application                      |
| 6     | `npm run start:dev`   | Démarrer en mode « watch » (reload auto)  |

### 4.2 Vérifier l’API Swagger
- URL : `http://localhost:8000/api`
- Vérifiez que toutes les routes attendues sont accessibles et documentées.

---

## 5. Tests

### 5.1 Tests unitaires
| Étape | Commande             | Objectif                          |
|-------|----------------------|-----------------------------------|
| 7     | `pnpm run test`      | Exécuter tous les tests unitaires |

### 5.2 Couverture de test
| Étape | Commande             | Objectif                         |
|-------|----------------------|----------------------------------|
| 8     | `pnpm run test:cov`  | Générer un rapport de couverture |

---

## 6. Cas de tests

### 6.1 Tests d’installation et lancement
1. Exécuter `pnpm install` — Valider que tout s’installe sans erreurs.
2. Copier `.env.exemple` en `.env` et renseigner les valeurs nécessaires.
3. Lancer `pnpm migrations:run` — Vérifier que les tables sont créées en base.
4. Lancer l’app via `pnpm start` ou `npm run start:dev`.
5. Accéder à `http://localhost:8000/api` — Vérifier l’intégrité de Swagger.

### 6.2 Tests d’API
- Tester au moins une route GET, POST, PATCH, DELETE si elles existent :
  - Ex. : GET `/users`, POST `/users` avec payload valide, etc.
- Vérifier les statuts HTTP attendus (200, 201, 400, 404, etc.).
- Tester les validations d’entrée (champs manquants, formats invalides).

### 6.3 Tests d’erreurs
- Entrer des données invalides — Vérifier que l’erreur renvoyée est correcte (statut, message).
- Tester un endpoint protégé ou inexistant — Vérifier le comportement attendu.

### 6.4 Tests de couverture
- Vérifier le rapport généré par `test:cov` :
  1. Taux global de couverture.
  2. Lignes, fonctions ou branches non couvertes.
  3. Éviter les zones critiques sans tests.

---

## 7. Critères de validation (Définir les seuils, si besoin)
| Élément                            | Critère acceptable                          |
|-----------------------------------|---------------------------------------------|
| Installation                      | Aucune erreur, fichiers créés correctement  |
| Migrations                        | Tables créées selon les scripts             |
| Lancement / Swagger               | Endpoint accessible et documentation OK     |
| API fonctionnelle                 | Réponse conforme aux spécifications         |
| Gestion des erreurs               | Codes & messages appropriés                 |
| Couverture de tests               | ≥ 80 % (ou seuil interne défini)            |

---

## 8. Prochaine étape proposée
- Intégrer des tests d’intégration (connexion réelle à Postgres, tests End-to-End).
- Ajouter tests des scénarios critiques métier.
- Intégrer CI (GitHub Actions) pour automatiser les tests à chaque push.
- Déployer un environnement de recette / staging.

---