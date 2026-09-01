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
