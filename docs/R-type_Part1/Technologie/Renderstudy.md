### **Étude Comparative Rendersystem**

Pour construire mon moteur de jeu, une décision importante était de savoir **comment intégrer une bibliothèque externe comme SFML**. Il y avait deux manières de faire, chacune avec ses avantages et ses inconvénients.

#### **Méthode A : L'Intégration Directe (la voie rapide)**

La première option était d'utiliser SFML directement partout dans mon code.

* **Comment ça marche ?** Mon système de rendu (`RenderSystem`) aurait directement appelé les fonctions de SFML. Le code aurait été rempli de `fenetre_sfml.draw(...)`. C'est comme construire une maison où les murs, les fenêtres et la plomberie sont tous de la même marque et soudés ensemble.
* **Avantages :** C'est plus rapide à mettre en place au début.
* **Inconvénients :** Le moteur devient complètement dépendant de SFML. Si je veux changer de "marque" de fenêtres, je dois démolir tous les murs. Le code est moins organisé.

#### **Méthode B : L'Intégration par Abstraction (ma méthode)**

J'ai choisi une approche plus structurée en créant une "couche d'abstraction".

* **Comment ça marche ?** Mon moteur ne connaît pas SFML. Il connaît seulement un "plan" ou un "contrat" (`IGraphicsBackend`) qui décrit ce qu'il a besoin de faire : "dessiner un objet", "ouvrir une fenêtre". Ensuite, une pièce spécialisée (`SFMLBackend`) se charge de traduire ce plan en actions concrètes avec SFML. C'est comme construire une maison avec des cadres de fenêtre standards : n'importe quelle marque de fenêtre peut venir s'y installer.
* **Avantages :** Le moteur est flexible et indépendant. Le code est très bien organisé.
* **Inconvénients :** Cela demande un peu plus de planification au début.

---

### **Tableau Comparatif des Deux Méthodes**

| Critère | Méthode A (Utilisation Directe) | Méthode B (Mon Choix : Abstraction) |
| :--- | :--- | :--- |
| **Flexibilité** | **Faible.** Changer de bibliothèque (passer de SFML à SDL) obligerait à réécrire une grande partie du moteur. Le moteur est "marié" à SFML. | **Très élevée.** Je peux changer de bibliothèque graphique juste en écrivant un nouveau "traducteur" (`SDLBackend`), sans toucher au reste du moteur. C'est un moteur "prêt pour l'avenir". |
| **Organisation du Code**| **Moyenne.** La logique du jeu et la logique de l'affichage sont mélangées. C'est plus difficile de s'y retrouver. | **Excellente.** Le code du jeu est complètement séparé du code de l'affichage. [cite_start]C'est ce qu'on appelle un bon **découplage**, une pratique essentielle demandée par le projet[cite: 196]. |
| **Effort Initial** | **Faible.** C'est la solution la plus rapide pour avoir quelque chose à l'écran. | **Moyen.** Il faut prendre le temps de bien concevoir le "contrat" (l'interface) au départ. |

### **Conclusion**

[cite_start]En comparant ces deux approches, j'ai choisi la **Méthode B (l'abstraction)** car elle correspond aux exigences d'un **vrai moteur de jeu**[cite: 23]. Bien qu'elle demande un peu plus de travail au départ, elle offre une flexibilité et une qualité de code bien supérieures. Ce choix rend mon moteur plus robuste, plus facile à maintenir et capable d'évoluer, ce qui était un objectif central du projet.