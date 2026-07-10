# Peaceful 8 - Project Overview

## 1. Projektübersicht

**Peaceful 8** ist ein plattformübergreifendes Logikspiel, das auf dem klassischen Schachbrett basiert.

Der Spieler platziert acht Schachfiguren auf einem 8x8-Schachbrett, sodass sich keine der Figuren gegenseitig angreifen kann.

Das Spiel kombiniert:

* Schachlogik
* strategisches Denken
* Puzzle-Mechaniken
* automatische Rätselgenerierung

Der Fokus liegt auf einer ruhigen, konzentrierten Spielerfahrung.

**Slogan:**

> Eight pieces. Zero conflicts.

---

# 2. Spielidee

## Grundregel

Der Spieler erhält acht Figuren aus folgenden Typen:

* Dame
* Turm
* Läufer
* Springer

Diese Figuren müssen so auf dem Brett platziert werden, dass:

* keine Figur eine andere angreifen kann
* alle acht Positionen gültig sind
* das Rätsel vollständig gelöst ist

Die Figuren verhalten sich nach klassischen Schachregeln.

---

# 3. Spielmechanik

## Platzieren von Figuren

Der Spieler kann Figuren:

* auf freie Felder ziehen
* verschieben
* entfernen (abhängig vom Spielmodus)

Die Oberfläche zeigt direkt, ob Konflikte entstehen.

## Feedback

### Konfliktfrei

Die Figur ist korrekt platziert.

### Konflikt

Eine Figur greift eine andere Figur an.

Mögliche Darstellung:

* rote Markierung betroffener Figuren
* Anzeige der Angriffslinie
* Hervorhebung konfliktverursachender Felder

---

# 4. Spielmodi

## Campaign

Eine Folge von handerstellten und generierten Leveln mit steigender Schwierigkeit.

## Daily Puzzle

Jeden Tag ein neues Rätsel für alle Spieler.

## Random Challenge

Ein zufällig generiertes Rätsel.

## Sandbox

Freies Experimentieren mit Figuren.

## Level Editor

Erstellen und Testen eigener Rätsel.

---

# 5. Schwierigkeitskonzept

Die Schwierigkeit wird über mehrere Faktoren gesteuert.

## Anfänger

* viele Figuren vorgegeben
* wenige freie Entscheidungen

## Leicht

* einige Figuren vorgegeben
* überschaubare Lösungswege

## Mittel

* wenige Vorgaben
* strategische Planung notwendig

## Schwer

* fast vollständige Eigenlösung

## Experte

* leeres Brett
* vollständige Lösung finden

---

# 6. Besonderes Merkmal

Das zentrale technische Alleinstellungsmerkmal ist ein automatischer Puzzle-Generator.

Der Generator soll:

* gültige Rätsel erzeugen
* Lösbarkeit garantieren
* Schwierigkeitsgrade bewerten
* optional eindeutige Lösungen erzeugen

Dadurch entstehen praktisch unbegrenzt viele Herausforderungen.

---

# 7. Technische Architektur

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

# 8. Technologie

## Frontend

* React
* TypeScript
* Vite

## Mobile

* Capacitor

Eine gemeinsame Codebasis ermöglicht:

* Browser-Version
* Android-App
* iOS-App

## Testing

* Vitest
* Playwright

## Qualität

* ESLint
* Prettier
* TypeScript strict mode

## CI/CD

* GitHub Actions

---

# 9. Repository-Struktur

```
peaceful-8/

apps/
  web/
  mobile/

packages/
  engine/
  solver/
  generator/
  ui/
  shared/

levels/

docs/

tests/

.github/

README.md
AGENT_GUIDE.md
```

---

# 10. Kernkomponenten

## Game Engine

Verantwortlich für:

* Brettmodell
* Figuren
* Bewegungsregeln
* Konflikterkennung
* Siegprüfung

Keine UI-Abhängigkeiten.

---

## Solver

Verantwortlich für:

* Finden gültiger Lösungen
* Prüfen von Leveln
* Unterstützung für Hinweise

---

## Level Generator

Verantwortlich für:

* Erzeugen neuer Rätsel
* Bewertung der Schwierigkeit
* Erkennen ungültiger Level

---

# 11. Level-Datenmodell

Beispiel:

```json
{
  "id": 42,
  "difficulty": "medium",
  "pieces": [
    {
      "type": "queen",
      "position": "A4",
      "fixed": true
    },
    {
      "type": "knight",
      "fixed": false
    }
  ]
}
```

---

# 12. Entwicklungsmeilensteine

## Milestone 1 - Foundation (Version 0.1)

**Ziel:** Technische Grundlage

Umfang:

* Repository erstellen
* Projektstruktur einrichten
* TypeScript Setup
* CI Pipeline
* Grunddokumentation

Ergebnis:

Lauffähiges Entwicklungsprojekt.

---

## Milestone 2 - Game Engine (Version 0.2)

**Ziel:** Funktionierende Spielregeln

Umfang:

* Schachbrettmodell
* Figurenmodell
* Bewegungsregeln
* Konflikterkennung
* automatische Tests

Ergebnis:

Eine vollständig getestete Spiellogik.

---

## Milestone 3 - First Prototype (Version 0.3)

**Ziel:** Erstes spielbares Erlebnis

Umfang:

* grafisches Spielfeld
* Figuren platzieren
* Drag & Drop
* Konfliktanzeige
* Lösung erkennen

Ergebnis:

Erste spielbare Version.

---

## Milestone 4 - Solver (Version 0.4)

**Ziel:** Automatische Lösungssuche

Umfang:

* Lösungsalgorithmus
* Validierung
* Unterstützung für Hinweise

Ergebnis:

Das System kann Rätsel analysieren.

---

## Milestone 5 - Level Generator (Version 0.5)

**Ziel:** Automatische Rätselerstellung

Umfang:

* Generierung kompletter Lösungen
* Entfernen von Figuren
* Schwierigkeitsbewertung
* Speicherung als Level-Dateien

Ergebnis:

Automatisch erzeugte Level.

---

## Milestone 6 - MVP Release (Version 0.6)

**Ziel:** Vollständiges erstes Spiel

Umfang:

* Kampagnenmodus
* 100 Level
* Fortschritt speichern
* Einstellungen
* Responsive Design

Ergebnis:

Spielbare Browser-Version.

---

## Milestone 7 - Mobile Release (Version 0.7)

**Ziel:** Mobile Plattformen

Umfang:

* Android Build
* iOS Build
* Touch Optimierung
* Offline-Modus

Ergebnis:

Mobile Apps.

---

## Milestone 8 - Community Features (Version 0.8)

**Ziel:** Langfristige Motivation

Umfang:

* Daily Puzzle
* Statistiken
* Erfolge
* Bestenlisten

---

## Milestone 9 - Advanced Features (Version 0.9)

**Ziel:** Erweiterte Möglichkeiten

Umfang:

* Level Editor
* eigene Rätsel teilen
* Spezialregeln
* Themes

---

## Milestone 10 - Release 1.0

**Ziel:** Veröffentlichung

Umfang:

* Stabilisierung
* Performance Optimierung
* Store Vorbereitung
* Dokumentation

---

# 13. Entwicklungsprinzipien

## Code

* sauber getrennte Module
* testbarer Code
* keine unnötige Komplexität

## Design

* einfache Bedienung
* ruhige Atmosphäre
* Fokus auf Denken statt Geschwindigkeit

## Erweiterbarkeit

Neue Funktionen sollen ergänzt werden können, ohne bestehende Kernlogik zu verändern.

---

# 14. Langfristige Vision

Peaceful 8 soll sich von einem einfachen Puzzle zu einer Plattform für Schach- und Logikrätsel entwickeln.

Mögliche zukünftige Erweiterungen:

* tägliche Herausforderungen
* eigene Level
* Wettbewerbe
* weitere Brettgrößen
* neue Figuren
* Community-Inhalte
