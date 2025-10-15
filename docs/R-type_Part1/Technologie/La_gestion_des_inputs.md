### **Étude Comparative Inputsystem**

Pour gérer les entrées du joueur, il existe principalement deux philosophies. Le choix entre les deux a un impact important sur la flexibilité et la clarté du moteur.

#### **Méthode A : L'Approche Traditionnelle (centrée sur les actions)**

C'est la méthode la plus fréquente dans les tutoriels et beaucoup de moteurs de jeu.

* **Comment ça marche ?** On définit d'abord les actions dont le jeu a besoin (ex: `"SAUTER"`, `"TIRER"`). Ensuite, on vient "attacher" une ou plusieurs touches physiques à chacune de ces actions. Le code du jeu demande ensuite : "Est-ce que l'action `"SAUTER"` est activée ?".
* **Avantages :** C'est très direct et facile à comprendre du point de vue du gameplay.
* **Inconvénients :** La touche physique est un peu une "donnée magique" attachée à une action. Si on veut créer un menu de configuration de touches complexe, où l'on doit lister toutes les touches possibles et voir à quelle action elles sont liées, cela devient compliqué. Le système n'est pas vraiment conçu pour penser en termes de "touches".

#### **Méthode B : Mon Approche (centrée sur les touches)**

J'ai choisi une architecture qui inverse cette logique.

* **Comment ça marche ?** J'ai d'abord défini un "dictionnaire" de toutes les touches qui peuvent exister (`enum class Key`). C'est ma source de vérité sur le matériel. Mon moteur connaît donc l'existence de `Key::A`, `Key::Space`, `Key::ArrowUp`, etc., indépendamment de toute action. Ensuite, mes actions (`"MOVE_UP"`, `"FIRE"`) sont définies comme des **regroupements de ces touches**.
* **Avantages :** Le système est beaucoup plus flexible et mieux structuré.
* **Inconvénients :** Demande de définir cette longue liste de touches au début.

---

### **Tableau Comparatif des Deux Méthodes**

| Critère | Méthode A (Traditionnelle) | Méthode B (Mon Choix : centrée sur les touches) |
| :--- | :--- | :--- |
| **Clarté du Code** | **Moyenne.** La relation entre une touche et une action est souvent cachée dans le code qui fait le "binding". | **Excellente.** La liste de toutes les touches possibles est définie à un seul endroit (`InputEnums.hpp`). C'est clair, centralisé et facile à maintenir. |
| **Flexibilité**  | **Limitée.** Difficile de faire des opérations sur les touches elles-mêmes. Par exemple, "désactiver toutes les touches de lettres" serait compliqué à coder. | **Totale.** Puisque j'ai une liste complète des touches, je peux créer n'importe quelle logique complexe. Créer un menu de configuration des touches devient trivial : il suffit de parcourir mon énumération de touches. |
| **Découplage** | **Bon.** Le jeu ne dépend pas directement des touches. | **Parfait.** Le système fait une distinction très nette entre la **couche matérielle** (la liste de toutes les touches possibles) et la **couche logique** (les actions du jeu). C'est une architecture très propre. |
| **Gestion des Conflits** | **Manuelle.** Le système ne peut pas savoir facilement si la même touche a été assignée à deux actions différentes. | **Facile à automatiser.** Je peux facilement écrire une fonction qui vérifie si une touche de mon énumération est utilisée dans plus d'une action. |

### **Conclusion**

Mon choix d'une architecture "centrée sur les touches" n'est pas anodin. Alors que l'approche traditionnelle est plus rapide pour un petit prototype, elle montre ses limites dans un vrai projet de moteur de jeu.

Ma méthode est un choix d'ingénierie qui privilégie la **robustesse** et la **flexibilité à long terme**. Elle crée une base de code plus saine, plus facile à maintenir et bien mieux préparée à des fonctionnalités avancées comme la personnalisation complète des contrôles par le joueur. C'est une approche plus professionnelle et plus proche de ce que l'on attend d'un moteur de jeu bien conçu.