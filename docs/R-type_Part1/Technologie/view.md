# Étude comparative: View ECS vs parcours direct du Registry Et revue de la définition des composants physiques et du PhysicsSystem

Résumé:
- view<...> filtre au compile-time et itère uniquement sur les entités qui possèdent tous les composants requis.
- Le parcours direct du registry impose soit de vérifier dynamiquement la présence des composants (if/has), soit d’itérer plusieurs conteneurs et de les croiser manuellement.

Cette note se base sur les fichiers:
- View: GameEngine/Registry/View.hpp
- PhysicsSystem: GameEngine/Physics/Systems/PhysicsSystem.{hpp,cpp}
- Composants: GameEngine/Physics/Components/{Movement.hpp, Physics.hpp}

---

## 1) View vs parcours direct du Registry

### 1.1 Objectif et ergonomie
- view<Components...>:
  - Déclare au compile-time l’ensemble de composants attendus.
  - Fournit une boucle claire: for (auto e : view<...>(reg)) { ... }.
  - Minimise le bruit de code (pas de if (!has) return;).
- Parcours direct:
  - Implique souvent des tests dynamiques de présence des composants.
  - Plus verbeux et sujet à l’oubli de checks.

Exemple côté-à-côté:

Cas simple: intégrer la vitesse dans la position.

```cpp
// Avec view
for (auto e : view<PositionComponent, VelocityComponent>(reg)) {
    auto& pos = reg.get_components<PositionComponent>()[e];
    auto& vel = reg.get_components<VelocityComponent>()[e];
    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
}
```

```cpp
// Parcours direct (ex: sur toutes les entités)
for (entity_t e = 0; e < reg.size(); ++e) {
    auto& posArr = reg.get_components<PositionComponent>();
    auto& velArr = reg.get_components<VelocityComponent>();
    if (!posArr.has(e) || !velArr.has(e))
        continue;
    auto& pos = posArr[e];
    auto& vel = velArr[e];
    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
}
```

### 1.2 Complexité et coûts constants
- Les deux approches sont O(N) au pire (N = nombre d’entités).
- view peut réduire la constante:
  - Itère sur l’ensemble « le plus petit » (selon implémentation possible) ou saute efficacement les entités non éligibles.
  - Moins de branches conditionnelles dans la boucle si le filtrage est fait dans l’itérateur.
- Parcours direct:
  - Effectue des checks has(...) à chaque entité et pour chaque composant requis.
  - Potentiellement plus de branches et de cache-misses.

Conclusion: sur un grand N avec des entités hétérogènes, view est souvent plus rapide et plus stable.

### 1.3 Localité mémoire et prédiction de branche
- view peut:
  - Partir d’un composant pivot dense/compact pour itérer.
  - Réduire les sauts et favoriser la lecture contiguë de données.
- Parcours direct:
  - Parcours séquentiel de l’espace d’ID, mais accède de façon éparse aux sparse_array, causant des misses.

### 1.4 Sécurité et maintenabilité
- view:
  - API claire: les composants requis sont explicites dans le template.
  - Moins d’erreurs d’oubli de vérification de composant.
- Parcours direct:
  - Risque de regression si un check est oublié ou mal ordonné.

### 1.5 Concurrence et parallélisation
- view:
  - Facile à chunker: on peut partitionner l’itération en jobs sans tester les has(...) dans chaque job.
  - Pratique pour un scheduler (worker threads).
- Parcours direct:
  - Parallélisation possible mais plus de bruit et de contrôles à dupliquer.

### 1.6 Cas où le parcours direct reste acceptable
- Petits N ou boucles très ponctuelles (scripts/outils).
- Opérations sur un seul type de composant sans conjonction (ex: initialiser toutes les vitesses présentes).
- Prototypes rapides où la lisibilité prime sur la perf immédiate.

### 1.7 Recommandations
- Utiliser view pour toutes les boucles de runtime où la conjonction de composants est connue et stable (ex: Physics, Render, AI).
- Garder le parcours direct pour outillage, debug, ou mutations globales non critiques en perfs.

---

## 2) Comparaison synthétique: view vs parcours direct pour PhysicsSystem

- Performance:
  - view: meilleure densité de données, moins de branches, très bon en grand N.
  - direct: suffisant en petit N, dégrade sur entités hétérogènes.
- Clarté:
  - view: intentions explicites (quels composants), code concis.
  - direct: checks repetitifs, plus de bruit.
- Maintenance:
  - view: plus difficile d’introduire des oublis de composant.
  - direct: fragile lors d’évolutions (ajout d’un nouveau composant requis).
- Testabilité:
  - view: facile à mocker/itérer dans des tests.
  - direct: tests plus verbeux.

Conclusion: adopter view par défaut dans PhysicsSystem.

---

## 3) Quand préférer le parcours direct
- Outils/scripts d’édition ou migration de données.
- Opérations globales « best effort » effectuées rarement (ex: reset de tout un conteneur).
- Debug ponctuel où la perf est négligeable.

Pour tout le runtime de jeu (physics, render, AI), privilégier view pour un meilleur ratio lisibilité/performance/maintenance.