# Server_Technique

## 1. Introduction
Ce document décrit l’architecture réseau et le fonctionnement interne du **serveur** fourni dans les archives (`Networking/Networking/server`).  
Il s’adresse à un public technique (développeurs) souhaitant comprendre, maintenir ou étendre le serveur.

---

## 2. Vue d’ensemble
Le serveur se compose principalement de :

- **ServerHub** : point d’entrée réseau (acceptation des connexions TCP).
- **RoomManager / Room / ServerRoom** : gestion des *rooms* (salles de jeu).  
  Les *rooms* orchestrent l’état du jeu et la communication (UDP/TCP selon les sous-systèmes).
- **PacketsManager / PacketsFactory** : sérialisation et désérialisation des paquets applicatifs (login, room, input, gamestate…).
- **Utilitaires** : `Signal` (événements), `compress`, `encrypt` (optionnels / objets `.o` fournis).

Le serveur utilise `boost::asio` pour l’I/O réseau asynchrone et `std::thread` pour exécuter l’`io_context`.

---

## 3. Points d’entrée
- **`server/main.cpp`** :
  - Crée un `boost::asio::io_context`.
  - Instancie un `ServerHub`.
  - Lance `io_context::run()` dans un thread dédié.
  - Démarre le hub (`s.start()`), puis attend la terminaison.

---

## 4. Composants principaux

### 4.1 ServerHub
- **Rôle** : accepter les connexions TCP entrantes et relayer les messages vers le gestionnaire de *rooms*.
- **Fonctionnalités** :
  - Le constructeur initialise un `tcp::acceptor` sur le port spécifié.
  - `start()` : lance l’acceptation asynchrone (`async_accept`) et la boucle d’écoute.
  - `handleAccept()` : callback appelé lors d’une nouvelle connexion.  
    Après acceptation, il démarre la lecture asynchrone et appelle la logique de parsing via `PacketsManager`.
  - Utilise des buffers internes (`std::array<uint8_t, N>`) et les fonctions `async_read_some` / `async_write`.

---

### 4.2 RoomManager / Room / ServerRoom
- **RoomManager** : regroupe et administre plusieurs instances de `Room`.  
  Il gère la création, la destruction et l’assignation des clients aux rooms.
- **Room** : instance logique représentant une salle.  
  Elle conserve l’état du jeu (joueurs, entités) et applique la logique du tick.
- **ServerRoom** : adaptation réseau de `Room`.  
  Elle envoie périodiquement des `GameStatePacket` aux clients et applique les `InputPacket` reçus.

---

### 4.3 PacketsManager & PacketsFactory
Ces classes assurent la gestion des paquets applicatifs :

- `buildPacket(const IPacket&)` → `std::vector<uint8_t>` : sérialisation binaire.  
- `parsePacket(std::vector<uint8_t>&)` → `std::unique_ptr<IPacket>` : désérialisation.

`PacketsFactory` instancie dynamiquement les classes dérivées d’`IPacket`  
(par exemple : `LoginPacket`, `InputPacket`, `GameStatePacket`).

---

## 5. Protocole et paquets
Les paquets définis (dans `RType-Game/Packets`) couvrent les échanges suivants :

- **LoginPacket** : échange d’identifiants / métadonnées (nom, id, version).
- **InputPacket** : entrées joueur (touches, directions).
- **GameStatePacket** : état du monde (positions, entités, points de vie).
- **RoomPackets** : création / rejoindre une room, acknowledgment, etc.

Chaque paquet implémente l’interface `IPacket` (type + sérialisation).  
`PacketsManager` gère l’encodage binaire et la détection du type à partir du flux.

---

## 6. Concurrence et modèle de threads
- `boost::asio::io_context` est exécuté dans un thread séparé (thread I/O).
- Les *rooms* peuvent avoir leur propre thread de tick ou être exécutées depuis la boucle principale  
  (selon l’implémentation de `Room`).
- Les accès partagés (listes de clients, état des rooms) doivent être protégés à l’aide de `std::mutex` et `std::lock_guard`.  
  Vérifier dans les fichiers `Room*.cpp` l’utilisation appropriée de ces verrous.

---

## 7. Logs et débogage
- Le code utilise `std::cout` pour des journaux de base (connexion, lecture, erreurs).
- Pour un usage en production, il est recommandé de remplacer cela par un logger (ex. : `spdlog`, `boost::log`)  
  avec des niveaux de log (`info`, `debug`, `error`).

---

## 8. Compilation (exemple)
**Prérequis :**
- Compilateur C++ (`g++` ou `clang++`) compatible C++17 ou supérieur.
- Bibliothèques : **Boost** (`system`, `asio` — *header-only* possible) et **pthread**.
