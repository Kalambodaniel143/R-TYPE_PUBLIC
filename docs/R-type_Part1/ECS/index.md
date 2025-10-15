# Entity Component System (ECS)

## Conception
L’**Entity Component System (ECS)** est un **modèle de programmation** principalement utilisé dans le développement de jeux vidéo.  
Il vise à **séparer les données** (ce qu’une entité *est*) de la **logique** (ce qu’elle *fait*), en trois parties principales.

---

## Fonctionnement

### 🔹 Entities (Entités)
Ce sont les objets de base du système, généralement représentés par un **identifiant unique (ID)**.  
Elles **ne contiennent ni données ni logique** : elles servent simplement de lien entre plusieurs composants.

### 🔹 Components (Composants)
Ce sont des **conteneurs de données pures**.  
Chaque composant décrit une **caractéristique spécifique** d’une entité :  
par exemple :
- `PositionComponent` → coordonnées de l’entité,  
- `HealthComponent` → points de vie,  
- `VelocityComponent` → vitesse de déplacement, etc.

Les composants ne contiennent **aucune logique**.

### 🔹 Systems (Systèmes)
Ce sont les **algorithmes** qui opèrent sur des ensembles d’entités possédant certains composants.  
Chaque système applique une logique spécifique, par exemple :
- un **système de rendu** dessine toutes les entités ayant un `RenderComponent`,  
- un **système de physique** met à jour les positions selon les vitesses,  
- un **système de collisions** gère les interactions entre entités.

---

##  Avantages du modèle ECS

- **Composition plutôt qu’héritage** : les entités sont assemblées à partir de composants simples et réutilisables.  
- **Performance accrue** : les données sont mieux organisées en mémoire (meille
