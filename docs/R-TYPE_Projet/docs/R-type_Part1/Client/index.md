# Client_Technique

## 1. Introduction
Document technique décrivant le client réseau (dans `Networking/Networking/client`) et l'intégration au code RType.

## 2. Vue d'ensemble
Composants :
- `ClientRoom` : abstraction client pour une room (communication UDP, envoi d'inputs, réception d'états).
- `client/main.cpp` : exemple d'utilisation console / test harness.
- `PacketsManager` / `PacketsFactory` (partagé) : sérialisation/désérialisation.

Le client utilise `boost::asio` (UDP pour la room, TCP possible pour login/handshake), et exécute `io_context` dans un thread.

## 3. Points d'entrée
- `client/main.cpp` :
  - Init `boost::asio::io_context`.
  - Crée un `ClientRoom` (passage host + port).
  - Lance un thread d'entrée console qui lit des commandes (ex: `login`, `exit`).
  - Utilise `PacketsManager::buildPacket` pour construire les paquets, puis `async_write` (pour la partie TCP) ou `async_send_to` (UDP).

## 4. ClientRoom (détails)
- Construit un socket UDP lié à un endpoint local (`udp::endpoint(v4(), 0)`).
- Définit `_server_endpoint` avec l'adresse/port du serveur.
- Méthodes principales :
  - `Tx()` : envoi périodique ou en réponse d'inputs (construit via `PacketsManager` puis `async_send_to`).
  - `Rx()` : reçoit données via `async_receive_from`, parse via `PacketsManager::parsePacket`.
  - Intégration à `RTypeGame` : l'instance locale du jeu (`RTypeGame`) est tenue à jour avec les paquets `GameStatePacket` reçus.

## 5. Protocole observé
- Handshake initial (probablement via TCP login) : `LoginPacket`.
- Données de gameplay/inputs : `InputPacket` (envoi client → serveur).
- Réception d'état : `GameStatePacket` (serveur → client), souvent en UDP pour latence réduite.

## 6. Concurrence & thread model
- `io_context` tourne dans un thread.
- Thread d'entrée console pour envoyer commandes manuelles.
- Les callbacks asynchrones traitent la réception et mettent à jour l'état de jeu.

## 7. Compilation (exemple)
Commande générique :