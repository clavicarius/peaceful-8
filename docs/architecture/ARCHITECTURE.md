# Architektur

## Grundprinzip

Die Anwendung wird modular aufgebaut.

Die Spiel-Engine ist unabhängig von der Oberfläche.

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
- Bretttopologie (variable Größen und Formen)
- gesperrte Felder auf Levelbasis

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

## Spielermodus und Entwicklerbereich

Die Webanwendung bietet zwei getrennte Ansichten:

- **Spielermodus** lädt den eingecheckten Katalog `apps/web/src/levels.json` und verwendet die
  Engine für Figurenplatzierung, Angriffserkennung und Lösungsprüfung. Funktionen zum Erzeugen von
  Levels sind nicht verfügbar.
- Der **Level Designer** ist nur sichtbar, wenn Vites Compile-Time-Flag `import.meta.env.DEV` wahr
  ist. Seine UI wird nur bei Bedarf geladen; Produktions-Builds enthalten ausschließlich den
  Spielermodus. Der Designer nutzt den Engine-Solver zum Erzeugen und Prüfen von Levels und
  implementiert keine Angriffsregeln selbst.

Änderungen des Designers bleiben im Browser-Speicher, bis der Entwickler den JSON-Katalog
ausdrücklich exportiert. Die exportierte Datei kann den eingecheckten Katalog ersetzen und danach
im regulären Git-Workflow geprüft, getestet und committet werden. Es gibt keine automatischen
Schreibzugriffe auf das Repository oder Git-Operationen.

Die Solver-API der Engine stellt gefundene Lösungen für den Generator bereit. Der Generator bleibt
vorerst Teil der Webanwendung; die UI-Grenze führt keine Abhängigkeit der Engine zu React oder
Browser-APIs ein.
