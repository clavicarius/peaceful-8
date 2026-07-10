# Level System

## Level Format

Levels werden als JSON gespeichert.

Beispiel:

{
 "id":1,
 "difficulty":"easy",
 "pieces":[
   {
    "type":"queen",
    "position":"A1",
    "fixed":true
   }
 ]
}


## Anforderungen

Ein Level muss:

- lösbar sein
- gültige Figuren besitzen
- Schwierigkeitsgrad erfüllen


## Generator

Der Generator:

1. erzeugt Lösung
2. entfernt Figuren
3. prüft Schwierigkeit
4. speichert Level