# Mouvement, Physique, View et PhysicsSystem

Ce document récapitule les composants liés au mouvement et à la physique, explique la classe `view` (ECS) et décrit le `PhysicsSystem`.

Liens utiles:
- View: [GameEngine/Registry/View.hpp](../../../../../../GameEngine/Registry/View.hpp)
- PhysicsSystem: [GameEngine/Physics/Systems/PhysicsSystem.cpp](../../../../../../GameEngine/Physics/Systems/PhysicsSystem.cpp), [GameEngine/Physics/Systems/PhysicsSystem.hpp](../../../../../../GameEngine/Physics/Systems/PhysicsSystem.hpp)
- Composants physiques: [GameEngine/Physics/Components/Physics.hpp](../../../../../../GameEngine/Physics/Components/Physics.hpp), [GameEngine/Physics/Components/Movement.hpp](../../../../../../GameEngine/Physics/Components/Movement.hpp)

---

## 1) Composants de Mouvement & Physique

Déclarés dans:
- [GameEngine/Physics/Components/Movement.hpp](../../../../../../GameEngine/Physics/Components/Movement.hpp)
- [GameEngine/Physics/Components/Physics.hpp](../../../../../../GameEngine/Physics/Components/Physics.hpp)


Composants principaux:
- PositionComponent
  - Représente la position 2D.
  - Champs (utilisés dans les tests): `x`, `y`.

- VelocityComponent
  - Vitesse en 2D.
  - Champs (utilisés dans les tests): `vx`, `vy`.

- AccelerationComponent
  - Accélération en 2D.
  - Champs attendus (convention): `ax`, `ay`.

- GravityComponent
  - Accélération due à la gravité appliquée à une entité.

- BoundaryComponent
  - Règles de limites (ex: écran/salle). Utilisé par `handleBoundary(...)` du PhysicsSystem.
  - Sert à clamp/wrap/rebond en bordure (selon implémentation du projet).

- (Optionnel si présent) Rotation/AngularVelocity
  - `PhysicsSystem::updateRotation(...)` gère l’angle si vos composants de rotation existent.

---

## 2) La view ECS

Fichier: [GameEngine/Registry/View.hpp](../../../../../../GameEngine/Registry/View.hpp)

Objectif:
- Itérer efficacement uniquement sur les entités qui possèdent un ensemble de composants donné.

Fonctionnement:
- `view<Components...>` expose un itérateur interne qui:
  - Avance l’index entité jusqu’à trouver une entité qui possède tous les composants requis (via `sparse_array<T>::has(id)`).
  - Permet l’usage en boucle `for (auto e : view<...>(reg))`.

Pourquoi c’est important:
- Performance: évite de parcourir des entités sans les bons composants.
- Lisibilité: boucle claire par combinaison de composants.
- Sécurité de type: les composants requis sont définis au compile-time.

Exemple d’usage:
```cpp
#include "GameEngine/Registry/View.hpp"
#include "GameEngine/Registry/Registry.hpp"
#include "GameEngine/Physics/Components/Movement.hpp"

void integrate(registry& reg, float dt) {
    for (auto e : view<PositionComponent, VelocityComponent>(reg)) {
        auto& pos = reg.get_components<PositionComponent>()[e];
        auto& vel = reg.get_components<VelocityComponent>()[e];
        pos.x += vel.vx * dt;
        pos.y += vel.vy * dt;
    }
}
```

---

## 3) PhysicsSystem

Fichiers:
- [GameEngine/Physics/Systems/PhysicsSystem.hpp](../../../../../../GameEngine/Physics/Systems/PhysicsSystem.hpp)
- [GameEngine/Physics/Systems/PhysicsSystem.cpp](../../../../../../GameEngine/Physics/Systems/PhysicsSystem.cpp)

Rôle:
- Appliquer la logique physique par frame:
  1) `updateRotation(reg, dt)` — met à jour l’angle (si composants de rotation présents).
  2) `applyGravity(reg, dt)` — ajoute l’accélération de gravité à la vitesse.
  3) `updateMovement(reg, dt)` — intègre la vitesse vers la position.
  4) `handleBoundary(...)` — applique la règle de bordure si `BoundaryComponent` existe.

Boucle type:
```cpp
#include "GameEngine/Physics/Systems/PhysicsSystem.hpp"

void run_physics(registry& reg, float dt) {
    PhysicsSystem physics;
    physics.update(reg, dt); // appelle updateRotation -> applyGravity -> updateMovement
}
```

Intégration ECS:
- Peut s’appuyer sur `view<...>` pour cibler les entités munies des bons composants.
- Une version plugin .so est aussi fournie (voir PHYSICS_PLUGINS_GUIDE.md) pour chargement dynamique.

---

## 4) Création d’entités et exemple minimal

```cpp
registry reg;

// Entité mobile soumise à la gravité
auto e = reg.spawn_entity();
reg.emplace_component<PositionComponent>(e, PositionComponent{0.f, 100.f});
reg.emplace_component<VelocityComponent>(e, VelocityComponent{5.f, 0.f});
reg.emplace_component<GravityComponent>(e, GravityComponent{0.f, -9.8f});

// Étape de simulation
PhysicsSystem physics;
physics.update(reg, 0.016f); // ~60 FPS
```
---