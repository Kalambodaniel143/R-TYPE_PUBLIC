#  SpawnObject — Système de génération d’ennemis

Le `SpawnObject` est un système du moteur ECS responsable de **la création dynamique d’ennemis** ou d’autres entités contrôlées par l’ordinateur.  
Il est appelé régulièrement (par exemple à chaque vague ou intervalle de temps) pour ajouter de nouveaux ennemis dans le jeu.

Ce système illustre la **phase d’apparition** du cycle de gameplay :
> **Spawn → Move → Shoot → Collision → Destroy**

---

## ⚙️ Composants utilisés

| Composant | Rôle |
|------------|------|
| `PositionComponent` | Définit la position de l’ennemi sur la carte (coordonnées X/Y). |
| `DestroyableComponent` | Indique que l’entité peut être détruite. |
| `ShootComponent` | Donne à l’entité la capacité de tirer des projectiles. |
| `ComputerComponent` | Marque l’entité comme contrôlée par l’IA (ennemi). |
| `TextureComponent` | Contient le chemin de la texture affichée à l’écran. |
| `LifeComponent` | Définit le nombre de points de vie de l’entité. |
| `RectComponent` | Donne les dimensions de la zone graphique et de collision. |

---

### 🔹 Les étapes d’exécution
1. **Génération de coordonnées de façon aléatoires**  
   - Utilisation de `rand()` pour définir une position Y aléatoire entre 0 et 1080 pixels.  
   - La position X est fixée à `1920` (bord droit de l’écran), pour faire apparaître les ennemis à droite.

2. **Création d’une nouvelle entité**
   ```cpp
   registry::entity_t new_entity = r.spawn_entity();
