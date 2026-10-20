# Game Design

## Grundregel

Platziere genau acht vorgegebene Figuren auf einem Levelbrett.

Erlaubte Figuren:

- Dame
- Turm
- Läufer
- Springer

Nach Abschluss darf keine Figur eine andere Figur angreifen.

Zusätzliche Levelregeln:

- Das Brettlayout kann kleiner oder nicht quadratisch sein.
- Gesperrte Felder dürfen nicht belegt werden.

## Spielfluss

1. Level starten
2. Figuren platzieren
3. Konflikte prüfen
4. Lösung erreichen
5. Nächstes Level spielen

## Schwierigkeitsgrad

### Anfänger

- viele Figuren vorgegeben
- wenige Entscheidungen

### Mittel

- einige Figuren vorgegeben

### Schwer

- wenige Vorgaben

### Experte

- leeres Brett
- vollständige Lösung finden

## Anwendungsbereiche

### Spielermodus

Für alle Nutzer zugänglich. Er lädt Level aus dem Repository, zeigt deren feste Vorgaben und
Brettregeln an und prüft Platzierungen durch die Game Engine. Spielende können die festen
Vorgabefiguren nicht bearbeiten.

### Level Designer

Ein Entwicklerwerkzeug, kein Endnutzer-Spielmodus. Es ist nur in einem Vite-Entwicklungsbuild
sichtbar und erreichbar. Der Designer kann Level erstellen, bearbeiten, validieren, importieren,
exportieren und nach Bestätigung löschen. Exportierte JSON-Dateien werden manuell in das
Repository übernommen und regulär versioniert.

Kampagne, Daily Puzzle, Zufallslevel und Sandbox bleiben mögliche spätere Spielmodi; sie sind
derzeit nicht Bestandteil der Web-Oberfläche.
