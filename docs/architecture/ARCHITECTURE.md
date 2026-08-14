# Architektur

## Grundprinzip

Die Anwendung wird modular aufgebaut.

Die Spiel-Engine ist unabhängig von der Oberfläche.

## Grundprinzip

Die Spiellogik wird vollständig von der Oberfläche getrennt.

Architektur:

```
                UI
                 |
          Game Engine
                 |
     -----------------------
     |          |          |
  Solver   Generator   Storage
```

---

## Struktur

apps/

web/
mobile/

packages/

engine/

- Spiellogik

solver/

- Lösungssuche

generator/

- Levelerzeugung

ui/

- gemeinsame UI Komponenten

## Datenfluss

UI
|
Game Engine
|
Solver / Generator
|
Level Storage
