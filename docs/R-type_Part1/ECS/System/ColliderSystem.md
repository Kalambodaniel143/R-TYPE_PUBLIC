# SYSTEME DE COLLISION
Ce système implémente la détection de collision avec gestion des dégâts dans notre moteur ECS. Voici comment il fonctionne :

Tout commencer par la fonction qui nous permet de détecter la collision avec l'algorithme AABB

## 1. Fonction de détection de collision AABB
La fonction de détection de collision AABB (Axis-Aligned Bounding Box) détermine si des objets se chevauchent en vérifiant si leurs boîtes englobantes alignées sur les axes se croisent. Elle fonctionne en testant le chevauchement sur chaque axe (X et Y en 2D, X, Y et Z en 3D) ; une collision n'est détectée que si le chevauchement existe sur tous les axes. C'est une méthode simple et rapide, très utilisée dans les jeux vidéo pour des objets non tournants ce qui est pratique pour notre moteur de jeu

---
``` cpp
bool CollideSystem::checkCollision(PositionComponent aPos, ColliderComponent aCol, PositionComponent bPos, ColliderComponent bCol) {
    return (aPos.x < bPos.x + bCol.width &&      // A à gauche de B
            aPos.x + aCol.width > bPos.x &&      // A à droite de B  
            aPos.y < bPos.y + bCol.height &&     // A au-dessus de B
            aPos.y + aCol.height > bPos.y);      // A en-dessous de B
}
```
---
## 🔍 Algorithme AABB (Axis-Aligned Bounding Box) 

Vérifie si deux rectangles se chevauchent
Retourne true si collision, false sinon

## Une Petite Visualisation de ce Systeme:

```bash

Entité A (projectile):     Entité B (ennemi):
┌─────┐                   ┌─────────┐
│  A  │ ←collision→       │    B    │
└─────┘                   └─────────┘
(aPos.x, aPos.y)         (bPos.x, bPos.y)

```

#  2. Système principal de collision
### Étape 1 : Récupération des composants
``` cpp
auto& positions = r.get_components<PositionComponent>();  // Positions des entités
auto& colliders = r.get_components<ColliderComponent>();  // Zones de collision  
auto& damages   = r.get_components<DamageComponent>();    // Dégâts infligés
auto& healths   = r.get_components<HealthComponent>();    // Points de vie
```
### Étape 2 : Création de la vue ECS
``` cpp
view<PositionComponent, ColliderComponent> entityView(r);
```
- Sélectionne seulement les entités qui ont à la fois Position ET Collider
- Optimisation : évite de tester les entités sans collision
Étape 3 : Double boucle de détection

### Étape 3 : Double boucle de détection
```cpp 
for (auto entityA : entityView) {           // Entité attaquante
    if (!damages.has(entityA)) continue;    // Doit pouvoir faire des dégâts
    
    for (auto entityB : entityView) {       // Entité cible
        if (entityA == entityB) continue;   // Pas d'auto-collision
        if (!healths.has(entityB)) continue; // Doit avoir des HP
```
### Logique :

- entityA = Projectile/Attaquant (a des dégâts)
- entityB = Cible/Défenseur (a des points de vie)
- Projectile touche ennemi
- Ennemi perd des HP
- Si HP ≤ 0 → ennemi marqué pour destruction
- Projectile marqué pour destruction (consommé)

## Ce systeme permet de :

- Charger le système dynamiquement avec dlopen()
- Utiliser depuis n'importe quel langage (C, Python, etc.)
- Modulaire : peut être activé/désactivé