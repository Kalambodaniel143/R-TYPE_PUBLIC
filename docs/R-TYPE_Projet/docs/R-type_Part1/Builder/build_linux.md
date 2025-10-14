# Compilation sur Linux

## Option 1 : Fedora / Red Hat / CentOS

### 1. Installer les dépendances système

```bash
# Outils de développement
sudo dnf install -y cmake gcc g++ python3-pip

# Dépendances X11/OpenGL pour SFML
sudo dnf install -y libfontenc-devel libXaw-devel libXcomposite-devel \
    libXdmcp-devel libXtst-devel libxkbfile-devel libXres-devel \
    libXScrnSaver-devel xcb-util-wm-devel xcb-util-keysyms-devel \
    xcb-util-renderutil-devel libXdamage-devel libXv-devel \
    xcb-util-devel libuuid-devel xcb-util-cursor-devel

# Installer Conan
pip3 install conan
conan profile detect --force
```

### 2. Compiler le projet

```bash
# Cloner le projet
git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git
cd G-CPP-500-COT-5-1-rtype-2

# Créer le dossier de build
mkdir build && cd build

# Installer les dépendances C++ avec Conan
conan install .. --output-folder=. --build=missing

# Configurer CMake
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release

# Compiler
cmake --build . --parallel

# Exécuter
./bin/r-type_client
```

---

## Option 2 : Ubuntu / Debian

### 1. Installer les dépendances système

```bash
# Outils de développement
sudo apt update
sudo apt install -y cmake gcc g++ python3-pip

# Dépendances X11/OpenGL pour SFML
sudo apt install -y libx11-dev libxrandr-dev libxcursor-dev \
    libxi-dev libudev-dev libgl1-mesa-dev libopenal-dev \
    libflac-dev libvorbis-dev

# Installer Conan
pip3 install conan
conan profile detect --force
```

### 2. Compiler le projet

```bash
# Cloner le projet
git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git
cd G-CPP-500-COT-5-1-rtype-2

# Créer le dossier de build
mkdir build && cd build

# Installer les dépendances C++ avec Conan
conan install .. --output-folder=. --build=missing

# Configurer CMake
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release

# Compiler
cmake --build . --parallel

# Exécuter
./bin/r-type_client
```