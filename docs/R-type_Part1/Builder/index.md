# R-Type - Build Guide

##  Quick Start

### Opti**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install -y cmake g++ pip pipx libudev-dev libgl-dev \
    libx11-dev libx11-xcb-dev libfontenc-dev libice-dev libsm-dev libxau-dev libxaw7-dev \
    libxcomposite-dev libxcursor-dev libx**Solution - Installer tous les packages X11/Xorg requis :**
```bash
sudo apt install -y \
    libx11-dev libx11-xcb-dev libfontenc-dev libice-dev libsm-dev libxau-dev libxaw7-dev \
    libxcomposite-dev libxcursor-dev libxdamage-dev libxrandr-dev libxi-dev libxinerama-dev \
    libxkbfile-dev libxmu-dev libxmuu-dev libxpm-dev libxres-dev libxss-dev libxt-dev \
    libxtst-dev libxv-dev libxxf86vm-dev libxcb-glx0-dev libxcb-render0-dev \
    libxcb-render-util0-dev libxcb-xkb-dev libxcb-icccm4-dev libxcb-image0-dev \
    libxcb-keysyms1-dev libxcb-randr0-dev libxcb-shape0-dev libxcb-sync-dev \
    libxcb-xfixes0-dev libxcb-xinerama0-dev libxcb-dri3-dev uuid-dev libxcb-cursor-dev \
    libxcb-dri2-0-dev libxcb-present-dev libxcb-composite0-dev libxcb-ewmh-dev \
    libxcb-res0-dev libxcb-util-dev libxcb-util0-dev
```bxrandr-dev libxi-dev libxinerama-dev \
    libxkbfile-dev libxmu-dev libxmuu-dev libxpm-dev libxres-dev libxss-dev libxt-dev \
    libxtst-dev libxv-dev libxxf86vm-dev libxcb-glx0-dev libxcb-render0-dev \
    libxcb-render-util0-dev libxcb-xkb-dev libxcb-icccm4-dev libxcb-image0-dev \
    libxcb-keysyms1-dev libxcb-randr0-dev libxcb-shape0-dev libxcb-sync-dev \
    libxcb-xfixes0-dev libxcb-xinerama0-dev libxcb-dri3-dev uuid-dev libxcb-cursor-dev \
    libxcb-dri2-0-dev libxcb-present-dev libxcb-composite0-dev libxcb-ewmh-dev \
    libxcb-res0-dev libxcb-util-dev libxcb-util0-dev
pipx install conan
pipx ensurepath
```tomatique (recommandé)

```bash
./build.sh        # Compile le projet (installe cmake/conan si nécessaire)
./build.sh clean  # Nettoie les binaires
```

### Option 2 : Commandes manuelles

```bash
# 1. Installer les dépendances
conan install . --output-folder=build --build=missing

# 2. Configurer CMake
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release

# 3. Compiler
cmake --build build -j$(nproc)

# Binaires générés à la racine :
./r-type_server                 # Serveur
./r-type_client <ip> <port>     # Client
./rtype_game                    # Jeu standalone
./LibEngine/Systems/*.so        # Plugins systèmes
./LibEngine/Backends/*.so       # Plugins backends
```

---

##  Prérequis

### Outils requis

- **CMake** >= 3.16
- **Conan** >= 2.0
- **GCC/Clang** avec support C++17
- **Git**

### Installation (une seule fois)

**Fedora :**
```bash
sudo dnf install -y cmake gcc-c++ python3-pip git \
    systemd-devel mesa-libGL-devel libX11-devel libXrandr-devel libXi-devel
pip3 install conan
conan profile detect --force
```

**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install -y cmake g++ pip pipx libudev-dev libgl-dev 
    libx11-dev libx11-xcb-dev libfontenc-dev libice-dev libsm-dev libxau-dev libxaw7-dev 
    libxcomposite-dev libxcursor-dev libxdamage-dev libxrandr-dev libxi-dev libxinerama-dev 
    libxkbfile-dev libxmu-dev libxmuu-dev libxpm-dev libxres-dev libxss-dev libxt-dev 
    libxtst-dev libxv-dev libxxf86vm-dev libxcb-glx0-dev libxcb-render0-dev 
    libxcb-render-util0-dev libxcb-xkb-dev libxcb-icccm4-dev libxcb-image0-dev 
    libxcb-keysyms1-dev libxcb-randr0-dev libxcb-shape0-dev libxcb-sync-dev 
    libxcb-xfixes0-dev libxcb-xinerama0-dev libxcb-dri3-dev uuid-dev libxcb-cursor-dev 
    libxcb-dri2-0-dev libxcb-present-dev libxcb-composite0-dev libxcb-ewmh-dev 
    libxcb-res0-dev
pipx install conan
pipx ensurepath
```

**Ou utiliser le script automatique :**
```bash
./build.sh  # Installe tout automatiquement (recommandé)
```

---

## Commandes de build

### Compilation Release (optimisée)

```bash
conan install . --output-folder=build --build=missing
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

### Compilation Debug (avec symboles)

```bash
conan install . --output-folder=build --build=missing -s build_type=Debug
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Debug/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j$(nproc)
```

### Recompilation rapide (après modification de code)

```bash
cmake --build build -j$(nproc)
```

### Rebuild complet (fclean + recompile)

```bash
cmake --build build --target re
```

### Nettoyage complet (fclean)

**Méthode 1 - Commande directe :**
```bash
rm -rf build/ r-type_server r-type_client rtype_game LibEngine/**/*.so
```

**Méthode 2 - Cible CMake :**
```bash
cmake --build build --target fclean
```

**Ce qui est supprimé :**
- `build/` - Dossier de compilation
- `r-type_server`, `r-type_client`, `rtype_game` - Binaires
- `LibEngine/**/*.so` - Tous les plugins
- **Préserve** les dossiers sources et `CMakeLists.txt`

---

##  Compilation sélective

```bash
cmake --build build --target r-type_server    # Serveur seul
cmake --build build --target r-type_client    # Client seul
cmake --build build --target rtype_game       # Jeu standalone
cmake --build build --target plugins          # Tous les plugins
```

---

##  Structure du projet

### Fichiers CMake

```
CMakeLists.txt                  # Configuration principale
├── GameEngine/CMakeLists.txt   # Bibliothèque ECS (game_engine)
├── RType-Game/CMakeLists.txt   # Logique du jeu (rtype_game_lib)
├── Networking/CMakeLists.txt   # Serveur et client réseau
├── Client/CMakeLists.txt       # Jeu standalone
└── LibEngine/CMakeLists.txt    # Plugins (.so)
```

### Fichiers Conan

```
conanfile.txt                   # Dépendances du projet
CMakeUserPresets.json           # Généré par Conan (local, .gitignore)
build/build/Release/generators/ # Fichiers CMake générés par Conan
    ├── conan_toolchain.cmake
    ├── BoostConfig.cmake
    ├── SFMLConfig.cmake
    └── ...
```

### Binaires générés

```
r-type_server                   # Serveur de jeu (628 KB)
r-type_client                   # Client réseau (568 KB)
rtype_game                      # Jeu standalone (170 KB)
LibEngine/
├── Backends/
│   └── sfml_backend.so         # Backend graphique SFML (2.5 MB)
└── Systems/
    ├── render_system.so        # Système de rendu (179 KB)
    ├── input_system.so         # Système d'entrées (39 KB)
    ├── physics_system.so       # Système physique (27 KB)
    └── collision_system.so     # Système de collision (27 KB)
```

---

## 🔧 Dépendances (conanfile.txt)

### Bibliothèques utilisées

- **Boost 1.84.0** - Réseau (Asio), threads, système
- **SFML 2.6.1** - Graphique (fenêtre, sprites, textures)
- **LZ4 1.9.4** - Compression rapide des paquets
- **Zlib 1.3.1** - Compression standard

### Configuration

```ini
[requires]
boost/1.84.0
sfml/2.6.1
lz4/1.9.4
zlib/1.3.1

[generators]
CMakeDeps         # Génère *Config.cmake pour find_package()
CMakeToolchain    # Génère conan_toolchain.cmake

[options]
boost/*:shared=False        # Bibliothèques statiques
sfml/*:shared=False
sfml/*:graphics=True        # Active le module graphique
sfml/*:window=True          # Active le module fenêtre
sfml/*:audio=True           # Active le module audio
sfml/*:network=False        # Désactive (on utilise Boost.Asio)

[layout]
cmake_layout                # Organisation standard CMake
```

---

## Dépannage

### "conan: command not found"

```bash
pip install conan
conan profile detect --force
```

### "externally-managed-environment" (Ubuntu 23.04+)

**Erreur complète :**
```
error: externally-managed-environment
This environment is externally managed
```

**Solution 1 - Utiliser pipx (recommandé) :**
```bash
sudo apt install pipx
pipx install conan
pipx ensurepath
# Fermer et rouvrir le terminal
conan profile detect --force
```

**Solution 2 - Forcer pip (non recommandé) :**
```bash
pip3 install conan --break-system-packages
conan profile detect --force
```

**Solution 3 - Utiliser le script (automatique) :**
```bash
./build.sh  # Gère automatiquement pipx ou pip
```

### "libudev-dev are missing" (Ubuntu/Debian)

**Erreur complète :**
```
System requirements: 'libudev-dev' are missing but can't install because tools.system.package_manager:mode is 'check'.
```

**Solution :**
```bash
sudo apt install -y libudev-dev libgl-dev libx11-dev libxrandr-dev libxi-dev
```

### "libx11-xcb-dev, libfontenc-dev... are missing" (Ubuntu/Debian)

**Erreur complète :**
```
ERROR: xorg/system: System requirements: 'libx11-xcb-dev, libfontenc-dev, libice-dev...' are missing
```

**Solution - Installer tous les packages X11/Xorg requis :**
```bash
sudo apt install -y 
    libx11-dev libx11-xcb-dev libfontenc-dev libice-dev libsm-dev libxau-dev libxaw7-dev 
    libxcomposite-dev libxcursor-dev libxdamage-dev libxrandr-dev libxi-dev libxinerama-dev 
    libxkbfile-dev libxmu-dev libxmuu-dev libxpm-dev libxres-dev libxss-dev libxt-dev 
    libxtst-dev libxv-dev libxxf86vm-dev libxcb-glx0-dev libxcb-render0-dev 
    libxcb-render-util0-dev libxcb-xkb-dev libxcb-icccm4-dev libxcb-image0-dev 
    libxcb-keysyms1-dev libxcb-randr0-dev libxcb-shape0-dev libxcb-sync-dev 
    libxcb-xfixes0-dev libxcb-xinerama0-dev libxcb-dri3-dev uuid-dev libxcb-cursor-dev 
    libxcb-dri2-0-dev libxcb-present-dev libxcb-composite0-dev libxcb-ewmh-dev 
    libxcb-res0-dev
```

**Ou utiliser le script (automatique) :**
```bash
./build.sh  # Installe automatiquement tous les packages requis
```

### GPG errors pendant apt update

### "GPG error" ou "repository not signed" (Ubuntu/Debian)

**Erreur :**
```
GPG error: The following signatures couldn't be verified
The repository is not signed
```

**Solution 1 - Ignorer temporairement (pour build.sh) :**
```bash
sudo apt update --allow-releaseinfo-change
# ou
sudo apt update -o Acquire::AllowInsecureRepositories=true
```

**Solution 2 - Désactiver le dépôt problématique :**
```bash
# Lister les dépôts
ls /etc/apt/sources.list.d/

# Désactiver le dépôt VirtualBox (exemple)
sudo mv /etc/apt/sources.list.d/virtualbox.list /etc/apt/sources.list.d/virtualbox.list.disabled

# Puis réessayer
sudo apt update
./build.sh
```

### "No CMAKE_BUILD_TYPE specified"

Toujours spécifier `-DCMAKE_BUILD_TYPE=Release` ou `Debug` :

```bash
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release  # ← OBLIGATOIRE
```

### Erreur de compilation

```bash
# Nettoyer et recompiler
cmake --build build --target fclean
conan install . --output-folder=build --build=missing
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

### Voir les logs détaillés

```bash
cmake --build build --verbose
```

---

## Concepts clés

### Script build.sh vs Commandes manuelles

**build.sh** : Script minimal pour simplifier le build
- Installe automatiquement cmake et conan si manquants
- Une seule commande : `./build.sh`
- Nettoyage simple : `./build.sh clean`
- Idéal pour débuter ou déployer rapidement
- Moins de contrôle (toujours en Release)

**Commandes CMake** : Contrôle total
- Choix du build type (Release/Debug)
- Compilation sélective (targets spécifiques)
- Plus de flexibilité
- Plus de commandes à mémoriser

**Recommandation** : Utilise `build.sh` pour débuter, passe à CMake quand tu veux plus de contrôle.

### Pourquoi Conan ?

- Gestion automatique des dépendances (Boost, SFML, etc.)
- Multi-plateforme (Linux, Windows, macOS)
- Pas besoin d'installer manuellement les bibliothèques
- Versions spécifiques garanties

### Pourquoi CMake ?

- Standard de l'industrie C++
- Multi-plateforme
- Génération automatique de Makefiles
- Intégration avec les IDEs (VS Code, CLion, etc.)

### Build statique vs dynamique

Ce projet utilise des **bibliothèques statiques** (`shared=False`) :
- Binaires autonomes (pas de `.so` système requis)
- Déploiement simplifié
- Pas de problèmes de versions
- Binaires plus gros

### Binaires à la racine

Les binaires sont générés **directement à la racine** du projet (pas dans `build/bin/`) :
- Plus simple pour le développement
- Exécution directe : `./r-type_server`
- Configuration dans `CMakeLists.txt` :
  ```cmake
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})
  ```

---

## Workflow de développement

### Avec le script build.sh (simple)

```bash
# Premier build
./build.sh

# Après modification du code
./build.sh

# Nettoyer
./build.sh clean
```

### Avec CMake (avancé)

#### Premier build

```bash
conan install . --output-folder=build --build=missing
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

#### Après modification du code

```bash
cmake --build build -j$(nproc)
```

#### Après modification du CMakeLists.txt

```bash
cmake -S . -B build \
    -DCMAKE_TOOLCHAIN_FILE=build/build/Release/generators/conan_toolchain.cmake \
    -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

#### Avant un commit propre

```bash
cmake --build build --target fclean
# Les binaires et build/ sont dans .gitignore
```

---

## Pour aller plus loin

- [CMake Documentation](https://cmake.org/documentation/)
- [Conan Documentation](https://docs.conan.io/)
- [Boost.Asio](https://www.boost.org/doc/libs/release/doc/html/boost_asio.html)
- [SFML Tutorials](https://www.sfml-dev.org/tutorials/)