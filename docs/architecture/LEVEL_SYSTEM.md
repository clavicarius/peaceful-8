# Level System

## Level Format

Levels werden als JSON gespeichert.

Beispiel:

```json
{
  "id": 42,
  "difficulty": "medium",
  "board": {
    "width": 6,
    "height": 8,
    "blockedCells": ["B2", "C2", "D5"]
  },
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

```json
{
  "id": 1,
  "difficulty": "easy",
  "board": {
    "width": 5,
    "height": 5,
    "blockedCells": []
  },
  "pieces": [
    {
      "type": "queen",
      "position": "A1",
      "fixed": true
    }
  ]
}
```

## Anforderungen

Ein Level muss:

- lösbar sein
- gültige Figuren besitzen
- ein gültiges Brettlayout besitzen (auch nicht quadratisch möglich)
- gesperrte Felder konsistent definieren
- Schwierigkeitsgrad erfüllen

Die Engine-Funktion `createBoardFromLevel` übernimmt `board.width`, `board.height`
und `board.blockedCells` aus diesem Format. Breite und Höhe werden auf
`cols` beziehungsweise `rows` abgebildet. Algebraische Koordinaten wie `B2`
werden in nullbasierte Engine-Positionen umgewandelt; gesperrte Felder außerhalb
des Bretts oder ungültige Koordinaten werden abgewiesen.

## Beispielanalyse: 5×5 mit gesperrten Ecken

Für ein 5×5-Brett mit gesperrten Eckfeldern `A1`, `A5`, `E1`, `E5` wurden folgende
gültige 8er-Belegungen mit gemischten Figuren ermittelt:

### Lösung A

- Türme: `B1`, `C2`
- Läufer: `A3`, `D4`
- Springer: `D3`, `A4`, `E4`, `D5`

### Lösung B

- Türme: `B1`, `C4`
- Läufer: `D2`, `A3`
- Springer: `A2`, `E2`, `D3`, `D5`

Hinweis zur Dame:

- Bei vier gesperrten Ecken existiert keine gültige 8er-Lösung mit mindestens einer Dame.
- Wird genau eine Ecke freigegeben (also nur drei gesperrte Ecken), sind 8er-Lösungen mit Dame möglich.

## Koordinatensystem

- Felder werden in algebraischer Notation gespeichert (z. B. `A1`, `B2`).
- Spalten werden mit Großbuchstaben ab `A` gezählt.
- Zeilen sind 1-basiert.
- Für ein Board mit `width = 6` und `height = 8` sind z. B. `A1` bis `F8` gültig.

## Generator

Der Generator:

1. erzeugt Lösung
2. entfernt Figuren
3. prüft Schwierigkeit
4. speichert Level

## Beispielzusammenfassung: 5x5 mit gesperrtem Zentrum

Für ein 5x5-Brett mit gesperrtem Feld `C3` wurden zwei gültige Belegungen mit acht Figuren gefunden.

Verwendete Figurenverteilung pro Lösung:

- 1× Dame
- 1× Turm
- 2× Läufer
- 4× Springer

### Lösung A

- Dame: `C1`
- Turm: `B3`
- Läufer: `E2`, `A5`
- Springer: `A4`, `E4`, `D5`, `E5`

### Lösung B

- Dame: `C1`
- Turm: `D3`
- Läufer: `A2`, `E5`
- Springer: `A4`, `E4`, `A5`, `B5`
