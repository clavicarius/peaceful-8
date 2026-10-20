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

Leichte und mittlere Level benötigen mindestens eine gültige Lösung. Schwere
und extra schwere Level benötigen genau eine gültige Lösung. Die Validierung
weist Level mit Konflikten in den Startpositionen oder ohne vollständige
Belegung der erforderlichen Figurenanzahl zurück.

Fest vorgegebene Figuren (`fixed: true`) werden beim Start auf ihren gespeicherten Positionen
platziert und können danach weder verschoben noch entfernt werden. Im Web-Prototyp haben Easy,
Medium und Hard jeweils 4, 2 und 1 feste Figuren.

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

Im Web-Prototyp wird die vollständige Belegung über `findSolutions` aus der Engine gesucht. Der
Generator entfernt anschließend Hinweise und validiert den Level mit
`validateLevelByDifficulty`; Such- und Angriffsregeln werden nicht in der UI dupliziert.

Die Generator-Kriterien sind bewusst einfach und reproduzierbar:

- **Easy:** vier fest vorgegebene Figuren; mindestens eine Lösung.
- **Medium:** zwei fest vorgegebene Figuren; mindestens eine Lösung.
- **Hard / Extra-hard:** genau eine Lösung. Der Generator probiert Hinweis-Teilmengen der
  gefundenen Lösung, beginnend mit der kleinsten Anzahl an Vorgaben, und verwirft Ergebnisse, die
  die Solver-Validierung nicht bestehen.

Diese Kriterien sind eine erste technische Bewertung und keine Aussage über menschliche
Lösungszeit. Für handerstellte Levels gilt die Solver-Regel: Easy/Medium brauchen mindestens eine
Lösung, Hard/Extra-hard genau eine.

## Player mode und Level Designer

Der Spielermodus lädt Levels aus `apps/web/src/levels.json`. Brettgröße, gesperrte Felder,
vorgegebene Figuren und Schwierigkeitsgrad stammen aus dem Level-Eintrag. Vorgabefiguren können
nicht verschoben oder entfernt werden; Spielzüge werden vom Engine-Board validiert.

Der Level Designer ist ausschließlich in einem Vite-Entwicklungsbuild
(`import.meta.env.DEV`) verfügbar. Der Produktionsbuild zeigt nur den Spielermodus und lädt den
Designer nicht. Entwickler können vorhandene Levels laden und ändern, neue Levels manuell oder über
den Solver erzeugen sowie Levels nach einer Bestätigung löschen. Änderungen bleiben zunächst im
Browserzustand. **Export JSON** lädt den Levelkatalog herunter; der Entwickler ersetzt damit bei
Bedarf `apps/web/src/levels.json` und führt Tests und Git-Commit manuell aus.

Es gibt im Prototyp keine Persistenz von Spielfortschritt. Leveländerungen oder -löschungen können
daher keinen gespeicherten Fortschritt invalidieren. Bei künftiger Persistenz muss der Fortschritt
über stabile Level-IDs und eine Versionierung des Levelinhalts geschützt werden.

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
