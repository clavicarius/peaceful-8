# Peaceful 8 - Project Overview

## 1. Projektübersicht

**Peaceful 8** ist ein plattformübergreifendes Logikspiel, das auf dem klassischen Schachbrett basiert.

Der Spieler platziert acht Schachfiguren auf einem 8x8-Schachbrett, sodass sich keine der Figuren gegenseitig angreifen kann.

Das Spiel kombiniert:

- Schachlogik
- strategisches Denken
- Puzzle-Mechaniken
- automatische Rätselgenerierung

Der Fokus liegt auf einer ruhigen, konzentrierten Spielerfahrung.

**Slogan:**

> Eight pieces. Zero conflicts.

## Zielgruppe

Peaceful 8 richtet sich an Spieler, die logische Herausforderungen bevorzugen und Wert auf eine entspannte Spielerfahrung legen.

Das Spiel ist bewusst frei von Zeitdruck und eignet sich sowohl für kurze Spielsessions als auch für längere Rätselphasen.

Die Zielgruppe umfasst:

- Puzzle-Enthusiasten
- Schachinteressierte
- Casual Gamer
- Mobile Gamer
- Spieler aller Altersgruppen

## Nicht-Ziele

Peaceful 8 ist kein Schachspiel.

Es geht nicht darum, gegen einen Gegner anzutreten oder klassische Partien zu spielen.

Ebenso soll das Spiel kein hektisches Geschicklichkeitsspiel sein.

Der Fokus liegt ausschließlich auf logischen Rätseln.

---

# 2. Spielidee

## Grundregel

Der Spieler erhält acht Figuren aus folgenden Typen:

- Dame
- Turm
- Läufer
- Springer

Diese Figuren müssen so auf dem Brett platziert werden, dass:

- keine Figur eine andere angreifen kann
- alle acht Positionen gültig sind
- das Rätsel vollständig gelöst ist

Die Figuren verhalten sich nach klassischen Schachregeln.

## Designprinzipien

Peaceful 8 folgt einigen klaren Gestaltungsprinzipien.

- einfache Regeln
- anspruchsvolle Lösungen
- ruhige Atmosphäre
- unmittelbares Feedback
- keine Werbung im Spielfeld
- keine störenden Animationen

---

# 3. Spielmechanik

## Platzieren von Figuren

Der Spieler kann Figuren:

- auf freie Felder ziehen
- verschieben
- entfernen (abhängig vom Spielmodus)

Die Oberfläche zeigt direkt, ob Konflikte entstehen.

## Feedback

### Konfliktfrei

Die Figur ist korrekt platziert.

### Konflikt

Eine Figur greift eine andere Figur an.

Mögliche Darstellung:

- rote Markierung betroffener Figuren
- Anzeige der Angriffslinie
- Hervorhebung konfliktverursachender Felder

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

- viele Figuren vorgegeben
- wenige freie Entscheidungen

## Leicht

- einige Figuren vorgegeben
- überschaubare Lösungswege

## Mittel

- wenige Vorgaben
- strategische Planung notwendig

## Schwer

- fast vollständige Eigenlösung

## Experte

- leeres Brett
- vollständige Lösung finden

---

# 6. Besonderes Merkmal

Das zentrale technische Alleinstellungsmerkmal ist ein automatischer Puzzle-Generator.

Der Generator soll:

- gültige Rätsel erzeugen
- Lösbarkeit garantieren
- Schwierigkeitsgrade bewerten
- optional eindeutige Lösungen erzeugen

Dadurch entstehen praktisch unbegrenzt viele Herausforderungen.

---

# 7. Technische Architektur

Die Anwendung besteht aus einer klar getrennten Spiel-Engine, einem Solver, einem Puzzle-Generator und mehreren Benutzeroberflächen. Details sind in [Architecture](../architecture/ARCHITECTURE.md) beschrieben.

---

# 8. Technologie

Die Anwendung basiert auf einem modernen TypeScript-Stack. Details befinden sich im Dokument [Tech Stack](../architecture/TECH_STACK.md).

---

# 10. Kernkomponenten

## Game Engine

Verantwortlich für:

- Brettmodell
- Figuren
- Bewegungsregeln
- Konflikterkennung
- Siegprüfung

Keine UI-Abhängigkeiten.

---

## Solver

Verantwortlich für:

- Finden gültiger Lösungen
- Prüfen von Leveln
- Unterstützung für Hinweise

---

## Level Generator

Verantwortlich für:

- Erzeugen neuer Rätsel
- Bewertung der Schwierigkeit
- Erkennen ungültiger Level

---
