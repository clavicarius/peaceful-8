# ADR-0002: Engine Independence

Version: 1.0  
Status: Accepted
Datum: 2026-07-11

## Decision

Die Game Engine von Peaceful 8 wird vollständig unabhängig von der Benutzeroberfläche entwickelt.

Die Engine darf keine Abhängigkeiten zu UI-Technologien wie:

- React
- Vite
- Capacitor
- Browser APIs
- Mobile Frameworks

enthalten.

Die Engine stellt ausschließlich eine definierte Programmierschnittstelle (API) bereit, über die andere Komponenten mit der Spiellogik interagieren.

---

## Context

Peaceful 8 soll langfristig auf mehreren Plattformen verfügbar sein:

- Web Browser
- Progressive Web App
- Android
- iOS

Zusätzlich werden weitere technische Komponenten benötigt:

- Puzzle Solver
- Level Generator
- automatische Tests
- zukünftiger Level Editor

Wenn die Spiellogik direkt mit der Benutzeroberfläche verbunden wäre, würden Änderungen an einer Plattform oder Oberfläche Auswirkungen auf das gesamte System haben.

Eine unabhängige Engine ermöglicht eine gemeinsame Nutzung der Spiellogik durch alle Anwendungen.

---

## Consequences

### Positive Konsequenzen

- Eine zentrale Implementierung der Spielregeln
- Gleiche Regeln auf allen Plattformen
- Einfachere Tests
- Einfachere Erweiterungen
- Wiederverwendung für Solver und Generator
- Weniger technische Abhängigkeiten

### Negative Konsequenzen

- Zusätzlicher Architekturaufwand am Anfang
- Klare Schnittstellen müssen definiert werden
- UI benötigt Adapter zur Engine

---

## Implementation Guidelines

Die Engine enthält:

- Schachbrettmodell
- Figurenmodell
- Bewegungsregeln
- Angriffserkennung
- Konfliktprüfung
- Spielzustand
- Validierung

Die Engine enthält nicht:

- Rendering
- Animationen
- Benutzerinteraktionen
- Touch-Handling
- Navigation
- Speicherung von UI-Zuständen

---

## Example Architecture

```text
                 UI Layer

        React Web Application
        Mobile Application
        Level Editor


                    |
                    |
                 Engine API

                    |

              Game Engine

        Board
        Pieces
        Rules
        Validation


          /                 \

      Solver             Generator
```

---

## Alternatives Considered

### Alternative 1: Engine direkt in UI integrieren

Nicht gewählt.

Gründe:

- starke Kopplung
- schwierigere Tests
- schlechte Wiederverwendbarkeit

### Alternative 2: Separate Engines pro Plattform

Nicht gewählt.

Gründe:

- doppelte Implementierung
- unterschiedliche Fehlerquellen
- höherer Wartungsaufwand

---

## Related Documents

- ARCHITECTURE.md
- GAME_ENGINE.md
- LEVEL_SYSTEM.md
- TESTING.md
