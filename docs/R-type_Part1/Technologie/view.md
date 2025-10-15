# Étude comparative : View ECS vs parcours direct du Registry  
## Et revue de la définition des composants physiques et du PhysicsSystem

### Résumé
- `view<...>` filtre au **compile-time** et itère uniquement sur les entités qui possèdent tous les composants requis.  
- Le parcours direct du registry impose soit de vérifier dynamiquement la présence des composants (`if/has`), soit d’itérer plusieurs conteneurs et de les croiser manuellement.

Cette note se base sur les fichiers :
- **View** : `GameEngine/Registry/View.hpp`
- **PhysicsSystem** : `GameEngine/Physics/Systems/PhysicsSystem.{hpp,cpp}`
- **Composants** : `GameEngine/Physics/Components/{Movement.hpp, Physics.hpp}`

---

## 1. View vs parcours direct du Registry

### 1.1 Objectif et ergonomie
- **`view<Components...>` :**
  - Déclare au *compile-time* l’ensemble des composants attendus.
  - Fournit une boucle claire :  
    ```cpp
    for (auto e : view<...>(reg)) { ... }
    ```
  - Minimise le bruit de code (pas de `if (!has) return;`).

- **Parcours direct :**
  - Implique souvent des tests dynamiques de présence des composants.
  - Plus verbeux et sujet à l’oubli de vérifications.

#### Exemple côté à côte

Cas simple : intégrer la vitesse dans la position.

```cpp
// Avec view
for (auto e : view<PositionComponent, VelocityComponent>(reg)) {
    auto& pos = reg.get_components<PositionComponent>()[e];
    auto& vel = reg.get_components<VelocityComponent>()[e];
    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
}
```
