# Projekt: Peaceful 8

Vision

Peaceful 8 ist ein plattformübergreifendes Logikspiel, bei dem acht Schachfiguren so auf einem Schachbrett platziert werden, dass sich keine Figur gegenseitig angreift.

Das Spiel soll:

leicht zu erlernen sein,
schwer zu meistern sein,
entspannend wirken,
täglich neue Herausforderungen bieten.
Phase 1 – Spielregeln (1–2 Wochen)

Ziel: Eine belastbare Spielmechanik entwickeln.

Aufgaben
Spielregeln definieren
Figurenregeln implementieren
Dame
Turm
Läufer
Springer
Konflikterkennung
Siegbedingung
Levelformat festlegen
Speichermodell entwerfen

Ergebnis

Eine reine Spiel-Engine ohne Benutzeroberfläche.

Phase 2 – Puzzle Engine (2 Wochen)

Ziel: Das Herzstück des Spiels.

Aufgaben
Brettmodell
Figurenmodell
Platzierungslogik
Rückgängig/Wiederholen
Validierung
Lösungsprüfung

Optional:

Solver entwickeln
Prüfen, ob ein Rätsel lösbar ist

Ergebnis

Eine vollständig testbare Engine.

Phase 3 – Levelgenerator (3 Wochen)

Dies wird wahrscheinlich der spannendste Teil des Projekts.

Aufgaben

Generator für

zufällige Figurenkombinationen
vollständige Lösungen
Entfernen einzelner Figuren
Schwierigkeitsbewertung

Anschließend

Solver laufen lassen
Mehrfachlösungen erkennen
Nur eindeutige Rätsel akzeptieren

Ergebnis:

Automatisch erzeugbare Level.

Phase 4 – Web-App (3 Wochen)
Technik
React
TypeScript
Vite
PWA
Funktionen
Startbildschirm
Levelauswahl
Spielfeld
Animationen
Hinweise
Einstellungen
Phase 5 – Mobile Apps (1 Woche)

Mittels Capacitor:

Android
iOS

Nahezu identische Codebasis.

Phase 6 – Inhalte (fortlaufend)

Erzeugen von

Kampagne
Daily Puzzle
Challenges
Tutorials
Phase 7 – Veröffentlichung

Browser

Android

iOS

GitHub

Technische Architektur
Peaceful 8

apps/
   web
   mobile

packages/
   engine
   generator
   solver
   ui
   shared

levels/
   campaign
   daily
   generated

docs/

.github/

tests/
Wichtige Meilensteine

Die verbindliche Roadmap ist in `docs/development/ROADMAP.md` dokumentiert.

Version	Milestone
0.1	Foundation
0.2	Game Engine
0.3	Playable Prototype
0.4	Solver
0.5	Level Generator
0.6	MVP Release
0.7	Mobile Release
0.8	Community Features
0.9	Advanced Features
1.0	Release 1.0

GitHub-Projektstruktur

Ich würde das Repository ähnlich wie deine anderen Projekte aufbauen:

.github/
docs/
packages/
apps/
levels/
scripts/
tests/

README.md
LICENSE
CONTRIBUTING.md
AGENTS.md
Roadmap (Versionen)
Version	Milestone
0.1	Foundation
0.2	Game Engine
0.3	Playable Prototype
0.4	Solver
0.5	Level Generator
0.6	MVP Release
0.7	Mobile Release
0.8	Community Features
0.9	Advanced Features
1.0	Release 1.0
Eine Ergänzung, die sich früh lohnt

Ich würde den Solver und den Levelgenerator von Anfang an als eigenständige Pakete entwickeln. So kann dieselbe Logik später mehrfach genutzt werden:

im Spiel selbst (z. B. für Hinweise),
für automatische Tests,
zum Generieren neuer Rätsel,
und für einen späteren Level-Editor.
