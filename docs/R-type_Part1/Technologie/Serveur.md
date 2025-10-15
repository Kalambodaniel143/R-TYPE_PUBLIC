# Étude comparative — Architecture du serveur réseau

## 1. Objectif

L’objectif est d’évaluer la pertinence des choix effectués, ainsi que les pistes d’évolution possibles.

---

## 2. Architecture actuelle — Synthèse

| Composant                           | Description                                                                    | Technologie utilisée            |
| ----------------------------------- | ------------------------------------------------------------------------------ | ------------------------------- |
| **ServerHub**                       | Point d’entrée TCP, gère les connexions asynchrones et relaie les paquets.     | `boost::asio`                   |
| **RoomManager / Room / ServerRoom** | Gestion multi-room, logique de jeu, synchronisation périodique.                | Threads, mutex, logique interne |
| **PacketsManager / PacketsFactory** | Sérialisation et parsing dynamique des paquets.                                | C++17, polymorphisme            |
| **Threading**                       | `std::thread` pour exécuter `io_context::run()` + threads optionnels par room. | Standard C++                    |
| **I/O réseau**                      | Asynchrone, basé sur callbacks.                                                | `boost::asio`                   |
| **Logs**                            | `std::cout` (rudimentaire).                                                    | C++ standard                    |
| **Sécurité / validation**           | Basique (non détaillée).                                                       | Non précisé                     |

---

## 3. Comparatif des choix techniques

### 3.1 Réseau : `boost::asio` vs alternatives

| Critère         | `boost::asio` (actuel)                         | Alternatives (`asio` standalone / ENet / gRPC / WebSocket) | Analyse                                                     |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| **Performance** | Excellente, bas niveau C++                     | ENet : optimisé UDP, gRPC : overhead élevé                 | Très bon choix pour un jeu temps réel TCP/UDP             |
| **Complexité**  | Moyenne à élevée (callbacks, gestion manuelle) | gRPC plus simple mais moins flexible                       | Peut être simplifiée avec coroutines (`co_await`)        |
| **Portabilité** | Très bonne                                     | Très bonne aussi pour ENet/gRPC                            | Conforme aux standards C++                                |
| **UDP support** | Disponible (optionnel)                         | ENet spécialisé UDP fiabilisé                              | ➕ Possibilité d’étendre le serveur sur UDP pour le gameplay |

**Conclusion :** `boost::asio` est adapté, mais une migration vers `asio` standalone + `std::coroutine` pourrait réduire la complexité du code réseau.

---

### 3.2 Gestion des rooms : modèle interne vs systèmes distribués

| Critère             | Rooms internes (actuel)            | Approches distribuées (ex: Node-based, microservices) | Analyse                                     |
| ------------------- | ---------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| **Simplicité**      | Très bonne pour un serveur unique  | Complexe (inter-serveur)                              | Adaptée aux jeux locaux / petits serveurs |
| **Scalabilité**     | Limitée au thread / process unique | Horizontale (multi-instances)                         | Peut saturer au-delà de 100–200 joueurs  |
| **Synchronisation** | Partagée via mutex / threads       | Message passing entre instances                       | Risque de contention / lock              |
| **Maintenance**     | Facile                             | Plus difficile (monitoring, orchestration)            | Bon équilibre pour MVP ou prototypage     |

**Conclusion :**
Le modèle centralisé à *RoomManager* est idéal pour un prototype ou un jeu local, mais devra évoluer vers une architecture distribuée (rooms isolées en processus ou microservices) pour le *scaling*.

---

### 3.3 Paquets et sérialisation : système maison vs protocoles standardisés

| Critère                 | PacketsManager / IPacket (actuel) | Protocol Buffers / FlatBuffers / JSON              | Analyse                                   |
| ----------------------- | --------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| **Performance**         | Très élevée (binaire natif)       | Protobuf/FlatBuffers aussi performants             | Excellent choix pour temps réel         |
| **Évolutivité**         | Moyenne : ajout manuel des types  | Protobuf gère versioning et génération automatique | Peut devenir complexe à maintenir      |
| **Interopérabilité**    | Limité au code C++                | Protobuf/JSON → multiplateforme                    | Difficulté si clients multiplateformes |
| **Simplicité de debug** | Faible (données binaires)         | JSON / Protobuf plus lisibles                      | Nécessite outils de debug spécifiques  |

**Conclusion :**
Le système de paquets custom est performant, mais l’utilisation d’un format généré (ex. Protobuf) pourrait simplifier l’interopérabilité client (Unity, C#, etc.).

---

### 3.4 Concurrence : threads manuels vs thread pool / async coroutines

| Critère           | Threads manuels (actuel)    | Thread pool / coroutines     | Analyse                              |
| ----------------- | --------------------------- | ---------------------------- | ------------------------------------ |
| **Performance**   | Bonne sur peu de threads    | Meilleure à grande échelle   | Risque de surcoût de création     |
| **Complexité**    | Moyenne (mutex, lock_guard) | Réduite avec async / futures | Code sensible aux race conditions |
| **Debuggabilité** | Moyenne                     | Plus lisible avec `co_await` | ➕ Migration envisageable             |

**Conclusion :**
L’utilisation de `std::thread` est simple mais peu flexible. Un pool de threads fixe ou les coroutines C++20 réduiraient la charge de synchronisation et simplifieraient la maintenance.

---

### 3.5 Journalisation (logging)

| Critère         | `std::cout` (actuel) | `spdlog` / `boost::log` / `loguru` | Analyse                           |
| --------------- | -------------------- | ---------------------------------- | --------------------------------- |
| **Performance** | Correcte             | Excellente (multi-thread, async)   | `std::cout` bloque les threads |
| **Lisibilité**  | Simple               | Coloration, timestamp, niveau      | Amélioration notable            |
| **Maintenance** | Difficile            | Centralisé, configurable           | Recommandé pour la prod         |

**Conclusion :**
Remplacer les sorties console par un logger structuré (`spdlog`) apporterait de la clarté et de la performance en environnement multi-thread.

---

## 4. Évaluation globale

| Domaine                   | Choix actuel                 | Pertinence   | Évolutions recommandées                             |
| ------------------------- | ---------------------------- | ------------ | --------------------------------------------------- |
| **Réseau**                | `boost::asio` TCP asynchrone | Solide     | Support UDP + coroutines                            |
| **Rooms**                 | Centralisées en mémoire      | Simple     | Distribuer ou isoler les rooms                      |
| **Sérialisation**         | Custom binaire               | Performant | Ajouter Protobuf pour compatibilité                 |
| **Threads**               | `std::thread` + mutex        | Basique   | Thread pool / async futures                         |
| **Logs**                  | `std::cout`                  | Minimal   | Intégrer `spdlog`                                   |
| **Sécurité / validation** | Non spécifié                 |           | Ajouter validation des paquets et anti-spam         |
| **Scalabilité**           | Moyenne                      |           | Superviser via orchestration Docker / microservices |

---

## 5. Recommandations générales

1. **Moderniser la couche réseau**
   → Utiliser `asio` avec coroutines (`co_spawn`, `awaitable`) pour un code plus lisible.
2. **Isoler la logique de room**
   → Chaque room dans son propre thread ou process (communication par messages).
3. **Introduire un protocole standard (Protobuf)**
   → Facilite la compatibilité client C++/C#/Web.
4. **Centraliser la journalisation**
   → `spdlog` ou `boost::log` avec rotation de fichiers.
5. **Renforcer la sécurité réseau**
   → Validation des paquets, timeouts, détection de flood.
6. **Préparer la scalabilité**
   → Superviser le serveur via conteneurs Docker + orchestrateur (Kubernetes, ECS).

---

## 6. Conclusion

L’architecture actuelle constitue une **base robuste et performante** pour un serveur de jeu ou d’application temps réel de taille moyenne.
Elle repose sur des **standards C++ solides (Boost.Asio, threads, polymorphisme)** mais gagnerait à évoluer vers une approche **plus modulaire, moderne et maintenable**, notamment via :

* des **coroutines** pour la simplification du flux asynchrone,
* des **formats de paquets standardisés** (Protobuf),
* et une **infrastructure scalable** basée sur des *rooms* isolées et supervisées.