## Server — Guide utilisateur

## Objectif
Guide d'utilisation minimal pour lancer le serveur fourni dans le projet.

## 1. Pré-requis
- Système Linux / macOS / Windows avec toolchain (g++)
- Boost C++ Libraries (au moins `boost::system`, `boost::asio` headers)
- pthread (sur Unix)
- Accès au dossier extrait

## 2. Compilation
Le projet ne fournit pas (dans l'archive) de `CMakeLists.txt` complet. Voici une commande générique d'exemple à exécuter depuis `Networking/Networking` :

```bash
# positionnez-vous dans le dossier Networking/Networking
cd /mnt/data/extracted/Networking/Networking

g++ -std=c++17 server/main.cpp server/ServerHub.cpp server/RoomManager.cpp \
    ../PacketsManager.cpp ../PacketsManager.cpp ../PacketsFactory.cpp \
    -I. -I../ -I../../RType-Game/RType-Game/Packets \
    -lboost_system -pthread -o rtype_server