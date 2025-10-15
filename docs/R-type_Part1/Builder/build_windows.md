#  Compilation sur Windows

## Option 1 : Visual Studio 2019/2022

### 1. Prérequis

Installez dans l'ordre :
1. **Visual Studio 2019 ou 2022** avec "Développement Desktop C++"
2. **CMake** : https://cmake.org/download/ (cocher "Add to PATH")
3. **Python 3** : https://www.python.org/downloads/ (cocher "Add to PATH")
4. **Git** : https://git-scm.com/downloads

### 2. Installer Conan

Ouvrez **PowerShell** ou **CMD** :

```cmd
pip install conan
conan profile detect --force
```

### 3. Compiler le projet

Ouvrez **PowerShell** ou **CMD** :

```cmd
# Cloner le projet
git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git
cd G-CPP-500-COT-5-1-rtype-2

# Créer le dossier de build
mkdir build
cd build

# Installer les dépendances C++
conan install .. --output-folder=. --build=missing

# Configurer CMake
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake

# Compiler (mode Release)
cmake --build . --config Release

# Exécuter
.\bin\Release\r-type_client.exe
```

---

## Option 2 : MinGW (GCC sur Windows)

### 1. Prérequis

Installez dans l'ordre :
1. **MinGW-w64** : https://www.mingw-w64.org/downloads/
2. **CMake** : https://cmake.org/download/
3. **Python 3** : https://www.python.org/downloads/
4. **Git** : https://git-scm.com/downloads

**Important** : Ajoutez MinGW au PATH (ex: `C:\mingw64\bin`)

### 2. Installer Conan

```cmd
pip install conan
conan profile detect --force
```

### 3. Compiler le projet

```cmd
# Cloner le projet
git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git
cd G-CPP-500-COT-5-1-rtype-2

# Créer le dossier de build
mkdir build
cd build

# Installer les dépendances C++
conan install .. --output-folder=. --build=missing -s compiler=gcc

# Configurer CMake avec MinGW
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -G "MinGW Makefiles"

# Compiler
cmake --build . --parallel

# Exécuter
.\bin\r-type_client.exe
```