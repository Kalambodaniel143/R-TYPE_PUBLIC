import{_ as s,c as n,o as a,a as e}from"./app.c58da356.js";const h=JSON.parse(`{"title":"\u{1F433} R-Type Docker Deployment Guide","description":"","frontmatter":{},"headers":[{"level":2,"title":"Images disponibles","slug":"images-disponibles","link":"#images-disponibles","children":[]},{"level":2,"title":"D\xE9marrage rapide","slug":"demarrage-rapide","link":"#demarrage-rapide","children":[{"level":3,"title":"Serveur seulement","slug":"serveur-seulement","link":"#serveur-seulement","children":[]},{"level":3,"title":"Avec Docker Compose","slug":"avec-docker-compose","link":"#avec-docker-compose","children":[]}]},{"level":2,"title":"Client avec GUI (X11 Forwarding)","slug":"client-avec-gui-x11-forwarding","link":"#client-avec-gui-x11-forwarding","children":[{"level":3,"title":"Sur Linux","slug":"sur-linux","link":"#sur-linux","children":[]},{"level":3,"title":"Sur macOS (avec XQuartz)","slug":"sur-macos-avec-xquartz","link":"#sur-macos-avec-xquartz","children":[]},{"level":3,"title":"Sur Windows (avec VcXsrv)","slug":"sur-windows-avec-vcxsrv","link":"#sur-windows-avec-vcxsrv","children":[]}]},{"level":2,"title":"Variables d'environnement","slug":"variables-d-environnement","link":"#variables-d-environnement","children":[{"level":3,"title":"Serveur","slug":"serveur","link":"#serveur","children":[]},{"level":3,"title":"Client","slug":"client","link":"#client","children":[]}]},{"level":2,"title":"Healthcheck","slug":"healthcheck","link":"#healthcheck","children":[]},{"level":2,"title":"Monitoring","slug":"monitoring","link":"#monitoring","children":[]},{"level":2,"title":"Build local","slug":"build-local","link":"#build-local","children":[]},{"level":2,"title":"\u{1F510} Authentification GitHub Container Registry","slug":"\u{1F510}-authentification-github-container-registry","link":"#\u{1F510}-authentification-github-container-registry","children":[]},{"level":2,"title":"\u{1F4DD} Notes","slug":"\u{1F4DD}-notes","link":"#\u{1F4DD}-notes","children":[]},{"level":2,"title":"\u{1F517} Liens utiles","slug":"\u{1F517}-liens-utiles","link":"#\u{1F517}-liens-utiles","children":[]}],"relativePath":"R-type_Part2/CI_CD/devops.md"}`),l={name:"R-type_Part2/CI_CD/devops.md"},p=e(`<h1 id="\u{1F433}-r-type-docker-deployment-guide" tabindex="-1">\u{1F433} R-Type Docker Deployment Guide <a class="header-anchor" href="#\u{1F433}-r-type-docker-deployment-guide" aria-hidden="true">#</a></h1><p>Ce guide explique comment utiliser les images Docker du projet R-Type.</p><h2 id="images-disponibles" tabindex="-1">Images disponibles <a class="header-anchor" href="#images-disponibles" aria-hidden="true">#</a></h2><p>Les images Docker sont automatiquement construites et publi\xE9es sur GitHub Container Registry :</p><ul><li><strong>Serveur</strong>: <code>ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</code></li><li><strong>Client</strong>: <code>ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest</code></li></ul><h2 id="demarrage-rapide" tabindex="-1">D\xE9marrage rapide <a class="header-anchor" href="#demarrage-rapide" aria-hidden="true">#</a></h2><h3 id="serveur-seulement" tabindex="-1">Serveur seulement <a class="header-anchor" href="#serveur-seulement" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Pull l&#39;image</span></span>
<span class="line"><span style="color:#C9D1D9;">docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Lancer le serveur</span></span>
<span class="line"><span style="color:#C9D1D9;">docker run -d \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  --name rtype-server \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -p 4242:4242 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -p 8080:8080 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_PORT=4242 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_MAX_PLAYERS=4 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Voir les logs</span></span>
<span class="line"><span style="color:#C9D1D9;">docker logs -f rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Arr\xEAter le serveur</span></span>
<span class="line"><span style="color:#C9D1D9;">docker stop rtype-server</span></span>
<span class="line"><span style="color:#C9D1D9;">docker rm rtype-server</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Pull l&#39;image</span></span>
<span class="line"><span style="color:#24292F;">docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Lancer le serveur</span></span>
<span class="line"><span style="color:#24292F;">docker run -d \\</span></span>
<span class="line"><span style="color:#24292F;">  --name rtype-server \\</span></span>
<span class="line"><span style="color:#24292F;">  -p 4242:4242 \\</span></span>
<span class="line"><span style="color:#24292F;">  -p 8080:8080 \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_PORT=4242 \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_MAX_PLAYERS=4 \\</span></span>
<span class="line"><span style="color:#24292F;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Voir les logs</span></span>
<span class="line"><span style="color:#24292F;">docker logs -f rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Arr\xEAter le serveur</span></span>
<span class="line"><span style="color:#24292F;">docker stop rtype-server</span></span>
<span class="line"><span style="color:#24292F;">docker rm rtype-server</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h3 id="avec-docker-compose" tabindex="-1">Avec Docker Compose <a class="header-anchor" href="#avec-docker-compose" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Lancer serveur et client</span></span>
<span class="line"><span style="color:#C9D1D9;">docker-compose up -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Voir les logs</span></span>
<span class="line"><span style="color:#C9D1D9;">docker-compose logs -f</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Arr\xEAter tout</span></span>
<span class="line"><span style="color:#C9D1D9;">docker-compose down</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Lancer serveur et client</span></span>
<span class="line"><span style="color:#24292F;">docker-compose up -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Voir les logs</span></span>
<span class="line"><span style="color:#24292F;">docker-compose logs -f</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Arr\xEAter tout</span></span>
<span class="line"><span style="color:#24292F;">docker-compose down</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="client-avec-gui-x11-forwarding" tabindex="-1">Client avec GUI (X11 Forwarding) <a class="header-anchor" href="#client-avec-gui-x11-forwarding" aria-hidden="true">#</a></h2><p>Le client n\xE9cessite un display X11 pour l&#39;interface graphique.</p><h3 id="sur-linux" tabindex="-1">Sur Linux <a class="header-anchor" href="#sur-linux" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Autoriser Docker \xE0 acc\xE9der au display</span></span>
<span class="line"><span style="color:#C9D1D9;">xhost +local:docker</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Lancer le client</span></span>
<span class="line"><span style="color:#C9D1D9;">docker run -it --rm \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  --name rtype-client \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e DISPLAY=$DISPLAY \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_SERVER_HOST=</span><span style="color:#FF7B72;">&lt;</span><span style="color:#C9D1D9;">SERVER_IP</span><span style="color:#FF7B72;">&gt;</span><span style="color:#C9D1D9;"> \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_SERVER_PORT=4242 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -v /tmp/.X11-unix:/tmp/.X11-unix:rw \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Nettoyer apr\xE8s</span></span>
<span class="line"><span style="color:#C9D1D9;">xhost -local:docker</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Autoriser Docker \xE0 acc\xE9der au display</span></span>
<span class="line"><span style="color:#24292F;">xhost +local:docker</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Lancer le client</span></span>
<span class="line"><span style="color:#24292F;">docker run -it --rm \\</span></span>
<span class="line"><span style="color:#24292F;">  --name rtype-client \\</span></span>
<span class="line"><span style="color:#24292F;">  -e DISPLAY=$DISPLAY \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_SERVER_HOST=</span><span style="color:#CF222E;">&lt;</span><span style="color:#24292F;">SERVER_IP</span><span style="color:#CF222E;">&gt;</span><span style="color:#24292F;"> \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_SERVER_PORT=4242 \\</span></span>
<span class="line"><span style="color:#24292F;">  -v /tmp/.X11-unix:/tmp/.X11-unix:rw \\</span></span>
<span class="line"><span style="color:#24292F;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Nettoyer apr\xE8s</span></span>
<span class="line"><span style="color:#24292F;">xhost -local:docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="sur-macos-avec-xquartz" tabindex="-1">Sur macOS (avec XQuartz) <a class="header-anchor" href="#sur-macos-avec-xquartz" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Installer XQuartz</span></span>
<span class="line"><span style="color:#C9D1D9;">brew install --cask xquartz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># D\xE9marrer XQuartz et autoriser les connexions r\xE9seau</span></span>
<span class="line"><span style="color:#8B949E;"># Dans XQuartz Preferences &gt; Security: cocher &quot;Allow connections from network clients&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Obtenir l&#39;IP de votre machine</span></span>
<span class="line"><span style="color:#FF7B72;">export</span><span style="color:#C9D1D9;"> DISPLAY_IP=</span><span style="color:#A5D6FF;">$(ipconfig getifaddr en0)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Autoriser les connexions</span></span>
<span class="line"><span style="color:#C9D1D9;">xhost + $DISPLAY_IP</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Lancer le client</span></span>
<span class="line"><span style="color:#C9D1D9;">docker run -it --rm \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  --name rtype-client \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e DISPLAY=$DISPLAY_IP:0 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_SERVER_HOST=</span><span style="color:#FF7B72;">&lt;</span><span style="color:#C9D1D9;">SERVER_IP</span><span style="color:#FF7B72;">&gt;</span><span style="color:#C9D1D9;"> \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  -e RTYPE_SERVER_PORT=4242 \\</span></span>
<span class="line"><span style="color:#C9D1D9;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Installer XQuartz</span></span>
<span class="line"><span style="color:#24292F;">brew install --cask xquartz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># D\xE9marrer XQuartz et autoriser les connexions r\xE9seau</span></span>
<span class="line"><span style="color:#6E7781;"># Dans XQuartz Preferences &gt; Security: cocher &quot;Allow connections from network clients&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Obtenir l&#39;IP de votre machine</span></span>
<span class="line"><span style="color:#CF222E;">export</span><span style="color:#24292F;"> DISPLAY_IP=</span><span style="color:#0A3069;">$(ipconfig getifaddr en0)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Autoriser les connexions</span></span>
<span class="line"><span style="color:#24292F;">xhost + $DISPLAY_IP</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Lancer le client</span></span>
<span class="line"><span style="color:#24292F;">docker run -it --rm \\</span></span>
<span class="line"><span style="color:#24292F;">  --name rtype-client \\</span></span>
<span class="line"><span style="color:#24292F;">  -e DISPLAY=$DISPLAY_IP:0 \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_SERVER_HOST=</span><span style="color:#CF222E;">&lt;</span><span style="color:#24292F;">SERVER_IP</span><span style="color:#CF222E;">&gt;</span><span style="color:#24292F;"> \\</span></span>
<span class="line"><span style="color:#24292F;">  -e RTYPE_SERVER_PORT=4242 \\</span></span>
<span class="line"><span style="color:#24292F;">  ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-client:latest</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h3 id="sur-windows-avec-vcxsrv" tabindex="-1">Sur Windows (avec VcXsrv) <a class="header-anchor" href="#sur-windows-avec-vcxsrv" aria-hidden="true">#</a></h3><div class="language-powershell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">powershell</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Installer VcXsrv: https://sourceforge.net/projects/vcxsrv/</span></span>
<span class="line"><span style="color:#8B949E;"># Lancer XLaunch avec les options:</span></span>
<span class="line"><span style="color:#8B949E;"># - Multiple windows</span></span>
<span class="line"><span style="color:#8B949E;"># - Display number: 0</span></span>
<span class="line"><span style="color:#8B949E;"># - Disable access control: YES</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Dans PowerShell</span></span>
<span class="line"><span style="color:#C9D1D9;">$</span><span style="color:#79C0FF;">env:</span><span style="color:#C9D1D9;">DISPLAY </span><span style="color:#FF7B72;">=</span><span style="color:#C9D1D9;"> </span><span style="color:#A5D6FF;">&quot;host.docker.internal:0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C9D1D9;">docker run </span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">it </span><span style="color:#FF7B72;">--</span><span style="color:#C9D1D9;">rm </span><span style="color:#FF7B72;">\`</span></span>
<span class="line"><span style="color:#C9D1D9;">  </span><span style="color:#FF7B72;">--</span><span style="color:#C9D1D9;">name rtype</span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">client </span><span style="color:#FF7B72;">\`</span></span>
<span class="line"><span style="color:#C9D1D9;">  </span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">e DISPLAY</span><span style="color:#FF7B72;">=</span><span style="color:#C9D1D9;">$</span><span style="color:#79C0FF;">env:</span><span style="color:#C9D1D9;">DISPLAY </span><span style="color:#FF7B72;">\`</span></span>
<span class="line"><span style="color:#C9D1D9;">  </span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">e RTYPE_SERVER_HOST</span><span style="color:#FF7B72;">=&lt;</span><span style="color:#C9D1D9;">SERVER_IP</span><span style="color:#FF7B72;">&gt;</span><span style="color:#C9D1D9;"> </span><span style="color:#FF7B72;">\`</span></span>
<span class="line"><span style="color:#C9D1D9;">  </span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">e RTYPE_SERVER_PORT</span><span style="color:#FF7B72;">=</span><span style="color:#79C0FF;">4242</span><span style="color:#C9D1D9;"> </span><span style="color:#FF7B72;">\`</span></span>
<span class="line"><span style="color:#C9D1D9;">  ghcr.io</span><span style="color:#FF7B72;">/</span><span style="color:#C9D1D9;">epitechpge3</span><span style="color:#FF7B72;">-</span><span style="color:#79C0FF;">2025</span><span style="color:#FF7B72;">/</span><span style="color:#C9D1D9;">g</span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">cpp</span><span style="color:#FF7B72;">-</span><span style="color:#79C0FF;">500</span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">cot</span><span style="color:#FF7B72;">-</span><span style="color:#79C0FF;">5</span><span style="color:#FF7B72;">-</span><span style="color:#79C0FF;">1</span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">rtype</span><span style="color:#FF7B72;">-</span><span style="color:#79C0FF;">2</span><span style="color:#FF7B72;">/</span><span style="color:#C9D1D9;">rtype</span><span style="color:#FF7B72;">-</span><span style="color:#C9D1D9;">client:latest</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Installer VcXsrv: https://sourceforge.net/projects/vcxsrv/</span></span>
<span class="line"><span style="color:#6E7781;"># Lancer XLaunch avec les options:</span></span>
<span class="line"><span style="color:#6E7781;"># - Multiple windows</span></span>
<span class="line"><span style="color:#6E7781;"># - Display number: 0</span></span>
<span class="line"><span style="color:#6E7781;"># - Disable access control: YES</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Dans PowerShell</span></span>
<span class="line"><span style="color:#24292F;">$</span><span style="color:#0550AE;">env:</span><span style="color:#24292F;">DISPLAY </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&quot;host.docker.internal:0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">docker run </span><span style="color:#CF222E;">-</span><span style="color:#24292F;">it </span><span style="color:#CF222E;">--</span><span style="color:#24292F;">rm </span><span style="color:#CF222E;">\`</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">--</span><span style="color:#24292F;">name rtype</span><span style="color:#CF222E;">-</span><span style="color:#24292F;">client </span><span style="color:#CF222E;">\`</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">-</span><span style="color:#24292F;">e DISPLAY</span><span style="color:#CF222E;">=</span><span style="color:#24292F;">$</span><span style="color:#0550AE;">env:</span><span style="color:#24292F;">DISPLAY </span><span style="color:#CF222E;">\`</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">-</span><span style="color:#24292F;">e RTYPE_SERVER_HOST</span><span style="color:#CF222E;">=&lt;</span><span style="color:#24292F;">SERVER_IP</span><span style="color:#CF222E;">&gt;</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">\`</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">-</span><span style="color:#24292F;">e RTYPE_SERVER_PORT</span><span style="color:#CF222E;">=</span><span style="color:#0550AE;">4242</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">\`</span></span>
<span class="line"><span style="color:#24292F;">  ghcr.io</span><span style="color:#CF222E;">/</span><span style="color:#24292F;">epitechpge3</span><span style="color:#CF222E;">-</span><span style="color:#0550AE;">2025</span><span style="color:#CF222E;">/</span><span style="color:#24292F;">g</span><span style="color:#CF222E;">-</span><span style="color:#24292F;">cpp</span><span style="color:#CF222E;">-</span><span style="color:#0550AE;">500</span><span style="color:#CF222E;">-</span><span style="color:#24292F;">cot</span><span style="color:#CF222E;">-</span><span style="color:#0550AE;">5</span><span style="color:#CF222E;">-</span><span style="color:#0550AE;">1</span><span style="color:#CF222E;">-</span><span style="color:#24292F;">rtype</span><span style="color:#CF222E;">-</span><span style="color:#0550AE;">2</span><span style="color:#CF222E;">/</span><span style="color:#24292F;">rtype</span><span style="color:#CF222E;">-</span><span style="color:#24292F;">client:latest</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="variables-d-environnement" tabindex="-1">Variables d&#39;environnement <a class="header-anchor" href="#variables-d-environnement" aria-hidden="true">#</a></h2><h3 id="serveur" tabindex="-1">Serveur <a class="header-anchor" href="#serveur" aria-hidden="true">#</a></h3><table><thead><tr><th>Variable</th><th>Description</th><th>D\xE9faut</th></tr></thead><tbody><tr><td><code>RTYPE_PORT</code></td><td>Port d&#39;\xE9coute du serveur</td><td><code>4242</code></td></tr><tr><td><code>RTYPE_MAX_PLAYERS</code></td><td>Nombre maximum de joueurs</td><td><code>4</code></td></tr><tr><td><code>RTYPE_LOG_LEVEL</code></td><td>Niveau de log (debug/info/warn/error)</td><td><code>info</code></td></tr></tbody></table><h3 id="client" tabindex="-1">Client <a class="header-anchor" href="#client" aria-hidden="true">#</a></h3><table><thead><tr><th>Variable</th><th>Description</th><th>D\xE9faut</th></tr></thead><tbody><tr><td><code>DISPLAY</code></td><td>Display X11</td><td><code>:0</code></td></tr><tr><td><code>RTYPE_SERVER_HOST</code></td><td>Adresse du serveur</td><td><code>localhost</code></td></tr><tr><td><code>RTYPE_SERVER_PORT</code></td><td>Port du serveur</td><td><code>4242</code></td></tr></tbody></table><h2 id="healthcheck" tabindex="-1">Healthcheck <a class="header-anchor" href="#healthcheck" aria-hidden="true">#</a></h2><p>Le serveur inclut un healthcheck automatique :</p><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># V\xE9rifier l&#39;\xE9tat du serveur</span></span>
<span class="line"><span style="color:#C9D1D9;">docker inspect --format=</span><span style="color:#A5D6FF;">&#39;{{.State.Health.Status}}&#39;</span><span style="color:#C9D1D9;"> rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Voir les logs du healthcheck</span></span>
<span class="line"><span style="color:#C9D1D9;">docker inspect --format=</span><span style="color:#A5D6FF;">&#39;{{range .State.Health.Log}}{{.Output}}{{end}}&#39;</span><span style="color:#C9D1D9;"> rtype-server</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># V\xE9rifier l&#39;\xE9tat du serveur</span></span>
<span class="line"><span style="color:#24292F;">docker inspect --format=</span><span style="color:#0A3069;">&#39;{{.State.Health.Status}}&#39;</span><span style="color:#24292F;"> rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Voir les logs du healthcheck</span></span>
<span class="line"><span style="color:#24292F;">docker inspect --format=</span><span style="color:#0A3069;">&#39;{{range .State.Health.Log}}{{.Output}}{{end}}&#39;</span><span style="color:#24292F;"> rtype-server</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="monitoring" tabindex="-1">Monitoring <a class="header-anchor" href="#monitoring" aria-hidden="true">#</a></h2><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Stats en temps r\xE9el</span></span>
<span class="line"><span style="color:#C9D1D9;">docker stats rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Logs avec timestamps</span></span>
<span class="line"><span style="color:#C9D1D9;">docker logs -f --timestamps rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Derni\xE8res 100 lignes</span></span>
<span class="line"><span style="color:#C9D1D9;">docker logs --tail 100 rtype-server</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Stats en temps r\xE9el</span></span>
<span class="line"><span style="color:#24292F;">docker stats rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Logs avec timestamps</span></span>
<span class="line"><span style="color:#24292F;">docker logs -f --timestamps rtype-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Derni\xE8res 100 lignes</span></span>
<span class="line"><span style="color:#24292F;">docker logs --tail 100 rtype-server</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="build-local" tabindex="-1">Build local <a class="header-anchor" href="#build-local" aria-hidden="true">#</a></h2><p>Si vous voulez construire les images localement :</p><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Depuis la racine du projet</span></span>
<span class="line"><span style="color:#8B949E;"># 1. Compiler le projet</span></span>
<span class="line"><span style="color:#C9D1D9;">./build.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># 2. Build les images Docker</span></span>
<span class="line"><span style="color:#C9D1D9;">docker build -f docker/Dockerfile.server -t rtype-server:local </span><span style="color:#79C0FF;">.</span></span>
<span class="line"><span style="color:#C9D1D9;">docker build -f docker/Dockerfile.client -t rtype-client:local </span><span style="color:#79C0FF;">.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># 3. Lancer</span></span>
<span class="line"><span style="color:#C9D1D9;">docker run -d -p 4242:4242 rtype-server:local</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Depuis la racine du projet</span></span>
<span class="line"><span style="color:#6E7781;"># 1. Compiler le projet</span></span>
<span class="line"><span style="color:#24292F;">./build.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># 2. Build les images Docker</span></span>
<span class="line"><span style="color:#24292F;">docker build -f docker/Dockerfile.server -t rtype-server:local </span><span style="color:#0550AE;">.</span></span>
<span class="line"><span style="color:#24292F;">docker build -f docker/Dockerfile.client -t rtype-client:local </span><span style="color:#0550AE;">.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># 3. Lancer</span></span>
<span class="line"><span style="color:#24292F;">docker run -d -p 4242:4242 rtype-server:local</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="\u{1F510}-authentification-github-container-registry" tabindex="-1">\u{1F510} Authentification GitHub Container Registry <a class="header-anchor" href="#\u{1F510}-authentification-github-container-registry" aria-hidden="true">#</a></h2><p>Pour pull les images priv\xE9es :</p><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Cr\xE9er un Personal Access Token sur GitHub avec le scope &#39;read:packages&#39;</span></span>
<span class="line"><span style="color:#79C0FF;">echo</span><span style="color:#C9D1D9;"> YOUR_GITHUB_TOKEN </span><span style="color:#FF7B72;">|</span><span style="color:#C9D1D9;"> docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Puis pull</span></span>
<span class="line"><span style="color:#C9D1D9;">docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Cr\xE9er un Personal Access Token sur GitHub avec le scope &#39;read:packages&#39;</span></span>
<span class="line"><span style="color:#0550AE;">echo</span><span style="color:#24292F;"> YOUR_GITHUB_TOKEN </span><span style="color:#CF222E;">|</span><span style="color:#24292F;"> docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Puis pull</span></span>
<span class="line"><span style="color:#24292F;">docker pull ghcr.io/epitechpge3-2025/g-cpp-500-cot-5-1-rtype-2/rtype-server:latest</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="\u{1F4DD}-notes" tabindex="-1">\u{1F4DD} Notes <a class="header-anchor" href="#\u{1F4DD}-notes" aria-hidden="true">#</a></h2><ul><li>Les images sont multi-architecture (amd64)</li><li>Le serveur peut tourner en headless (sans GUI)</li><li>Le client n\xE9cessite un display X11 pour fonctionner</li><li>Les volumes persistent les donn\xE9es entre les red\xE9marrages</li><li>Les healthchecks s&#39;assurent que le serveur est op\xE9rationnel</li></ul><h2 id="\u{1F517}-liens-utiles" tabindex="-1">\u{1F517} Liens utiles <a class="header-anchor" href="#\u{1F517}-liens-utiles" aria-hidden="true">#</a></h2><ul><li><a href="https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2" target="_blank" rel="noreferrer">GitHub Repository</a></li><li><a href="https://github.com/orgs/EpitechPGE3-2025/packages" target="_blank" rel="noreferrer">GitHub Packages</a></li><li><a href="https://docs.docker.com/" target="_blank" rel="noreferrer">Docker Documentation</a></li></ul>`,38),r=[p];function c(o,t,i,d,y,u){return a(),n("div",null,r)}const m=s(l,[["render",c]]);export{h as __pageData,m as default};
