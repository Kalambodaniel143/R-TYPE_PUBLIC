# Étude sur l’utilisation de l’AABB dans le moteur ECS

## 1. Introduction

Dans notre moteur de jeu 2D basé sur l’architecture **ECS (Entity Component System)**, nous avons choisi d’utiliser le système **AABB (Axis-Aligned Bounding Box)** pour la gestion des collisions.  
Ce choix s’explique par la **simplicité**, la **rapidité** et la **faible charge de calcul** de cette méthode, parfaitement adaptée à un moteur orienté performance et modularité.

---

## 2. Principe de l’AABB

Le système **AABB** repose sur l’utilisation d’un **rectangle englobant aligné sur les axes du jeu (X et Y)**.  
Chaque entité disposant d’un composant de collision possède ainsi une boîte définie par sa position et ses dimensions.

La détection de collision consiste simplement à vérifier si **deux rectangles se croisent**, ce qui en fait une méthode très rapide à exécuter.

### Exemple simplifié
```cpp
bool intersects(const AABB& a, const AABB& b) {
    return (a.x < b.x + b.width  &&
            a.x + a.width > b.x  &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y);
}
