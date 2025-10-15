# Étude comparative : ECS vs OOP dans la conception d’un moteur de jeu 2D en C++

## 1. Introduction

Dans la conception de notre moteur de jeu 2D en C++, nous avons fait le choix d’adopter une **architecture ECS (Entity Component System)** plutôt qu’une approche purement **orientée objet (OOP)**.  
Ce document présente une étude comparative entre ces deux paradigmes, en mettant en avant les **raisons techniques et structurelles** de ce choix.

---

## 2. Rappel des deux paradigmes

### 2.1 Programmation Orientée Objet (OOP)
L’OOP repose sur la **modélisation du monde sous forme d’objets**.  
Chaque objet combine **données (attributs)** et **comportements (méthodes)**.  
On utilise des **classes**, **héritages** et **polymorphisme** pour structurer le code.

Exemple :
```cpp
class Player : public Entity {
public:
    void move();
    void render();
private:
    Vector2 position;
    Sprite sprite;
};
```
Avantages :

Structure intuitive (proche du monde réel).

Encapsulation : chaque entité gère son propre état.
Héritage et polymorphisme facilitent la réutilisation du code.

Inconvénients :

L’héritage multiple peut rendre la hiérarchie rigide et difficile à maintenir.
Difficile d’ajouter de nouveaux comportements sans casser la hiérarchie.
Couplage fort entre données et logique (faible flexibilité).

### 2.2 Entity Component System (ECS)

L’ECS découple complètement les données (components) de la logique (systems).
Une Entity n’est qu’un identifiant.
Les Components stockent les données.
Les Systems appliquent la logique sur les entités possédant certains composants.

Exemple :
``` cpp
struct Position { float x, y; };
struct Velocity { float dx, dy; };

class MovementSystem {
public:
    void update(Registry& registry) {
        for (auto entity : registry.view<Position, Velocity>()) {
            auto& pos = registry.get<Position>(entity);
            auto& vel = registry.get<Velocity>(entity);
            pos.x += vel.dx;
            pos.y += vel.dy;
        }
    }
};
```

Avantages :

- Architecture flexible : les entités sont dynamiques et modulaires.
- Découplage fort : la logique et les données sont indépendantes.
- Favorise la parallélisation (chaque système peut être exécuté sur un thread).
- Idéal pour gérer des milliers d’entités dans un moteur de jeu.

Inconvénients :
- Moins intuitif pour les débutants (abstraction plus conceptuelle).
- Peut nécessiter une gestion mémoire plus fine.
- La débogue et la traçabilité des entités sont parfois plus complexes.

## 3. Comparaison directe
## 3. Comparaison directe

| **Critère**                        | **OOP (Programmation Orientée Objet)** | **ECS (Entity Component System)** |
|-----------------------------------|----------------------------------------|-----------------------------------|
| **Structure**                     | Hiérarchie de classes                  | Données + systèmes séparés        |
| **Flexibilité**                   | Limitée par l’héritage                 | Très élevée (composition dynamique) |
| **Performance**                   | Souvent limitée par le polymorphisme   | Optimisée (cache-friendly, data-oriented) |
| **Réutilisation du code**         | Par héritage                           | Par composition                   |
| **Maintenance**                   | Hiérarchie rigide                      | Code plus modulaire et isolé      |
| **Extensibilité**                 | Difficile sans refactorisation         | Simple : ajouter un nouveau système ou composant |
| **Adaptation au multithreading**  | Complexe                               | Naturellement compatible          |
| **Lisibilité pour petits projets**| Plus simple                            | Plus complexe                     |
| **Évolutivité pour gros projets** | Moins adaptée                          | Très adaptée                      |


## 4. Justification de notre choix (ECS)

Nous avons choisi ECS pour notre moteur 2D car il répond mieux à nos objectifs de performance, de modularité et d’évolutivité :
Performance : la séparation des données permet un accès séquentiel en mémoire (data-oriented design), idéal pour les mises à jour massives d’entités (ex. : projectiles, ennemis, particules).

- **Modularité** : chaque système (Input, Render, Physics, Collision, etc.) peut être développé indépendamment.
- **Flexibilité** : ajout ou suppression de composants à une entité à l’exécution sans refactoriser les classes.
- **Évolutivité** : facile d’intégrer de nouveaux systèmes sans impacter la structure existante.
- **Parallélisation** : permet de tirer parti des architectures multi-threadées modernes.

## 5. Conclusion

L’ECS représente une évolution naturelle de la conception orientée objet pour les moteurs de jeux.
Alors que l’OOP met l’accent sur la hiérarchie et l’encapsulation, l’ECS privilégie la composition et la performance.

Notre choix d’utiliser ECS s’explique donc par :
- la recherche d’un moteur modulaire, évolutif et performant,
- une meilleure gestion des entités dynamiques et une architecture claire pour séparer la logique du contenu.