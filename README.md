# LinguaScience — Přírodopis 6. ročník

Interaktivní webová učebnice pro ZŠ Lingua Universal Litoměřice.

## Struktura souborů (vše v rootu)

```
index.html                     ← landing (sedm kapitol)
kapitola1.html                 ← rozcestník Kapitoly 1
kapitola1-klicova-slova.html
kapitola1-vyklad.html
kapitola1-karticky.html
kapitola1-testik.html
kapitola1-zdroje.html
kapitola2.html                 ← rozcestník Kapitoly 2
kapitola2-klicova-slova.html
kapitola2-vyklad.html
kapitola2-karticky.html
kapitola2-testik.html
kapitola2-zdroje.html
style.css                      ← design (Lingua brand)
app.js                         ← Quiz / TF / Fill / Leitner / Tisk
logo.png                       ← Lingua sova
.nojekyll                      ← pojistka proti Jekyll
```

Celkem **17 souborů**.

## Navigace

- **Landing** (`index.html`) → 7 karet kapitol
- **Rozcestník kapitoly** → hero + 5 dlaždic na podstránky
- **Podstránka** → sticky horní subnav (5 odkazů na ostatní podstránky) + obsah + dolní prev/next

Žák může:
1. Z landingu skočit na kteroukoli kapitolu
2. Z rozcestníku do kterékoli z 5 sekcí
3. Mezi sekcemi přepínat sticky nahoře nebo prev/next dole

## Hotové

- **Kapitola 1** Od vesmíru k Zemi — 15 témat, 30 CLIL, 22 testů, 3 nákresy
- **Kapitola 2** Země jako místo — 7 témat, 30 CLIL, 20 testů, 2 nákresy

## Funkce

- 3-box Leitnerův systém s ukládáním pokroku do localStorage
- Tlačítko **Vytisknout kartičky** (oboustranný layout pro fyzický tisk)
- 3 typy testů: výběr odpovědi, pravda/nepravda, doplňovačka

---

© ZŠ Lingua Universal Litoměřice
