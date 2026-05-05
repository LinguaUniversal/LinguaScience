# LinguaScience — Přírodopis 6. ročník

Interaktivní webová učebnice pro ZŠ Lingua Universal Litoměřice.

## Hotové kapitoly (3/7)

- **Kapitola 1** Od vesmíru k Zemi — 15 témat, 30 CLIL, 22 testů, 3 nákresy
- **Kapitola 2** Země jako místo — 7 témat, 30 CLIL, 20 testů, 2 nákresy
- **Kapitola 3** Vznik a podmínky života — 6 témat, 30 CLIL, 21 testů, 3 nákresy

## Struktura souborů (vše v rootu, 23 souborů)

```
index.html                          ← landing
kapitola{N}.html                    ← rozcestník (3×)
kapitola{N}-klicova-slova.html      ← 5 podstránek × 3 kapitoly = 15
kapitola{N}-vyklad.html
kapitola{N}-karticky.html
kapitola{N}-testik.html
kapitola{N}-zdroje.html
style.css   app.js   logo.png   .nojekyll
```

## Funkce

- 3-box Leitnerův systém s ukládáním pokroku do localStorage (per kapitola)
- Tlačítko **Vytisknout kartičky** (oboustranný layout pro fyzický tisk)
- 3 typy testů: výběr, P/N, doplňovačka

---

© ZŠ Lingua Universal Litoměřice
