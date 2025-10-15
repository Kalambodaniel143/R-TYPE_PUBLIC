import{_ as s,c as n,o as a,a as l}from"./app.ab183e9a.js";const m=JSON.parse('{"title":"Compilation sur Linux","description":"","frontmatter":{},"headers":[{"level":2,"title":"Option 1 : Fedora / Red Hat / CentOS","slug":"option-1-fedora-red-hat-centos","link":"#option-1-fedora-red-hat-centos","children":[{"level":3,"title":"1. Installer les d\xE9pendances syst\xE8me","slug":"_1-installer-les-dependances-systeme","link":"#_1-installer-les-dependances-systeme","children":[]},{"level":3,"title":"2. Compiler le projet","slug":"_2-compiler-le-projet","link":"#_2-compiler-le-projet","children":[]}]},{"level":2,"title":"Option 2 : Ubuntu / Debian","slug":"option-2-ubuntu-debian","link":"#option-2-ubuntu-debian","children":[{"level":3,"title":"1. Installer les d\xE9pendances syst\xE8me","slug":"_1-installer-les-dependances-systeme-1","link":"#_1-installer-les-dependances-systeme-1","children":[]},{"level":3,"title":"2. Compiler le projet","slug":"_2-compiler-le-projet-1","link":"#_2-compiler-le-projet-1","children":[]}]}],"relativePath":"R-type_Part1/Builder/build_linux.md"}'),e={name:"R-type_Part1/Builder/build_linux.md"},p=l(`<h1 id="compilation-sur-linux" tabindex="-1">Compilation sur Linux <a class="header-anchor" href="#compilation-sur-linux" aria-hidden="true">#</a></h1><h2 id="option-1-fedora-red-hat-centos" tabindex="-1">Option 1 : Fedora / Red Hat / CentOS <a class="header-anchor" href="#option-1-fedora-red-hat-centos" aria-hidden="true">#</a></h2><h3 id="_1-installer-les-dependances-systeme" tabindex="-1">1. Installer les d\xE9pendances syst\xE8me <a class="header-anchor" href="#_1-installer-les-dependances-systeme" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Outils de d\xE9veloppement</span></span>
<span class="line"><span style="color:#C9D1D9;">sudo dnf install -y cmake gcc g++ python3-pip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># D\xE9pendances X11/OpenGL pour SFML</span></span>
<span class="line"><span style="color:#C9D1D9;">sudo dnf install -y libfontenc-devel libXaw-devel libXcomposite-devel \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    libXdmcp-devel libXtst-devel libxkbfile-devel libXres-devel \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    libXScrnSaver-devel xcb-util-wm-devel xcb-util-keysyms-devel \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    xcb-util-renderutil-devel libXdamage-devel libXv-devel \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    xcb-util-devel libuuid-devel xcb-util-cursor-devel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Installer Conan</span></span>
<span class="line"><span style="color:#C9D1D9;">pip3 install conan</span></span>
<span class="line"><span style="color:#C9D1D9;">conan profile detect --force</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Outils de d\xE9veloppement</span></span>
<span class="line"><span style="color:#24292F;">sudo dnf install -y cmake gcc g++ python3-pip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># D\xE9pendances X11/OpenGL pour SFML</span></span>
<span class="line"><span style="color:#24292F;">sudo dnf install -y libfontenc-devel libXaw-devel libXcomposite-devel \\</span></span>
<span class="line"><span style="color:#24292F;">    libXdmcp-devel libXtst-devel libxkbfile-devel libXres-devel \\</span></span>
<span class="line"><span style="color:#24292F;">    libXScrnSaver-devel xcb-util-wm-devel xcb-util-keysyms-devel \\</span></span>
<span class="line"><span style="color:#24292F;">    xcb-util-renderutil-devel libXdamage-devel libXv-devel \\</span></span>
<span class="line"><span style="color:#24292F;">    xcb-util-devel libuuid-devel xcb-util-cursor-devel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Installer Conan</span></span>
<span class="line"><span style="color:#24292F;">pip3 install conan</span></span>
<span class="line"><span style="color:#24292F;">conan profile detect --force</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="_2-compiler-le-projet" tabindex="-1">2. Compiler le projet <a class="header-anchor" href="#_2-compiler-le-projet" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Cloner le projet</span></span>
<span class="line"><span style="color:#C9D1D9;">git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git</span></span>
<span class="line"><span style="color:#79C0FF;">cd</span><span style="color:#C9D1D9;"> G-CPP-500-COT-5-1-rtype-2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Cr\xE9er le dossier de build</span></span>
<span class="line"><span style="color:#C9D1D9;">mkdir build </span><span style="color:#FF7B72;">&amp;&amp;</span><span style="color:#C9D1D9;"> </span><span style="color:#79C0FF;">cd</span><span style="color:#C9D1D9;"> build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Installer les d\xE9pendances C++ avec Conan</span></span>
<span class="line"><span style="color:#C9D1D9;">conan install .. --output-folder=. --build=missing</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Configurer CMake</span></span>
<span class="line"><span style="color:#C9D1D9;">cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Compiler</span></span>
<span class="line"><span style="color:#C9D1D9;">cmake --build </span><span style="color:#79C0FF;">.</span><span style="color:#C9D1D9;"> --parallel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Ex\xE9cuter</span></span>
<span class="line"><span style="color:#C9D1D9;">./bin/r-type_client</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Cloner le projet</span></span>
<span class="line"><span style="color:#24292F;">git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git</span></span>
<span class="line"><span style="color:#0550AE;">cd</span><span style="color:#24292F;"> G-CPP-500-COT-5-1-rtype-2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Cr\xE9er le dossier de build</span></span>
<span class="line"><span style="color:#24292F;">mkdir build </span><span style="color:#CF222E;">&amp;&amp;</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">cd</span><span style="color:#24292F;"> build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Installer les d\xE9pendances C++ avec Conan</span></span>
<span class="line"><span style="color:#24292F;">conan install .. --output-folder=. --build=missing</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Configurer CMake</span></span>
<span class="line"><span style="color:#24292F;">cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Compiler</span></span>
<span class="line"><span style="color:#24292F;">cmake --build </span><span style="color:#0550AE;">.</span><span style="color:#24292F;"> --parallel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Ex\xE9cuter</span></span>
<span class="line"><span style="color:#24292F;">./bin/r-type_client</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><hr><h2 id="option-2-ubuntu-debian" tabindex="-1">Option 2 : Ubuntu / Debian <a class="header-anchor" href="#option-2-ubuntu-debian" aria-hidden="true">#</a></h2><h3 id="_1-installer-les-dependances-systeme-1" tabindex="-1">1. Installer les d\xE9pendances syst\xE8me <a class="header-anchor" href="#_1-installer-les-dependances-systeme-1" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Outils de d\xE9veloppement</span></span>
<span class="line"><span style="color:#C9D1D9;">sudo apt update</span></span>
<span class="line"><span style="color:#C9D1D9;">sudo apt install -y cmake gcc g++ python3-pip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># D\xE9pendances X11/OpenGL pour SFML</span></span>
<span class="line"><span style="color:#C9D1D9;">sudo apt install -y libx11-dev libxrandr-dev libxcursor-dev \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    libxi-dev libudev-dev libgl1-mesa-dev libopenal-dev \\</span></span>
<span class="line"><span style="color:#C9D1D9;">    libflac-dev libvorbis-dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Installer Conan</span></span>
<span class="line"><span style="color:#C9D1D9;">pip3 install conan</span></span>
<span class="line"><span style="color:#C9D1D9;">conan profile detect --force</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Outils de d\xE9veloppement</span></span>
<span class="line"><span style="color:#24292F;">sudo apt update</span></span>
<span class="line"><span style="color:#24292F;">sudo apt install -y cmake gcc g++ python3-pip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># D\xE9pendances X11/OpenGL pour SFML</span></span>
<span class="line"><span style="color:#24292F;">sudo apt install -y libx11-dev libxrandr-dev libxcursor-dev \\</span></span>
<span class="line"><span style="color:#24292F;">    libxi-dev libudev-dev libgl1-mesa-dev libopenal-dev \\</span></span>
<span class="line"><span style="color:#24292F;">    libflac-dev libvorbis-dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Installer Conan</span></span>
<span class="line"><span style="color:#24292F;">pip3 install conan</span></span>
<span class="line"><span style="color:#24292F;">conan profile detect --force</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="_2-compiler-le-projet-1" tabindex="-1">2. Compiler le projet <a class="header-anchor" href="#_2-compiler-le-projet-1" aria-hidden="true">#</a></h3><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#8B949E;"># Cloner le projet</span></span>
<span class="line"><span style="color:#C9D1D9;">git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git</span></span>
<span class="line"><span style="color:#79C0FF;">cd</span><span style="color:#C9D1D9;"> G-CPP-500-COT-5-1-rtype-2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Cr\xE9er le dossier de build</span></span>
<span class="line"><span style="color:#C9D1D9;">mkdir build </span><span style="color:#FF7B72;">&amp;&amp;</span><span style="color:#C9D1D9;"> </span><span style="color:#79C0FF;">cd</span><span style="color:#C9D1D9;"> build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Installer les d\xE9pendances C++ avec Conan</span></span>
<span class="line"><span style="color:#C9D1D9;">conan install .. --output-folder=. --build=missing</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Configurer CMake</span></span>
<span class="line"><span style="color:#C9D1D9;">cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Compiler</span></span>
<span class="line"><span style="color:#C9D1D9;">cmake --build </span><span style="color:#79C0FF;">.</span><span style="color:#C9D1D9;"> --parallel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8B949E;"># Ex\xE9cuter</span></span>
<span class="line"><span style="color:#C9D1D9;">./bin/r-type_client</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#6E7781;"># Cloner le projet</span></span>
<span class="line"><span style="color:#24292F;">git clone https://github.com/EpitechPGE3-2025/G-CPP-500-COT-5-1-rtype-2.git</span></span>
<span class="line"><span style="color:#0550AE;">cd</span><span style="color:#24292F;"> G-CPP-500-COT-5-1-rtype-2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Cr\xE9er le dossier de build</span></span>
<span class="line"><span style="color:#24292F;">mkdir build </span><span style="color:#CF222E;">&amp;&amp;</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">cd</span><span style="color:#24292F;"> build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Installer les d\xE9pendances C++ avec Conan</span></span>
<span class="line"><span style="color:#24292F;">conan install .. --output-folder=. --build=missing</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Configurer CMake</span></span>
<span class="line"><span style="color:#24292F;">cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Compiler</span></span>
<span class="line"><span style="color:#24292F;">cmake --build </span><span style="color:#0550AE;">.</span><span style="color:#24292F;"> --parallel</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;"># Ex\xE9cuter</span></span>
<span class="line"><span style="color:#24292F;">./bin/r-type_client</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div>`,12),c=[p];function i(r,o,t,d,b,u){return a(),n("div",null,c)}const C=s(e,[["render",i]]);export{m as __pageData,C as default};
