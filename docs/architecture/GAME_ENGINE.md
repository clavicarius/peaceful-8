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

## Solver

`solveBoard(board)` returns a completed, conflict-free board or `null` if no
solution exists. Pieces already on the board are treated as clues and remain
unchanged.

`getHint(board)` returns the next piece placement from a solution, or
`undefined` when the board is solved or cannot be completed. `countSolutions`
can be used to check uniqueness; it stops at the requested maximum (two by
default).
