
# **Protocole Réseau — R-Type Multiplayer Engine**

## 1. Objectif

Le protocole réseau du projet **R-Type** vise à permettre la **communication fiable et rapide** entre les clients (joueurs) et le serveur central du jeu, en combinant deux modes de transport :

* **TCP** pour les échanges critiques (connexion, login, gestion des rooms),
* **UDP** pour les échanges temps réel (positions, tirs, collisions).

Cette approche garantit à la fois la **fiabilité des échanges de contrôle** et la **performance du gameplay**.

---

## 2. Architecture générale

### Communication Hybride

| Couche       | Protocole | Rôle                                                            |
| ------------ | --------- | --------------------------------------------------------------- |
| **Contrôle** | TCP       | Connexion, authentification, création et gestion des rooms.     |
| **Gameplay** | UDP       | Envoi d'entrées et synchronisation d’état du jeu en temps réel. |

### Schéma simplifié

```
   TCP (Gestion / Connexion)
┌────────────┐                                ┌────────────┐
│   Client   │ <────────────────────────────> │   Serveur  │
└────────────┘                                └────────────┘
        ↑                                           ↑
        |                UDP (Gameplay)              |
        └──────────────→ (Entrées / États) ─────────┘
```

---

## 3. Phases de communication

### Étape 1 — Connexion TCP et authentification

1. Le client établit une connexion TCP avec le serveur (`ServerHub`).
2. Le client envoie un **LoginPacket** contenant :

   * le nom du joueur,
   * un identifiant de session ou de version.
3. Le serveur valide le login et peut retourner un **RoomPacket** pour informer le client qu’une room est prête à rejoindre.

**Transport utilisé : TCP**
**Paquet concerné : `LoginPacket`**

---

### Étape 2 — Attribution d’une Room

Lorsqu’un joueur rejoint ou crée une room :

1. Le serveur attribue dynamiquement un **port UDP** pour cette room.
2. Il envoie au client un **RoomPacket** contenant ce port :

   ```cpp
   class RoomPacket : public IPacket {
       public:
           uint16_t port;
           PacketType getType() const override { return PacketType::ROOMCONNECTION; }
   };
   ```
3. Le client utilise ce port pour créer un client UDP (`ClientRoom`) et passer en communication temps réel.

**Transport utilisé : TCP**
**Paquet concerné : `RoomPacket`**

---

### Étape 3 — Phase de jeu temps réel (UDP)

Une fois dans la room :

* Le **client** envoie périodiquement des **InputPacket** :

  * ces paquets contiennent les actions du joueur (ex : mouvement, tir).

  ```cpp
  struct InputPacket : IPacket {
      uint8_t playerId;
      uint8_t inputMask; // bits correspondant aux actions (haut, bas, gauche, tir, etc.)
  };
  ```

* Le **serveur** envoie en retour des **GameStatePacket**, qui contiennent :

  * les positions des entités,
  * les états des projectiles, ennemis, joueurs, etc.

  ```cpp
  struct GameStatePacket : IPacket {
      std::vector<EntityState> entities; // chaque entité = id, position, état
  };
  ```

Le serveur diffuse régulièrement ces informations afin de maintenir tous les joueurs synchronisés, même en cas de perte de paquets (UDP non fiable).

**Transport utilisé : UDP**
**Paquets concernés : `InputPacket`, `GameStatePacket`**

---

###  Étape 4 — Fin de partie / déconnexion

Lorsqu’un joueur quitte la room :

1. Le client envoie un **DisconnectPacket**.
2. Le serveur retire le joueur de la room et notifie les autres joueurs.
3. Si la room est vide, elle est détruite.

**Transport utilisé : TCP ou UDP (selon l’état de la partie)**
**Paquet concerné : `DisconnectPacket`**

---

## 4.  Format des paquets

Tous les paquets héritent de l’interface commune `IPacket` :

```cpp
class IPacket {
public:
    virtual ~IPacket() = default;
    virtual PacketType getType() const = 0;
    virtual std::vector<uint8_t> serialize() const = 0;
    virtual void deserialize(const std::vector<uint8_t>& data) = 0;
};
```

### En-tête standard des paquets binaires

| Champ   | Taille   | Description                                       |
| ------- | -------- | ------------------------------------------------- |
| Type    | 1 octet  | Identifie le type du paquet (`PacketType`)        |
| Taille  | 2 octets | Taille du corps du paquet                         |
| Données | variable | Données spécifiques (texte, entités, états, etc.) |

### Exemple de sérialisation

```cpp
std::vector<uint8_t> LoginPacket::serialize() const {
    std::vector<uint8_t> data;
    data.push_back(static_cast<uint8_t>(PacketType::LOGIN));
    appendString(data, username);
    appendString(data, version);
    return data;
}
```

### Exemple de désérialisation

```cpp
void LoginPacket::deserialize(const std::vector<uint8_t>& data) {
    size_t offset = 1;
    username = readString(data, offset);
    version = readString(data, offset);
}
```

---

## 5. Gestion centralisée des paquets

Deux classes assurent la modularité et l’évolutivité du protocole :

| Classe             | Rôle                                                        |
| ------------------ | ----------------------------------------------------------- |
| **PacketsFactory** | Crée le bon type de paquet selon le type lu dans le header. |
| **PacketsManager** | Sérialise et désérialise les paquets de manière uniforme.   |

### Exemple

```cpp
auto login = LoginPacket("Player1", "v1.0", "R-Type");
auto bytes = packetManager.buildPacket(login);
auto parsed = packetManager.parsePacket(bytes);
```

Cette approche permet d’ajouter de nouveaux paquets sans modifier le cœur réseau.

---

## 6. Communication asynchrone (Boost.Asio)

Le protocole repose sur un modèle **asynchrone non-bloquant**, grâce à Boost.Asio :

### Exemple côté serveur

```cpp
acceptor.async_accept(socket, handler);
```

* Permet de gérer plusieurs connexions simultanément (multiclient TCP).
* Chaque client possède son propre thread `io_context`.

### Exemple côté client

```cpp
socket.async_receive_from(buffer, sender_endpoint, handler);
```

* Permet la réception continue sans bloquer le flux d’entrée.
* Combine un thread `io.run()` et un thread d’entrée utilisateur.

---

## 7. Intégrité et sécurité

Le protocole prévoit des mécanismes d’extension pour :

* **compression** des paquets (réduction du trafic),
* **chiffrement** (protection des données sensibles comme le login),
* **vérification CRC / checksum** pour détecter les paquets corrompus.

Ces fonctionnalités sont optionnelles mais prêtes à l’intégration via les utilitaires `encrypt.cpp` et `compress.cpp`.

---

## 8.  Séquence de communication typique

```
[Client] ---------------------------------------- TCP ----------------------------------------> [Serveur]
           LoginPacket { username="Player1", version="R-Type" }

[Serveur] <-------------------------------------- TCP ----------------------------------------- [Client]
           RoomPacket { port=4000 }

[Client] ---------------------------------------- UDP ----------------------------------------> [Serveur]
           InputPacket { inputMask=0b1010 }

[Serveur] <-------------------------------------- UDP ----------------------------------------- [Client]
           GameStatePacket { entities=[player1, enemy, bullet...] }

[Client] ---------------------------------------- TCP ----------------------------------------> [Serveur]
           DisconnectPacket
```

---

## 9.  Typologie des paquets

| Type             | Code Hex | Description                          | Transport |
| ---------------- | -------- | ------------------------------------ | --------- |
| `LOGIN`          | `0x01`   | Authentification du joueur           | TCP       |
| `LOGOUT`         | `0x02`   | Déconnexion propre                   | TCP       |
| `ROOMCONNECTION` | `0x03`   | Informations pour rejoindre une room | TCP       |
| `INPUT`          | `0x10`   | Entrées joueur (clavier / manette)   | UDP       |
| `GAME_STATE`     | `0x11`   | État global du jeu (positions, etc.) | UDP       |
| `SPAWN_ENTITY`   | `0x12`   | Apparition d’une entité              | UDP       |
| `DESTROY_ENTITY` | `0x13`   | Suppression d’une entité             | UDP       |
| `UPDATE_ENTITY`  | `0x14`   | Mise à jour d’une entité             | UDP       |
| `PING`           | `0x20`   | Vérification de latence              | TCP       |
| `PONG`           | `0x21`   | Réponse au ping                      | TCP       |
| `ERROR_PACKET`   | `0xFF`   | Paquet invalide ou non reconnu       | TCP       |

---

## 10.  Gestion des Rooms

* Chaque **Room** correspond à un serveur UDP distinct, créé à la demande.
* Le port UDP est communiqué au client via un `RoomPacket`.
* Le client fork ou lance un nouveau processus dédié (`ClientRoom`) pour gérer la partie.

### Avantages :

* Isolation complète entre les parties.
* Possibilité d’avoir plusieurs rooms en parallèle.
* Évolutif (un serveur peut héberger plusieurs rooms simultanément).

---

## 11.  Résumé

| Étape               | Paquets utilisés                 | Protocole | Rôle                               |
| ------------------- | -------------------------------- | --------- | ---------------------------------- |
| Authentification    | `LoginPacket`                    | TCP       | Connexion du joueur                |
| Attribution de room | `RoomPacket`                     | TCP       | Redirection vers un serveur de jeu |
| Gameplay            | `InputPacket`, `GameStatePacket` | UDP       | Synchronisation temps réel         |
| Fin de partie       | `DisconnectPacket`               | TCP       | Fermeture propre                   |

---

## 12.  Points clés du design

* **TCP pour la fiabilité**, UDP pour la **rapidité**.
* Architecture modulaire (chaque paquet est une classe autonome).
* Sérialisation binaire uniforme et extensible.
* Communication asynchrone et non bloquante.
* Prête pour le multithreading et la montée en charge.

---