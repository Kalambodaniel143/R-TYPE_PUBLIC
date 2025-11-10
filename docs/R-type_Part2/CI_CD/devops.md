# 🐳 R-Type Docker Deployment Guide

Ce guide explique comment utiliser les images Docker du projet R-Type.

## Images disponibles

Les images Docker sont automatiquement construites et publiées sur GitHub Container Registry :

- **Serveur**: `ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest`
- **Client**: `ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest`

## Démarrage rapide

### Serveur seulement

```bash
# Pull l'image
docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest

# Lancer le serveur
docker run -d \
  --name rtype-server \
  -p 4242:4242 \
  -p 8080:8080 \
  -e RTYPE_PORT=4242 \
  -e RTYPE_MAX_PLAYERS=4 \
  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest

# Voir les logs
docker logs -f rtype-server

# Arrêter le serveur
docker stop rtype-server
docker rm rtype-server
```

### Avec Docker Compose

```bash
# Lancer serveur et client
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tout
docker-compose down
```

## Client avec GUI (X11 Forwarding)

Le client nécessite un display X11 pour l'interface graphique.

### Sur Linux

```bash
# Autoriser Docker à accéder au display
xhost +local:docker

# Lancer le client
docker run -it --rm \
  --name rtype-client \
  -e DISPLAY=$DISPLAY \
  -e RTYPE_SERVER_HOST=<SERVER_IP> \
  -e RTYPE_SERVER_PORT=4242 \
  -v /tmp/.X11-unix:/tmp/.X11-unix:rw \
  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest

# Nettoyer après
xhost -local:docker
```

### Sur macOS (avec XQuartz)

```bash
# Installer XQuartz
brew install --cask xquartz

# Démarrer XQuartz et autoriser les connexions réseau
# Dans XQuartz Preferences > Security: cocher "Allow connections from network clients"

# Obtenir l'IP de votre machine
export DISPLAY_IP=$(ipconfig getifaddr en0)

# Autoriser les connexions
xhost + $DISPLAY_IP

# Lancer le client
docker run -it --rm \
  --name rtype-client \
  -e DISPLAY=$DISPLAY_IP:0 \
  -e RTYPE_SERVER_HOST=<SERVER_IP> \
  -e RTYPE_SERVER_PORT=4242 \
  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest
```

### Sur Windows (avec VcXsrv)

```powershell
# Installer VcXsrv: https://sourceforge.net/projects/vcxsrv/
# Lancer XLaunch avec les options:
# - Multiple windows
# - Display number: 0
# - Disable access control: YES

# Dans PowerShell
$env:DISPLAY = "host.docker.internal:0"

docker run -it --rm `
  --name rtype-client `
  -e DISPLAY=$env:DISPLAY `
  -e RTYPE_SERVER_HOST=<SERVER_IP> `
  -e RTYPE_SERVER_PORT=4242 `
  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest
```

## Variables d'environnement

### Serveur

| Variable | Description | Défaut |
|----------|-------------|--------|
| `RTYPE_PORT` | Port d'écoute du serveur | `4242` |
| `RTYPE_MAX_PLAYERS` | Nombre maximum de joueurs | `4` |
| `RTYPE_LOG_LEVEL` | Niveau de log (debug/info/warn/error) | `info` |

### Client

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DISPLAY` | Display X11 | `:0` |
| `RTYPE_SERVER_HOST` | Adresse du serveur | `localhost` |
| `RTYPE_SERVER_PORT` | Port du serveur | `4242` |

## Healthcheck

Le serveur inclut un healthcheck automatique :

```bash
# Vérifier l'état du serveur
docker inspect --format='{{.State.Health.Status}}' rtype-server

# Voir les logs du healthcheck
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' rtype-server
```

## Monitoring

```bash
# Stats en temps réel
docker stats rtype-server

# Logs avec timestamps
docker logs -f --timestamps rtype-server

# Dernières 100 lignes
docker logs --tail 100 rtype-server
```

## Build local

Si vous voulez construire les images localement :

```bash
# Depuis la racine du projet
# 1. Compiler le projet
./build.sh

# 2. Build les images Docker
docker build -f docker/Dockerfile.server -t rtype-server:local .
docker build -f docker/Dockerfile.client -t rtype-client:local .

# 3. Lancer
docker run -d -p 4242:4242 rtype-server:local
```

## 🔐 Authentification GitHub Container Registry

Pour pull les images privées :

```bash
# Créer un Personal Access Token sur GitHub avec le scope 'read:packages'
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Puis pull
docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest
```

## 📝 Notes

- Les images sont multi-architecture (amd64)
- Le serveur peut tourner en headless (sans GUI)
- Le client nécessite un display X11 pour fonctionner
- Les volumes persistent les données entre les redémarrages
- Les healthchecks s'assurent que le serveur est opérationnel

## 🔗 Liens utiles

- [GitHub Repository](https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2)
- [GitHub Packages](https://github.com/orgs/EpitechPGE3-2025/packages)
- [Docker Documentation](https://docs.docker.com/)
