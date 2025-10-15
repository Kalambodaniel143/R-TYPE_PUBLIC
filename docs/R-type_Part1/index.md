# The First Part of R-type

# R-Type — A Game Engine That Roars!

## Projet Overview

**R-Type** is a C++ networked video game project inspired by the classic 90’s shoot’em’up.  
The goal of this project is to design and implement:
- a **multi-threaded server** managing all game logic, and  
- a **graphical client** rendering the game world and handling player input.  

Beyond recreating the original R-Type gameplay, this project emphasizes **software architecture**, **networking**, and **game engine design**, using modern C++ practices.

---

## Project Structure

- **Server** (`r-type_server`) — authoritative game logic and networking.  
- **Client** (`r-type_client`) — rendering, input, and local player control.  
- **Game Engine Core** — reusable architecture including systems for:
  - Rendering
  - Networking (UDP-based)
  - Game Logic
  - Entity-Component-System (ECS) architecture

---

##  Technologies & Tools

| Component | Technology |
|------------|-------------|
| Language | C++ |
| Build System | CMake |
| Package Manager | Conan |
| Rendering & Input | SFML |
| Networking | Asio |
| Documentation | Markdown / Vitpress  |
| OS Support | Linux (mandatory), Windows (recommended) |
---
