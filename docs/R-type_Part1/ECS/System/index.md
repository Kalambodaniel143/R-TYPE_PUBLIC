# Documentation des Systèmes ECS

Ce document présente une vue d’ensemble des différents systèmes (`Systems`) utilisés dans ton architecture **Entity Component System (ECS)**.  
Chaque système a une responsabilité précise et agit sur un ensemble de composants spécifiques.  
Ensemble, ils forment le cœur de la boucle de gameplay du jeu.

---

## ShootSystem

### Rôle
Le **ShootSystem** est responsable de la **création et de la gestion des projectiles** tirés par les entités capables de tirer (joueur, ennemi, tourelle, etc.).

### Fonctionnement
- Identifie les entités possédant les composants :
  - `PositionComponent`
  - `RectComponent`
  - `MvtComponent`
  - `ShootComponent`
- Pour chaque entité trouvée, il crée un **nouveau projectile** (nouvelle entité).
- Ce projectile reçoit ses propres composants : position, texture, vitesse, dégâts, etc.

### Résumé
> Produit les tirs et ajoute les projectiles dans le monde pour être traités par les autres systèmes.

---

## SpawnSystem

### Rôle
Le **SpawnSystem** gère la **création dynamique d’ennemis ou d’objets IA** à intervalles réguliers ou aléatoires.

### Fonctionnement
- Génère une **position aléatoire** pour chaque nouvel ennemi.
- Crée une nouvelle entité dans le `registry`.
- Attribue les composants suivants :
  - `PositionComponent`
  - `DestroyableComponent`
  - `ShootComponent`
  - `ComputerComponent`
  - `TextureComponent`
  - `LifeComponent`
  - `RectComponent`

### Résumé
> Fait apparaître de nouvelles entités ennemies dans la scène de jeu.

---

## DestroySystem

### Rôle
Le **DestroySystem** gère la **suppression des entités** après une collision ou lorsqu’elles n’ont plus de points de vie.

### Fonctionnement
- Parcourt les entités avec :
  - `LifeComponent`
  - `FireComponent`
  - `ComputerComponent`
  - `PositionComponent`
- Détecte les collisions simples (par comparaison de positions).
- Réduit les points de vie (`LifeComponent`) des entités touchées.
- Supprime (`kill_entity()`) les entités mortes ou détruites.

### Résumé
> Supprime les entités hors-jeu ou détruites après un impact.

---

## ColliderSystem

### Rôle
Le **ColliderSystem** détecte les **collisions physiques** entre les entités et communique ces informations aux autres systèmes (notamment `DestroySystem` et `PhysicsSystem`).

###  Fonctionnement
- Vérifie si deux entités se recoupent à partir de :
  - `PositionComponent`
  - `RectComponent`
- Peut retourner une liste de collisions ou directement déclencher des réactions.

###  Résumé
> Détecte les collisions et sert de base aux réactions physiques ou destructives.

---

##  RenderSystem

###  Rôle
Le **RenderSystem** est chargé de **l’affichage visuel** du jeu.  
Il rend à l’écran toutes les entités possédant une position et une texture.

###  Fonctionnement
- Récupère les entités avec :
  - `PositionComponent`
  - `TextureComponent`
  - (optionnellement `RectComponent` pour la taille)
- Dessine chaque entité à sa position courante.
- Gère les calques ou la profondeur d’affichage si nécessaire.

###  Résumé
> Assure l’affichage à l’écran de toutes les entités visibles.

---

## InputSystem

### Rôle
Le **InputSystem** gère les **entrées utilisateur** (clavier, souris, manette).  
Il traduit les actions du joueur en mises à jour sur les composants de l’entité contrôlée.

###  Fonctionnement
- Lit l’état des touches ou des boutons.
- Met à jour les composants :
  - `VelocityComponent` → déplacement du joueur
  - `ShootComponent` → tir
  - `ActionComponent` → interactions
- Permet au joueur de déplacer, tirer ou interagir.

### Résumé
> Transforme les entrées utilisateur en actions sur les entités.

---

## PhysicsSystem

###  Rôle
Le **PhysicsSystem** met à jour la **position et la vitesse** des entités selon les lois de la physique du jeu.

###  Fonctionnement
- Parcourt les entités avec :
  - `PositionComponent`
  - `MvtComponent` ou `VelocityComponent`
- Met à jour les coordonnées :
  ```cpp
  position.x += velocity.vx;
  position.y += velocity.vy;
