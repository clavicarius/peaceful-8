# Game Engine

## Verantwortlichkeiten

Die Engine enthält keine UI-Logik.

Sie kennt:

- Brett
- Brettform und Brettgröße pro Level
- Figuren
- Positionen
- gesperrte Felder
- Angriffsregeln
- Spielzustand

## Figuren

Jede Figur implementiert:

canAttack(source, target)

## Beispiel

Queen:

- gleiche Zeile
- gleiche Spalte
- gleiche Diagonale

Knight:

- L-Bewegung

## Ergebnis

Die Engine liefert:

- gültig
- Konflikte
- gelöste Position
