# ShootSystem — Système de gestion des tirs et projectiles

## Description générale
Le `ShootSystem` est un système chargé de **générer les projectiles** (tirs, balles, missiles, etc.) lorsqu’une entité disposant d’un composant de tir (`ShootComponent`) agit.

Chaque fois que le système est appelé, il crée de **nouvelles entités de type projectile**, dotées de tous les composants nécessaires (position, mouvement, collision, texture, etc.).

---

## Composants utilisés

| Composant | Rôle |
|------------|------|
| `PositionComponent` | Position actuelle de l’entité sur l’axe X/Y. |
| `RectComponent` | Dimensions graphiques (largeur/hauteur) du sprite. |

---