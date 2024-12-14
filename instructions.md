# Instructions pour le Projet Neighbours Foods Sharing App

## 1. **Objectifs Clés**

- Faciliter le partage et la vente de repas faits maison entre voisins.
- Créer une plateforme intuitive permettant la connexion sociale et la convivialité au sein des communautés.
- Assurer une gestion fluide des utilisateurs, des annonces, des commandes et des paiements.

## 2. **Configuration de l'Environnement de Développement**

### Backend
- Utilisez Node.js avec TypeScript.
- Base de données PostgreSQL via Prisma.
- Authentification Firebase (e-mail, Google).

### Frontend
- Framework : Next.js avec TypeScript.
- Style : Tailwind CSS.
- Validation : Zod Validator pour la validation côté serveur.

## 3. **Architecture Globale**

- Modèle MVC (Model-View-Controller) pour structurer le projet.
- API REST pour les interactions frontend-backend.
- Gestion des paiements via Stripe.

---

## 4. **Développement du Backend**

### 4.1 Structure de Base
- Configurez les modèles Prisma pour :
  - Utilisateurs
  - Bâtiments
  - Plats
  - Commandes
  - Messages
- Intégrez Firebase pour l'authentification.

### 4.2 Fonctionnalités Principales

#### Gestion des Utilisateurs
- CRUD pour les utilisateurs (création, lecture, mise à jour, suppression).

#### Gestion des Plats
- API pour publier, modifier et supprimer des annonces.
- Filtrage avancé (type de plat, prix, disponibilité).

#### Commandes
- Système de commande des plats avec intégration Stripe.
- Suivi des statuts (en attente, confirmée, livrée).

#### Messagerie
- Système de chat en temps réel avec Socket.IO.

---

## 5. **Développement du Frontend**

### 5.1 Structure de Base
- Pages principales : Accueil, Annonces, Détails d’un plat, Profil, Connexion/Inscription.

### 5.2 Composants Réutilisables
- Barre de navigation
- Cartes pour les annonces
- Formulaires (inscription, connexion, publication de plats)
- Notifications en temps réel

### 5.3 Recherche et Filtrage
- Intégration de filtres avancés pour la recherche (proximité, prix, type de plat).

---

## 6. **Gestion des Rôles et Administrateurs**

- Créez une interface pour les administrateurs permettant :
  - La gestion des utilisateurs (modération, suppression de comptes).
  - La gestion des bâtiments (ajout, modification, suppression).

---

## 7. **Tests et Validation**

### 7.1 Tests Unitaires et d’Intégration
- Backend : Utilisez Jest ou Mocha/Chai.
- Frontend : Cypress pour les tests end-to-end.

### 7.2 Expérience Utilisateur
- Testez l’interface sur divers appareils et navigateurs.

---

## 8. **Déploiement**

### Backend
- Déployez sur Railway ou Heroku avec PostgreSQL.

### Frontend
- Déployez le site sur Vercel.

---

## 9. **Maintenance et Améliorations**

- Analyse des retours utilisateurs pour identifier les améliorations.
- Correction des bugs mineurs détectés en production.
- Mise à jour des dépendances et technologies utilisées.

---

## 10. **.env et Variables d’Environnement**

- **Backend**
  ```env
  DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
  JWT_SECRET="votre_clé_secrète"
  FIREBASE_PROJECT_ID="votre_id_projet"
  FIREBASE_PRIVATE_KEY="votre_clé_privée"
  FIREBASE_CLIENT_EMAIL="votre_email_admin"
  ```

- **Frontend**
  ```env
  NEXT_PUBLIC_API_URL="http://localhost:3001"
  NEXT_PUBLIC_FIREBASE_API_KEY="votre_clé_api"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="votre_domaine_auth"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID="votre_id_projet"
  ```


