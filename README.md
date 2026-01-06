# 🚀 LexiMatch - Similarity Search Engine

**LexiMatch** est un moteur de recherche de similarité haute performance développé pour **LittleBig Connection**. Il permet de filtrer et de classer des termes au sein d'un dataset personnalisé en utilisant un algorithme de comparaison par fenêtre glissante.

---

## 🏗️ Architecture du Code
Le projet est structuré selon le principe de **séparation des préoccupations (SoC)** :

### 1. Couche Logique (`src/searchLogic.ts`)
La classe `SearchEngine` encapsule toute l'intelligence métier :
- **Sanitisation** : Conversion en minuscules, normalisation Unicode (NFD) pour supprimer les accents, et filtrage strict des caractères non-alphanumériques.
- **Validation** : Détection des entrées invalides pour alerter l'utilisateur.
- **Algorithme** : Calcul du score de différence via une fenêtre glissante.

### 2. Couche UI (`src/App.tsx`)
L'interface React gère l'expérience utilisateur :
- **Gestion d'État** : Utilisation de `useState` et `useMemo` pour optimiser les performances de recherche.
- **Feedback** : Système d'alertes "Toast" et indicateurs visuels rouges/orange lors de saisies non-alphanumériques.
- **Design** : Entièrement responsive avec Tailwind CSS v4.

---

## 🧠 L'Algorithme : Fenêtre Glissante (Sliding Window)

L'algorithme calcule le nombre minimal de remplacements de caractères nécessaires pour qu'un terme de recherche ($S$) corresponde à une partie d'un terme candidat ($C$).



### Règles de fonctionnement :
1. **Contrainte de Taille** : Si le candidat est plus court que la recherche, il est rejeté (`Infinity`).
2. **Glissement** : On fait glisser $S$ sur $C$ et on compte les différences à chaque position.
3. **Score Final** : Le score le plus bas trouvé durant le glissement est retenu.

### Priorité du Tri :
1. **Score le plus bas** (Similarité maximale).
2. **Proximité de longueur** (Différence de taille minimale).
3. **Ordre alphabétique**.

---

## 🛠️ Commandes Utiles
- `npm install` : Installer les dépendances.
- `npm run dev` : Lancer le projet en local.
- `npx vitest run` : Exécuter les tests unitaires de l'algorithme.
