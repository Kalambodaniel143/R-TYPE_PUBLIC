# DestroySystem — Système de gestion des collisions et destructions

Le `DestroySystem` fait partie du **ECS (Entity Component System)** du moteur.  
Il est chargé de **gérer les collisions entre entités** et d’appliquer les effets associés (dégâts, suppression d’entités, etc.).  

Ce système agit sur les entités disposant de **composants de position**, **de vie**, **de tir**, et **de type (joueur/ennemi)**.

---

Le système exploite plusieurs composants enregistrés dans le `registry` :

| Composant | Rôle |
|------------|------|
| `LifeComponent` | Contient le nombre de vies d’une entité (`getLives()`, `setLives()`). |
| `FireComponent` | Indique qu’une entité tire ou génère un projectile. |
| `ComputerComponent` | Sert à distinguer les entités contrôlées par l’IA (`Enemy`) ou non (`Player`). |
| `PositionComponent` | Définit la position de l’entité sur la carte (`x`, `y`). |

---

## Fonctionnement interne

### 🔹 Boucle principale
Le système parcourt deux ensembles d’entités :
1. Les **entités qui tirent** (`FireComponent` + `ComputerComponent`).
2. Les **entités vivantes** (`LifeComponent` + `PositionComponent`).

Pour chaque entité **A** qui tire (`i`) :
- Il vérifie les collisions avec toutes les entités **B** (`j`) ayant un `LifeComponent`.  
- Si la distance entre leurs positions est inférieure à un seuil (ici **10 unités**), une collision est détectée.

### 🔹 Gestion des collisions
Lorsqu’une collision est détectée :
1. Le `LifeComponent` de l’entité touchée (`j`) est décrémenté.  
2. L’entité qui tire (`i`) est détruite via `r.kill_entity(i)`.  
3. Si la vie de `j` tombe à 0 ou moins, elle est également détruite :  
   ```cpp
   if (life.getLives() <= 0)
       r.kill_entity(j);
