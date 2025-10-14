# Résumé des commandes

## Linux (Fedora)

```bash
# Installation
sudo dnf install -y cmake gcc g++ python3-pip
pip3 install conan && conan profile detect --force

# Build
mkdir build && cd build
conan install .. --output-folder=. --build=missing
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel
./bin/r-type_client
```

---

## Linux (Ubuntu)

```bash
# Installation
sudo apt install -y cmake gcc g++ python3-pip
pip3 install conan && conan profile detect --force

# Build
mkdir build && cd build
conan install .. --output-folder=. --build=missing
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel
./bin/r-type_client
```

---

## Windows (Visual Studio)

```cmd
REM Installation
pip install conan
conan profile detect --force

REM Build
mkdir build && cd build
conan install .. --output-folder=. --build=missing
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build . --config Release
.\bin\Release\r-type_client.exe
```

---

## Windows (MinGW)

```cmd
REM Installation
pip install conan
conan profile detect --force

REM Build
mkdir build && cd build
conan install .. --output-folder=. --build=missing -s compiler=gcc
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -G "MinGW Makefiles"
cmake --build . --parallel
.\bin\r-type_client.exe
```