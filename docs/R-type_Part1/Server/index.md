# Server_Technique

## 1. Introduction
Ce document décrit l'architecture réseau et le fonctionnement interne du **serveur** fourni dans les archives (`Networking/Networking/server`). Il cible un public technique (développeurs) souhaitant comprendre, maintenir ou étendre le serveur.

## 2. Vue d'ensemble
Le serveur se compose principalement de :
- **ServerHub** : point d'entrée réseau (acceptation de connexions TCP).
- **RoomManager / Room / ServerRoom** : gestion des "rooms" (salles de jeu). Les rooms orchestrent l'état du jeu et la communication (UDP/TCP selon sous-systèmes).
- **PacketsManager / PacketsFactory** : sérialisation / désérialisation des paquets applicatifs (login, room, input, gamestate...).
- Utilitaires : `Signal` (événements), `compress`, `encrypt` (optionnels/objets .o fournis).

Le serveur utilise `boost::asio` pour l'I/O réseau asynchrone et `std::thread` pour exécuter l'`io_context`.

## 3. Points d'entrée
- `server/main.cpp` :
  - Crée `boost::asio::io_context`.
  - Instancie `ServerHub`.
  - Lance `io_context::run()` dans un thread dédié.
  - Démarre le hub (`s.start()`), puis attend la terminaison.

## 4. Composants principaux

### 4.1 ServerHub
- Rôle : accepter les connexions TCP entrantes et relayer les messages vers le gestionnaire de rooms.
- Fonctionnalités :
  - Constructeur initialise un `tcp::acceptor` sur le port passé.
  - `start()` : lance l'acceptation asynchrone (`async_accept`) et la boucle d'écoute.
  - `handleAccept()` : callback lors d'une nouvelle connexion. Après acceptation, démarre la lecture asynchrone et appelle la logique de parsing via `PacketsManager`.
  - Utilise des buffers internes (`std::array<uint8_t,N>`) et `async_read_some/async_write`.

### 4.2 RoomManager / Room / ServerRoom
- **RoomManager** : regroupe et administre plusieurs `Room`. Création / destruction de rooms, assignation des clients.
- **Room** : instance logique représentant une salle — garde l'état du jeu (players, entités), applique la logique de tick.
- **ServerRoom** : adaptation réseau de Room ; envoie périodiquement `GameStatePacket` vers les clients et applique `InputPacket` reçus.

### 4.3 PacketsManager & PacketsFactory
- Fournit :
  - `buildPacket(const IPacket&)` -> vector<uint8_t> (sérialisation binaire).
  - `parsePacket(vector<uint8_t>&)` -> unique_ptr<IPacket> (désérialisation).
- `PacketsFactory` instancie dynamiquement les classes dérivées d'`IPacket` (par ex. `LoginPacket`, `InputPacket`, `GameStatePacket`).

## 5. Protocole et paquets
Les paquets définis (dans `RType-Game/Packets`) couvrent :
- **LoginPacket** : échange d'identifiants / meta (nom, id, version).
- **InputPacket** : entrées joueur (touches, directions).
- **GameStatePacket** : état du monde (positions, entités, health).
- **RoomPackets** : création/rejoindre room, ack, etc.

Chaque paquet implémente `IPacket` (type identifier + sérialisation). `PacketsManager` gère l'encodage binaire et la détection du type depuis le stream.

## 6. Concurrence & thread model
- `boost::asio::io_context` est exécuté dans un thread séparé (thread I/O).
- Les rooms peuvent avoir leur propre thread (tick) ou être tickées depuis la boucle principale (implémentation dépend du `Room`).
- Les accès partagés (listes de clients, état de room) doivent être protégés (mutex). Vérifier dans les fichiers `Room*.cpp` l'utilisation de `std::mutex` / `std::lock_guard`.

## 7. Logs / Debugging
- Le code utilise `std::cout` pour journaux de niveau basique (connexion, lecture, erreurs).
- Pour production : remplacer par un logger (spdlog / boost::log) et ajouter niveaux (info/debug/error).

## 8. Compilation (exemple)
Prérequis :
- compilo C++ (g++/clang++) support C++17 ou supérieur.
- Libs : Boost (system, asio header-only possible), pthread.
