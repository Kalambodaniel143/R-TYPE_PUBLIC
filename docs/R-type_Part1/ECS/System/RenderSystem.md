#  Render System - Moteur Graphique R-Type

---


Le **Render System** est un système ECS modulaire responsable de l'affichage de tous les éléments visuels du jeu. Il gère :

- Rendu de sprites avec textures
- Rendu de texte (UI, HUD)
- Tri automatique par profondeur (layers)
- Application des transformations (position, rotation, échelle)
- Gestion intelligente du cache (textures et polices)
- Support caméra 2D (zoom, pan, viewport)
- Gestion de la visibilité et des couleurs (tint)

---

##  Architecture

### Pipeline de Rendu

```
┌─────────────────────────────────┐
│  1. Collecte des Entités        │
│     (Transform + Drawable/Text) │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  2. Récupération Caméra Active  │
│     (Position, Zoom, Viewport)  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  3. Tri par Layer (Croissant)   │
│     (Fond → Premier Plan)       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  4. Rendu Chaque Entité         │
│     • Chargement ressource      │
│     • Calcul transform caméra   │
│     • Draw via backend          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  5. Display (Swap Buffers)      │
└─────────────────────────────────┘
```

### Composants Impliqués

#### Transform (Obligatoire)
```cpp
struct transform {
    float _x, _y;              // Position dans le monde
    float _rotation;           // Rotation en degrés (0-360)
    float _scale_x, _scale_y;  // Facteur d'échelle
};
```

#### Drawable (Pour Sprites)
```cpp
struct Drawable {
    std::string texturePath;           // Chemin relative "Assets/..."
    Color tint;                        // Teinte RGBA (0-255)
    bool visible;                      // Affichable ?
    int layer;                         // Profondeur (tri automatique)
    
    // Animation spritesheet
    bool isAnimated;                   // Active l'animation ?
    Animation animation;               // Config animation
    size_t currentFrame;               // Frame actuelle
    float frameTimer;                  // Temps depuis dernière frame
    
    // Spritesheet support
    bool hasTextureRect;               // Utiliser sous-région ?
    Rect textureRect;                  // {x, y, width, height}
    
    // Flip/Mirror
    bool flipHorizontal;
    bool flipVertical;
};
```

#### Text (Pour Texte)
```cpp
struct Text {
    std::string content;               // Contenu du texte
    std::string fontPath;              // "Assets/fonts/arial.ttf"
    unsigned int fontSize;             // Taille en pixels
    Color color;                       // RGBA
    int layer;                         // Profondeur
    bool visible;                      // Affichable ?
    TextAlignment alignment;           // LEFT, CENTER, RIGHT
};
```

#### Camera (Contrôle Vue)
```cpp
struct Camera {
    float x, y;                        // Position dans le monde
    float zoom;                        // 1.0 = 100%, 2.0 = 200%
    unsigned int viewportWidth;        // Largeur écran en pixels
    unsigned int viewportHeight;       // Hauteur écran en pixels
    bool active;                       //  UNE SEULE active à la fois
};
```

---

##  Initialisation

### 1. Enregistrement du Système

```cpp
#include "GameEngine/Graphic/Systems/Render_system.hpp"
#include "GameEngine/Graphic/back_lib/IGraphicsBackend.hpp"

// Charger le backend SFML
void* backendHandle = dlopen("./LibEngine/Backends/sfml_backend.so", RTLD_NOW);
auto create_backend = (graphics::IGraphicsBackend* (*)())
    dlsym(backendHandle, "create_backend");

graphics::IGraphicsBackend* backend = create_backend();
backend->init(1920, 1080, "Mon Jeu R-Type");

// Configurer le Render System
void* renderHandle = dlopen("./LibEngine/Systems/render_system.so", RTLD_NOW);
auto set_backend = (void(*)(graphics::IGraphicsBackend*))
    dlsym(renderHandle, "set_graphics_backend");
set_backend(backend);

// Enregistrer le système
auto register_render = (void(*)(registry&))
    dlsym(renderHandle, "register_systems");
register_render(reg);
```

### 2. Configuration des Composants

```cpp
registry reg;

// Enregistrer les composants ECS
reg.register_components<component::transform>();
reg.register_components<component::Drawable>();
reg.register_components<component::Text>();
reg.register_components<component::Camera>();
```

### 3. Créer une Caméra

```cpp
// Une seule caméra active à la fois !
auto cameraEntity = reg.spawn_entity();

component::Camera camera;
camera.x = 0.f;
camera.y = 0.f;
camera.zoom = 1.0f;
camera.viewportWidth = 1920;
camera.viewportHeight = 1080;
camera.active = true;  

reg.add_component(cameraEntity, camera);
```

---

## Utilisation Courante

### Créer un Sprite Simple

```cpp
auto player = reg.spawn_entity();

// Transform (position, rotation, échelle)
component::transform playerTransform;
playerTransform._x = 400.f;
playerTransform._y = 300.f;
playerTransform._rotation = 0.f;
playerTransform._scale_x = 2.f;
playerTransform._scale_y = 2.f;
reg.add_component(player, playerTransform);

// Drawable (image)
component::Drawable playerSprite;
playerSprite.texturePath = "Assets/Textures/Ship/ship_1.png";
playerSprite.tint = {255, 255, 255, 255};  // Blanc = couleur normale
playerSprite.visible = true;
playerSprite.layer = 5;
playerSprite.isAnimated = false;
playerSprite.hasTextureRect = false;
reg.add_component(player, playerSprite);
```

### Créer un Texte (UI)

```cpp
auto scoreEntity = reg.spawn_entity();

// Transform pour position
component::transform scoreTransform{10.f, 10.f, 0.f, 1.f, 1.f};
reg.add_component(scoreEntity, scoreTransform);

// Texte
component::Text scoreText;
scoreText.content = "Score: 0";
scoreText.fontPath = "Assets/Fonts/arial.ttf";
scoreText.fontSize = 32;
scoreText.color = {255, 255, 255, 255};  // Blanc
scoreText.layer = 100;  // Au-dessus des sprites
scoreText.visible = true;
scoreText.alignment = component::TextAlignment::LEFT;
reg.add_component(scoreEntity, scoreText);
```

### Créer un Sprite avec Spritesheet

```cpp
component::Drawable bulletSprite;
bulletSprite.texturePath = "Assets/Textures/Bullet/bullet_1.png";
bulletSprite.hasTextureRect = true;
bulletSprite.textureRect = {0, 0, 32, 32};  // Rectangle dans la texture
bulletSprite.layer = 3;
bulletSprite.visible = true;
bulletSprite.isAnimated = false;
reg.add_component(bulletEntity, bulletSprite);
```

---

## Transformations

### Modifier la Position

```cpp
auto& transforms = reg.get_components<component::transform>();
auto* playerTransform = transforms.get_ptr(playerEntity);

if (playerTransform) {
    playerTransform->_x += velocityX * deltaTime;
    playerTransform->_y += velocityY * deltaTime;
}
```

### Modifier la Rotation

```cpp
if (playerTransform) {
    playerTransform->_rotation += rotationSpeed * deltaTime;
    
    // Normaliser entre 0-360°
    if (playerTransform->_rotation >= 360.f) {
        playerTransform->_rotation -= 360.f;
    }
}
```

### Modifier l'Échelle

```cpp
if (playerTransform) {
    playerTransform->_scale_x = 2.5f;
    playerTransform->_scale_y = 2.5f;
}
```

### Flip/Mirror

```cpp
auto& drawables = reg.get_components<component::Drawable>();
auto* sprite = drawables.get_ptr(entity);

if (sprite) {
    sprite->flipHorizontal = true;   // Miroir horizontal
    sprite->flipVertical = false;    // Normal vertical
}
```

---

## Gestion des Couches (Layers)

Les layers contrôlent l'ordre de rendu. Les nombres plus petits s'affichent en premier (derrière).

### Exemple de Hiérarchie

```cpp
int layerBackground = 0;        // Fond lointain
int layerBackElements = 5;      // Parallax, nuages
int layerGameplay = 10;         // Joueur, ennemis, balles
int layerForeground = 20;       // Effets de particules
int layerUI = 100;              // HUD, texte score
int layerPopup = 200;           // Menus, dialogs
```

### Pratique

```cpp
// Étoiles lointaines
component::Drawable starsSprite;
starsSprite.texturePath = "Assets/Background/stars.png";
starsSprite.layer = 0;
reg.add_component(starsEntity, starsSprite);

// Joueur
component::Drawable playerSprite;
playerSprite.texturePath = "Assets/Player/ship.png";
playerSprite.layer = 10;  // Devant les étoiles
reg.add_component(playerEntity, playerSprite);

// HUD
component::Text scoreText;
scoreText.content = "Score: 1000";
scoreText.layer = 100;  // Devant tout
reg.add_component(scoreEntity, scoreText);
```

---

## Système de Caméra

### Configuration de Base

```cpp
auto cameraEntity = reg.spawn_entity();

component::Camera camera;
camera.x = 0.f;                   // Position X dans le monde
camera.y = 0.f;                   // Position Y dans le monde
camera.zoom = 1.0f;               // 1.0 = normal
camera.viewportWidth = 1920;      // Résolution écran
camera.viewportHeight = 1080;
camera.active = true;             // Active cette caméra

reg.add_component(cameraEntity, camera);
```

### Zoom

```cpp
auto& cameras = reg.get_components<component::Camera>();

for (size_t i = 0; i < cameras.size(); ++i) {
    if (cameras.has(i)) {
        auto* cam = cameras.get_ptr(i);
        if (cam && cam->active) {
            cam->zoom = 2.0f;  // 2x zoom
        }
    }
}
```

### Suivre le Joueur (Smooth Lerp)

```cpp
auto& cameras = reg.get_components<component::Camera>();
auto& transforms = reg.get_components<component::transform>();

auto* playerT = transforms.get_ptr(playerEntity);

for (size_t i = 0; i < cameras.size(); ++i) {
    if (cameras.has(i)) {
        auto* cam = cameras.get_ptr(i);
        if (cam && cam->active && playerT) {
            // Lisser avec lerp pour pas de saccades
            float lerpSpeed = 0.1f;
            cam->x = cam->x * (1 - lerpSpeed) + (playerT->_x - 960.f) * lerpSpeed;
            cam->y = cam->y * (1 - lerpSpeed) + (playerT->_y - 540.f) * lerpSpeed;
        }
    }
}
```

### Parallax (Défilement Lent du Background)

```cpp
// Background se déplace à 30% de la vitesse de la caméra
auto* bgTransform = transforms.get_ptr(backgroundEntity);
auto* camera = cameras.get_ptr(cameraEntity);

if (bgTransform && camera) {
    bgTransform->_x = camera->x * 0.3f;
    bgTransform->_y = camera->y * 0.3f;
}
```

---

## Teinte et Couleurs

### Appliquer une Teinte

```cpp
component::Drawable sprite;
sprite.texturePath = "Assets/enemy.png";

// Couleur normale (pas de teinte)
sprite.tint = {255, 255, 255, 255};  // RGBA

// Teinte rouge
sprite.tint = {255, 128, 128, 255};

// Semi-transparent
sprite.tint = {255, 255, 255, 128};  // 50% opacité

// Bleu sombre
sprite.tint = {64, 128, 255, 255};
```

### Effets Flash (Dégât)

```cpp
float flashTimer = 0.2f;  // Durée du flash
float flashSpeed = 0.05f;  // Vitesse d'alternance

// Mise à jour
if (takingDamage) {
    flashTimer -= deltaTime;
    
    if ((int)(flashTimer / flashSpeed) % 2 == 0) {
        sprite.tint = {255, 100, 100, 255};  // Rouge
    } else {
        sprite.tint = {255, 255, 255, 255};  // Normal
    }
    
    if (flashTimer <= 0) {
        takingDamage = false;
    }
}
```

---

## Gestion du Texte

### Mise à Jour du Contenu

```cpp
auto& texts = reg.get_components<component::Text>();
auto* scoreText = texts.get_ptr(scoreEntity);

if (scoreText) {
    scoreText->content = "Score: " + std::to_string(currentScore);
    scoreText->fontSize = 32;
    scoreText->color = {255, 255, 255, 255};
}
```

### Alignement du Texte

```cpp
component::Text text;
text.content = "Centered Text";
text.alignment = component::TextAlignment::CENTER;  // Centré

// Options
// component::TextAlignment::LEFT
// component::TextAlignment::CENTER
// component::TextAlignment::RIGHT
```

### Obtenir Dimensions du Texte

```cpp
// Dimensions pour centrer ou positionner correctement
float textWidth = backend->getTextWidth(font, "Score: 1000");
float textHeight = backend->getTextHeight(font, "Score: 1000");
```

---

## Animation Spritesheet

### Configuration Simple

```cpp
component::Drawable sprite;
sprite.texturePath = "Assets/Textures/Explosion.png";
sprite.hasTextureRect = true;
sprite.textureRect = {0, 0, 64, 64};  // Frame initial
sprite.isAnimated = true;
sprite.currentFrame = 0;
sprite.frameTimer = 0.f;

reg.add_component(explosionEntity, sprite);
```

### Mise à Jour de l'Animation

```cpp
auto& drawables = reg.get_components<component::Drawable>();
auto* sprite = drawables.get_ptr(explosionEntity);

if (sprite && sprite->isAnimated) {
    float frameDuration = 0.05f;  // 20 FPS
    sprite->frameTimer += deltaTime;
    
    if (sprite->frameTimer >= frameDuration) {
        sprite->currentFrame++;
        
        // Calculer la position de la frame dans le spritesheet
        int framesPerRow = 8;
        int frameWidth = 64;
        int frameHeight = 64;
        
        sprite->textureRect.x = (sprite->currentFrame % framesPerRow) * frameWidth;
        sprite->textureRect.y = (sprite->currentFrame / framesPerRow) * frameHeight;
        sprite->frameTimer = 0.f;
        
        // Détruire après dernière frame
        if (sprite->currentFrame >= 16) {  // 16 frames total
            reg.kill_entity(explosionEntity);
        }
    }
}
```

---

##  Boucle de Rendu Complète

```cpp
int main() {
    // ... Initialisation ...
    
    registry reg;
    graphics::IGraphicsBackend* backend = createBackend();
    
    auto cameraEntity = createCamera(reg);
    auto playerEntity = createPlayer(reg);
    auto scoreEntity = createScore(reg);
    
    using clock = std::chrono::high_resolution_clock;
    auto lastTime = clock::now();
    
    while (backend->isOpen()) {
        // Delta time
        auto currentTime = clock::now();
        std::chrono::duration<float> elapsed = currentTime - lastTime;
        float deltaTime = elapsed.count();
        lastTime = currentTime;
        
        if (deltaTime > 0.1f) deltaTime = 0.1f;
        
        // ========== LOGIQUE DE JEU ==========
        updateGameLogic(reg, deltaTime);
        
        // ========== RENDU ECS ==========
        // Le Render System s'exécute automatiquement via run_systems()
        reg.run_systems();
        
        // ========== AFFICHAGE ==========
        backend->clear(0, 0, 0);     // Fond noir
        
        // Rendu des entités
        renderAllEntities(reg, backend);
        
        backend->display();            // Swap buffers
    }
    
    backend->shutdown();
    return 0;
}
```

---

##  Référence API Backend

```cpp
class IGraphicsBackend {
    // Initialisation
    void init(unsigned int width, unsigned int height, const std::string& title);
    void shutdown();
    
    // Boucle
    bool isOpen() const;
    void pollEvents();
    void clear(unsigned char r, unsigned char g, unsigned char b);
    void display();
    
    // Ressources
    void* loadTexture(const std::string& path);
    void unloadTexture(void* texture);
    void* loadFont(const std::string& path, unsigned int fontSize);
    
    // Rendu
    void drawSprite(void* texture, float x, float y, float rotation,
                    float scaleX, float scaleY, const Color& tint,
                    const Rect* textureRect = nullptr);
    
    void drawText(void* font, const std::string& text, float x, float y,
                  const Color& color, float rotation = 0.f,
                  float scaleX = 1.f, float scaleY = 1.f);
    
    // Utilitaires
    float getTextWidth(void* font, const std::string& text);
    float getTextHeight(void* font, const std::string& text);
    void getMousePosition(int& x, int& y) const;
};
```

---

##  Exemples Avancés

### Barre de Vie Dynamique

```cpp
auto healthBar = reg.spawn_entity();
reg.add_component(healthBar, component::transform{10.f, 50.f, 0.f, 1.f, 1.f});

component::Drawable barSprite;
barSprite.texturePath = "Assets/UI/healthbar.png";
barSprite.layer = 150;
barSprite.hasTextureRect = true;
barSprite.visible = true;

// Mise à jour
int healthPercent = (currentHealth * 100) / maxHealth;
barSprite.textureRect = {0, 0, healthPercent, 20};
```

### Effet Clignotement

```cpp
float blinkInterval = 0.1f;
float blinkTimer = 0.f;

// Mise à jour
blink Timer += deltaTime;
if (blinkTimer >= blinkInterval) {
    sprite.visible = !sprite.visible;
    blinkTimer = 0.f;
}
```

### Dégradé de Couleur

```cpp
float lifetime = 2.0f;
float timeAlive = 0.f;

// Mise à jour
timeAlive += deltaTime;
float alpha = 255 * (1.0f - (timeAlive / lifetime));
sprite.tint = {255, 255, 255, (unsigned char)alpha};

if (timeAlive >= lifetime) {
    reg.kill_entity(entity);
}
```

---

## Bonnes Pratiques

1. **Une seule caméra active** : Désactiver les autres si vous en changez
2. **Layers cohérents** : Définir une hiérarchie claire et la respecter
3. **Cache des ressources** : Le système charge une fois et réutilise
4. **Visibilité** : Utiliser `visible = false` plutôt que `kill_entity()` temporairement
5. **Performances** : Minimiser les changements de texture (batch rendering)
6. **Textures** : Utiliser le moins de fichiers possibles (atlas/spritesheets)

---