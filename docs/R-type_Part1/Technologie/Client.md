# Étude comparative — Architecture du client réseau

## 1. Objectif

L'objectif de cette partie de la documentation est de mettre en évidence la pertinence des choix faits dans la partie Client, leurs avantages, limites et les opportunités d'évolution.

---

## 2. Architecture actuelle — Synthèse

| Composant                           | Rôle                                                                                        | Technologie              |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ |
| **ClientRoom**                      | Gère la communication avec une *room* distante via UDP (envoi d'inputs / réception d'état). | `boost::asio`            |
| **client/main.cpp**                 | Programme de test : initialise le client, envoie des commandes, gère les threads.           | C++17                    |
| **PacketsManager / PacketsFactory** | Partagés avec le serveur, gèrent la sérialisation/désérialisation.                          | C++ binaire              |
| **Réseau**                          | UDP pour gameplay, TCP possible pour handshake / login.                                     | `boost::asio`            |
| **Thread model**                    | `io_context` + thread d'entrée console + callbacks async.                                   | `std::thread`, async I/O |

---

## 3. Comparaison des choix techniques

### 3.1 Architecture réseau : UDP/TCP via Boost.Asio

| Critère              | Implémentation actuelle (`boost::asio`) | Alternatives modernes (ENet, WebSocket, gRPC) | Analyse                            |
| -------------------- | --------------------------------------- | --------------------------------------------- | ---------------------------------- |
| **Performance**      | Excellente, bas niveau, contrôle total  | ENet : très rapide, fiabilisé sur UDP         | Très adaptée pour jeu temps réel |
| **Fiabilité**        | UDP non fiable (à gérer manuellement)   | ENet / RakNet fournissent fiabilité intégrée  | Risque de perte de paquets      |
| **Complexité**       | Élevée (callbacks, buffer management)   | WebSocket plus simple mais plus lent          | Maintenance plus difficile      |
| **Interopérabilité** | Compatible C++ uniquement               | WebSocket / gRPC multiplateforme              | Limité pour client Web          |

**Conclusion :**
Le choix `boost::asio` UDP est performant et pertinent pour un client de jeu C++ natif, mais des bibliothèques spécialisées (ENet, RakNet) pourraient simplifier la gestion de la fiabilité et des retransmissions.

---

### 3.2 Gestion des paquets : système custom vs formats standardisés

| Critère              | PacketsManager / IPacket (actuel)  | Protocol Buffers / FlatBuffers / JSON | Analyse                             |
| -------------------- | ---------------------------------- | ------------------------------------- | ----------------------------------- |
| **Performance**      | Excellente, binaire compact        | Très bonne pour Protobuf/FlatBuffers  | Optimal pour le temps réel        |
| **Interopérabilité** | Restreinte (format propriétaire)   | Multi-langage (C#, JS, etc.)          | Complexité côté client non-C++   |
| **Évolutivité**      | Ajout manuel des paquets           | Génération auto via `.proto`          | Plus d'entretien manuel          |
| **Debuggabilité**    | Données binaires difficiles à lire | Protobuf/JSON plus transparents       | Moins pratique pour debug rapide |

**Conclusion :**
Le système custom est efficace, mais pour supporter d'autres clients (Unity, Web), migrer vers **Protobuf** permettrait une compatibilité multi-langage sans sacrifier la performance.

---

### 3.3 Threading et modèle asynchrone

| Critère                 | Actuel (`io_context` + threads manuels) | Moderne (coroutines / futures / async-await)      | Analyse               |
| ----------------------- | --------------------------------------- | ------------------------------------------------- | --------------------- |
| **Performance**         | Excellente sur petit nombre de threads  | Comparable, voire meilleure (moins de contention) | Correct             |
| **Lisibilité**          | Moyenne (callbacks imbriqués)           | Plus lisible avec `co_await` (C++20)              | Maintenance lourde |
| **Gestion des erreurs** | Complexe (try-catch dispersés)          | Simplifiée avec exceptions structurées            | Code verbeux       |

**Conclusion :**
Le threading actuel fonctionne, mais la modernisation vers **coroutines (`co_spawn`)** rendrait le code plus propre et plus lisible tout en conservant les performances.

---

### 3.4 Intégration avec le moteur de jeu (`RTypeGame`)

| Critère             | Implémentation actuelle                        | Approche moderne (event loop / ECS / job system) | Analyse                          |
| ------------------- | ---------------------------------------------- | ------------------------------------------------ | -------------------------------- |
| **Couplage**        | Direct : `ClientRoom` met à jour `RTypeGame`   | Découplé via events / messages                   | Risque de dépendance forte    |
| **Synchronisation** | Temps réel (callbacks → mise à jour immédiate) | File d'événements thread-safe                    | Risque de condition de course |
| **Extensibilité**   | Moyenne                                        | Élevée si via events                             | ➕ À améliorer pour modularité    |

**Conclusion :**
Le couplage direct est simple pour un prototype, mais un **bus d'événements** ou un **système ECS** permettrait une meilleure séparation entre le réseau et la logique de jeu.

---

### 3.5 Interface utilisateur et console

| Critère                    | Console CLI actuelle          | Interface graphique / moteur intégré | Analyse                    |
| -------------------------- | ----------------------------- | ------------------------------------ | -------------------------- |
| **Simplicité**             | Très bonne pour le test       | Complexe à intégrer                  | Bon choix pour debugging |
| **Expérience utilisateur** | Limitée (commandes manuelles) | Interface intégrée dans le jeu       | Peu intuitive           |
| **Tests automatisés**      | Possible via scripts shell    | Difficile en GUI                     | Pratique pour CI         |

**Conclusion :**
La console est adaptée au développement, mais une intégration future à l'UI du jeu (overlay réseau) améliorerait l'expérience finale.

---

## 4. Évaluation synthétique

| Domaine                   | Choix actuel            | Pertinence            | Recommandations                             |
| ------------------------- | ----------------------- | --------------------- | ------------------------------------------- |
| **Réseau**                | `boost::asio` UDP       | Solide              | Ajouter couche fiabilité (ou passer à ENet) |
| **Paquets**               | Custom binaire          | Performant          | Migrer vers Protobuf pour compatibilité     |
| **Threading**             | `std::thread` + async   | Lisibilité moyenne | Migrer vers coroutines C++20                |
| **Couplage jeu**          | Direct avec `RTypeGame` | Serré              | Introduire bus d'événements                 |
| **Interface utilisateur** | CLI                     | Simple              | Intégrer à moteur de jeu plus tard          |
| **Logs / debug**          | Console directe         | Minimal            | Ajouter logger (`spdlog`)                   |
| **Sécurité**              | Non mentionnée          |                     | Ajouter validation et timeout côté client   |

---

## 5. Bonnes pratiques recommandées

1. **Utiliser des coroutines pour la réception asynchrone :**

   ```cpp
   awaitable<void> ClientRoom::RxLoop() {
       std::array<uint8_t, 1024> buffer;
       for (;;) {
           auto [n, endpoint] = co_await socket.async_receive_from(buffer, _server_endpoint, use_awaitable);
           handlePacket(buffer, n);
       }
   }
   ```