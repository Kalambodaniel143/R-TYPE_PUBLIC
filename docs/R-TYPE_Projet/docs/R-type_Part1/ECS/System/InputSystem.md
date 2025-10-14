# ⌨️ Input System - Moteur Graphique R-Type

---

## 📋 Vue d'ensemble

L'**Input System** gère toutes les entrées utilisateur (clavier, souris) et les expose via :

- ✅ **Actions sémantiques** : Booléens persistants (actionPressed, actionJustPressed, actionJustReleased)
- ✅ **Axes** : Valeurs continues (-1, 0, +1) pour les déplacements
- ✅ **Touches directes** : Accès brut aux touches individuelles
- ✅ **Souris** : Position et boutons
- ✅ **Rebinding dynamique** : Modifier les contrôles à l'exécution
- ✅ **Singleton pattern** : Accès global facile
- ✅ **Abstraction backend** : Indépendant du renderer

---

## 🏗️ Architecture

### Flux d'Entrée

```
┌─────────────────────────────────┐
│   Événements SFML/Backend       │
│   (Clavier, Souris, Fenêtre)    │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  IInputBackend                  │
│  (Interface abstraction)        │
└────────────┬────────────────────�┘
             │
┌────────────▼────────────────────┐
│  InputManager (Singleton)       │
│  • Mappings actions             │
│  • État des touches             │
│  • Détection just pressed/rel   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Votre Code de Jeu              │
│  if (inputMgr.isActionPressed) │
└─────────────────────────────────┘
```

### Composants

#### InputManager (Singleton)
```cpp
class InputManager {
    static InputManager& getInstance();
    
    // Actions (booléens)
    void createAction(const std::string& name);
    void bindKey(const std::string& action, Key key);
    void bindMouseButton(const std::string& action, MouseButton btn);
    
    bool isActionPressed(const std::string& action) const;
    bool isActionJustPressed(const std::string& action) const;
    bool isActionJustReleased(const std::string& action) const;
    
    // Axes (valeurs -1, 0, +1)
    void createAxis(const std::string& name, Key negative, Key positive);
    float getAxis(const std::string& name) const;
    
    // Touches directes
    bool isKeyPressed(Key key) const;
    bool isKeyJustPressed(Key key) const;
    bool isKeyJustReleased(Key key) const;
    bool isMouseButtonPressed(MouseButton btn) const;
    
    // Souris
    void getMousePosition(int& x, int& y) const;
    
    // Cycle de mise à jour
    void update();
    
    // Backend
    void setBackend(IInputBackend* backend);
};
```

#### Énumérations des Touches

```cpp
enum class Key {
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
    Num0, Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8, Num9,
    Escape, LControl, LShift, LAlt, LSystem, RControl, RShift, RAlt, RSystem,
    Menu, LBracket, RBracket, Semicolon, Comma, Period, Quote, Slash, Backslash,
    Tilde, Equal, Hyphen, Space, Return, Backspace, Tab, PageUp, PageDown,
    End, Home, Insert, Delete, Add, Subtract, Multiply, Divide,
    Left, Right, Up, Down, Numpad0, Numpad1, Numpad2, Numpad3, Numpad4,
    Numpad5, Numpad6, Numpad7, Numpad8, Numpad9,
    F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15,
    Pause, ...
};

enum class MouseButton {
    Left,
    Right,
    Middle,
    XButton1,
    XButton2
};
```

---

## 🚀 Initialisation

### 1. Charger le Backend d'Entrée

```cpp
#include "GameEngine/Graphic/Systems/Input_system.hpp"
#include "GameEngine/Graphic/Systems/InputManager.hpp"

// Charger backend (après avoir créé le backend graphique)
void* backendHandle = dlopen("./LibEngine/Backends/sfml_backend.so", RTLD_NOW);

auto get_input_backend = (input::IInputBackend* (*)(graphics::IGraphicsBackend*))
    dlsym(backendHandle, "get_input_backend");

input::IInputBackend* inputBackend = get_input_backend(graphicsBackend);

// Configurer le manager
auto& inputMgr = input::InputManager::getInstance();
inputMgr.setBackend(inputBackend);
```

### 2. Enregistrer le Système ECS

```cpp
void* inputHandle = dlopen("./LibEngine/Systems/input_system.so", RTLD_NOW);

auto register_input = (void(*)(registry&))
    dlsym(inputHandle, "register_systems");

register_input(reg);
```

### 3. Configurer les Contrôles

```cpp
auto& inputMgr = input::InputManager::getInstance();

// ===== ACTIONS =====
// Mouvements
inputMgr.createAction("MoveUp");
inputMgr.bindKey("MoveUp", input::Key::Z);
inputMgr.bindKey("MoveUp", input::Key::Up);

inputMgr.createAction("MoveDown");
inputMgr.bindKey("MoveDown", input::Key::S);
inputMgr.bindKey("MoveDown", input::Key::Down);

inputMgr.createAction("MoveLeft");
inputMgr.bindKey("MoveLeft", input::Key::Q);
inputMgr.bindKey("MoveLeft", input::Key::Left);

inputMgr.createAction("MoveRight");
inputMgr.bindKey("MoveRight", input::Key::D);
inputMgr.bindKey("MoveRight", input::Key::Right);

// Actions
inputMgr.createAction("Shoot");
inputMgr.bindKey("Shoot", input::Key::Space);
inputMgr.bindMouseButton("Shoot", input::MouseButton::Left);

inputMgr.createAction("Pause");
inputMgr.bindKey("Pause", input::Key::Escape);

inputMgr.createAction("Sprint");
inputMgr.bindKey("Sprint", input::Key::LShift);

// ===== AXES =====
// Déplacement horizontal
inputMgr.createAxis("Horizontal", input::Key::Q, input::Key::D);

// Déplacement vertical
inputMgr.createAxis("Vertical", input::Key::S, input::Key::Z);

std::cout << "✓ Contrôles configurés" << std::endl;
```

---

## 🎮 Utilisation Courante

### Actions (Booléens)

#### Vérifier si une Action est Pressée

```cpp
auto& inputMgr = input::InputManager::getInstance();

if (inputMgr.isActionPressed("Shoot")) {
    // Tir en continu tant que la touche est maintenue
    shootTimer += deltaTime;
    
    if (shootTimer > fireRate) {
        spawnBullet();
        shootTimer = 0.f;
    }
}
```

#### Vérifier si une Action Vient d'être Pressée

```cpp
if (inputMgr.isActionJustPressed("Jump")) {
    // Déclenché UNE SEULE FOIS au moment du pressage
    player.jump();
}

if (inputMgr.isActionJustPressed("Pause")) {
    pauseGame();
}
```

#### Vérifier si une Action Vient d'être Relâchée

```cpp
if (inputMgr.isActionJustReleased("Charge")) {
    // Le joueur a relâché le bouton après une charge
    releaseChargedAttack();
}
```

### Axes (Valeurs Continues)

#### Axe Simple (Déplacement)

```cpp
// Retourne -1 (négatif appuyé), 0 (rien), ou +1 (positif appuyé)
float horizontalAxis = inputMgr.getAxis("Horizontal");
float verticalAxis = inputMgr.getAxis("Vertical");

// Appliquer le mouvement
auto& transforms = reg.get_components<component::transform>();
auto* playerT = transforms.get_ptr(playerEntity);

if (playerT) {
    playerT->_x += horizontalAxis * moveSpeed * deltaTime;
    playerT->_y += verticalAxis * moveSpeed * deltaTime;
}
```

#### Normaliser la Diagonale

```cpp
float h = inputMgr.getAxis("Horizontal");
float v = inputMgr.getAxis("Vertical");

// Éviter le boost diagonal
if (h != 0.f && v != 0.f) {
    float magnitude = std::sqrt(h*h + v*v);
    h /= magnitude;
    v /= magnitude;
}

velocity.x = h * moveSpeed;
velocity.y = v * moveSpeed;
```

### Touches Directes (Sans Actions)

```cpp
// Vérifier une touche individuelle
if (inputMgr.isKeyPressed(input::Key::F1)) {
    toggleDebugMode();
}

if (inputMgr.isKeyJustPressed(input::Key::Escape)) {
    openPauseMenu();
}

if (inputMgr.isKeyJustReleased(input::Key::Return)) {
    submitMenuOption();
}
```

### Souris

```cpp
// Position souris
int mouseX, mouseY;
inputMgr.getMousePosition(mouseX, mouseY);

// Boutons souris
if (inputMgr.isMouseButtonPressed(input::MouseButton::Left)) {
    fireAtMousePosition(mouseX, mouseY);
}

if (inputMgr.isMouseButtonJustPressed(input::MouseButton::Right)) {
    openContextMenu(mouseX, mouseY);
}
```

---

## 🔄 Cycle de Mise à Jour

### Où Appeler update() ?

L'`InputSystem` appelle automatiquement `inputMgr.update()` à chaque frame via le registre ECS :

```cpp
while (backend->isOpen()) {
    // Votre logique de jeu
    
    // Le système ECS s'exécute (Input System inclus)
    reg.run_systems();  // ← update() appelé ici
}
```

Ou manuellement si vous n'utilisez pas `run_systems()` :

```cpp
while (backend->isOpen()) {
    // Événements
    backend->pollEvents();
    
    // Mise à jour input
    inputMgr.update();  // ← Important pour just pressed/released
    
    // Logique
    updateGame();
    
    // Rendu
    render();
}
```

---

## ⚙️ Configuration Avancée

### Rebinding Dynamique

```cpp
// Permettre au joueur de reconfigurer ses contrôles

void rebindKey(const std::string& action, input::Key newKey) {
    auto& inputMgr = input::InputManager::getInstance();
    
    // Enlever tous les anciens bindings
    // (Note: API complète dépend de l'implémentation)
    
    // Ajouter le nouveau
    inputMgr.bindKey(action, newKey);
}

// Utilisation
if (userSelectsRebindMenu) {
    rebindKey("Shoot", input::Key::W);
}
```

### Gamepads (Future Extension)

Actuellement supporté :
- Clavier
- Souris

Extensible pour :
- Gamepads/Manettes
- Joysticks
- Manettes Xbox/PlayStation

```cpp
// Futur
inputMgr.createAxis("StickHorizontal", GamepadAxis::LeftX);
inputMgr.createAction("ButtonA");
inputMgr.bindGamepadButton("ButtonA", GamepadButton::A);
```

### Combos (Entrées Multiples)

```cpp
struct InputCombo {
    std::string name;
    std::vector<std::string> sequence;
    float timeWindow;
    float timeSinceLastInput;
};

// Système de combo personnalisé
if (inputMgr.isActionJustPressed("Punch")) {
    // Ajouter à la séquence
    comboSequence.push_back("Punch");
    comboTimer = timeWindow;
}

if (inputMgr.isActionJustPressed("Kick")) {
    comboSequence.push_back("Kick");
    comboTimer = timeWindow;
}

// Vérifier pattern
if (comboSequence.size() >= 3 &&
    comboSequence[0] == "Punch" &&
    comboSequence[1] == "Punch" &&
    comboSequence[2] == "Kick") {
    executeSpecialMove();
    comboSequence.clear();
}
```

---

## 🎮 Exemples Pratiques

### Jeu de Type Shoot'em Up (R-Type)

```cpp
auto& inputMgr = input::InputManager::getInstance();

// Configuration
inputMgr.createAction("MoveUp");
inputMgr.createAction("MoveDown");
inputMgr.createAction("MoveLeft");
inputMgr.createAction("MoveRight");
inputMgr.createAction("Shoot");

// Bindage
inputMgr.bindKey("MoveUp", input::Key::Z);
inputMgr.bindKey("MoveDown", input::Key::S);
inputMgr.bindKey("MoveLeft", input::Key::Q);
inputMgr.bindKey("MoveRight", input::Key::D);
inputMgr.bindKey("Shoot", input::Key::Space);

// Dans la boucle de jeu
while (backend->isOpen()) {
    auto& transforms = reg.get_components<component::transform>();
    auto* playerT = transforms.get_ptr(playerEntity);
    
    if (playerT) {
        // Déplacement
        const float speed = 300.f;
        
        if (inputMgr.isActionPressed("MoveUp")) {
            playerT->_y -= speed * deltaTime;
        }
        if (inputMgr.isActionPressed("MoveDown")) {
            playerT->_y += speed * deltaTime;
        }
        if (inputMgr.isActionPressed("MoveLeft")) {
            playerT->_x -= speed * deltaTime;
        }
        if (inputMgr.isActionPressed("MoveRight")) {
            playerT->_x += speed * deltaTime;
        }
        
        // Tir automatique
        if (inputMgr.isActionPressed("Shoot")) {
            shootTimer += deltaTime;
            if (shootTimer >= shootInterval) {
                spawnBullet(reg, playerT->_x, playerT->_y);
                shootTimer = 0.f;
            }
        }
    }
    
    reg.run_systems();
}
```

### Jeu Puzzle avec Axes

```cpp
auto& inputMgr = input::InputManager::getInstance();

inputMgr.createAxis("Horizontal", input::Key::Left, input::Key::Right);
inputMgr.createAxis("Vertical", input::Key::Down, input::Key::Up);
inputMgr.createAction("Interact");
inputMgr.bindKey("Interact", input::Key::Return);

while (backend->isOpen()) {
    float h = inputMgr.getAxis("Horizontal");
    float v = inputMgr.getAxis("Vertical");
    
    // Déplacer le curseur/sélection
    if (h != 0.f || v != 0.f) {
        gridX += (int)h;
        gridY += (int)v;
        gridX = std::clamp(gridX, 0, 9);
        gridY = std::clamp(gridY, 0, 9);
    }
    
    // Interagir
    if (inputMgr.isActionJustPressed("Interact")) {
        selectTile(gridX, gridY);
    }
    
    reg.run_systems();
}
```

### Menu de Jeu

```cpp
enum MenuOption { PLAY, SETTINGS, QUIT };
MenuOption currentOption = PLAY;

while (backend->isOpen()) {
    if (inputMgr.isActionJustPressed("MoveUp")) {
        currentOption = (MenuOption)((currentOption - 1 + 3) % 3);
    }
    if (inputMgr.isActionJustPressed("MoveDown")) {
        currentOption = (MenuOption)((currentOption + 1) % 3);
    }
    
    if (inputMgr.isActionJustPressed("Shoot")) {  // Select
        switch (currentOption) {
            case PLAY:
                startGame();
                break;
            case SETTINGS:
                openSettings();
                break;
            case QUIT:
                backend->close();
                break;
        }
    }
    
    renderMenu(currentOption);
    reg.run_systems();
}
```

---

## 📊 État des Touches

### État Complet d'une Touche

```
Avant : [Relâché]
        |
        ↓
[Espace] Pressé → [isKeyJustPressed = true]
        |
        ↓
Pendant : [Appuyé] → [isKeyPressed = true]
          (frames suivantes)
        |
        ↓
[Espace] Relâché → [isKeyJustReleased = true]
        |
        ↓
Après : [Relâché] → [isKeyPressed = false]
```

### Exemple Temporel

```
Frame 1 : Utilisateur appuie
  - isKeyJustPressed() → TRUE
  - isKeyPressed() → TRUE

Frame 2 : Utilisateur maintient
  - isKeyJustPressed() → FALSE
  - isKeyPressed() → TRUE

Frame 3 : Utilisateur maintient
  - isKeyJustPressed() → FALSE
  - isKeyPressed() → TRUE

Frame 4 : Utilisateur relâche
  - isKeyJustReleased() → TRUE
  - isKeyPressed() → FALSE

Frame 5 : Touche relâchée
  - isKeyJustReleased() → FALSE
  - isKeyPressed() → FALSE
```

---

## 🔧 Debugging

### Afficher l'État des Entrées

```cpp
// En développement
if (inputMgr.isKeyPressed(input::Key::F1)) {
    std::cout << "=== INPUT DEBUG ===" << std::endl;
    std::cout << "MoveUp: " << inputMgr.isActionPressed("MoveUp") << std::endl;
    std::cout << "Shoot: " << inputMgr.isActionPressed("Shoot") << std::endl;
    std::cout << "Horizontal: " << inputMgr.getAxis("Horizontal") << std::endl;
    
    int mx, my;
    inputMgr.getMousePosition(mx, my);
    std::cout << "Mouse: (" << mx << ", " << my << ")" << std::endl;
}
```

### Logger les Événements

```cpp
void logInputEvent(const std::string& eventType, const std::string& key) {
    std::cout << "[INPUT] " << eventType << ": " << key << std::endl;
}

if (inputMgr.isActionJustPressed("Shoot")) {
    logInputEvent("PRESSED", "Shoot");
}

if (inputMgr.isActionJustReleased("Charge")) {
    logInputEvent("RELEASED", "Charge");
}
```

---

## 📚 Référence Complète

### Méthodes Actions

| Méthode | Retour | Description |
|---------|--------|-------------|
| `createAction(name)` | void | Créer une nouvelle action |
| `bindKey(action, key)` | void | Lier une touche à une action |
| `bindMouseButton(action, btn)` | void | Lier un bouton souris |
| `isActionPressed(name)` | bool | Action maintenue ? |
| `isActionJustPressed(name)` | bool | Action vient d'être pressée ? |
| `isActionJustReleased(name)` | bool | Action vient d'être relâchée ? |

### Méthodes Axes

| Méthode | Retour | Description |
|---------|--------|-------------|
| `createAxis(name, neg, pos)` | void | Créer un axe |
| `getAxis(name)` | float | Obtenir valeur (-1, 0, +1) |

### Touches Directes

| Méthode | Retour | Description |
|---------|--------|-------------|
| `isKeyPressed(key)` | bool | Touche maintenue ? |
| `isKeyJustPressed(key)` | bool | Touche vient d'être pressée ? |
| `isKeyJustReleased(key)` | bool | Touche vient d'être relâchée ? |
| `isMouseButtonPressed(btn)` | bool | Bouton souris appuyé ? |

### Souris

| Méthode | Retour | Description |
|---------|--------|-------------|
| `getMousePosition(x, y)` | void | Obtenir position |

---

## 💡 Bonnes Pratiques

1. **Créer des actions sémantiques** : Utiliser des noms logiques ("Shoot" plutôt que "Space")
2. **Multi-binding** : Permettre plusieurs touches pour une action (ZQSD + Flèches)
3. **Appeler update()** : Ne pas oublier à chaque frame
4. **Just vs Pressed** : Utiliser `JustPressed` pour les événements, `Pressed` pour l'effet continu
5. **Normaliser les diagonales** : Pour les axes en 2D
6. **Rebinding** : Offrir la possibilité aux joueurs de modifier les contrôles
7. **Feedback** : Vibrations/son pour confirmer les entrées
