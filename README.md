
# Interaktivni dashboard “Prometne nesreće i rizične zone”

Ovaj projekt je web dashboard za **vizualnu analizu prometnih nesreća** kroz prostor (karta), vrijeme (trendovi) i atribute nesreće (uzrok, težina, područje). Aplikacija omogućuje korisniku da brzo pronađe **hotspotove/rizične zone**, prepozna obrasce (npr. dani i sati s najvećim brojem nesreća) te istraži kako se uzroci i težine mijenjaju kroz filtre i povezane prikaze.

## Značajke
- Interaktivna **karta** nesreća (točke ili agregirano) s tooltip detaljima.
- **Trend kroz vrijeme** (linijski graf) s odabirom vremenskog raspona (date range / brush).
- **Heatmap** (dan u tjednu × sat) za otkrivanje rizičnih termina.
- **Bar chart** najčešćih uzroka (Top N) s filtriranjem klikom.
- **Filteri**: raspon datuma, težina, uzrok, regija/grad.
- **Cross-filtering**: odabir na jednom prikazu filtrira i ažurira sve ostale prikaze.
- Prikaz ključnih metrika (opcionalno): ukupno nesreća u odabiru, najčešći uzrok, najrizičniji sat.

## Korišteni podaci
Projekt očekuje dataset u **CSV** ili **JSON** formatu (npr. otvoreni podaci, javne statistike, ili pripremljeni skup). Minimalno su potrebni:
- `dateTime` — datum i vrijeme nesreće
- `lat`, `lon` — geografske koordinate
- `severity` — težina (npr. light/serious/fatal ili slične kategorije)
- `cause` — uzrok (kategorija)
- `region` / `city` — administrativna pripadnost (opcionalno, ali korisno)

Aplikacija pri učitavanju iz `dateTime` računa izvedene atribute:
- `hour` (0–23)
- `dayOfWeek` (Mon–Sun)
- `monthKey` (npr. 2024-06)

### Minimalni schema (JSON primjer)
```json
{
  "id": "string",
  "dateTime": "2024-06-15T21:35:00",
  "lat": 43.508,
  "lon": 16.439,
  "severity": "light|serious|fatal",
  "cause": "speeding|alcohol|priority|...",
  "region": "Split-Dalmatia",
  "city": "Split"
}
````

## Tehnologije

* Node.js + npm
* React (Vite) + JavaScript
* Leaflet + react-leaflet (karta)
* Recharts (linijski i bar grafovi)
* PapaParse (učitavanje CSV-a)
* (Opcionalno) @nivo/heatmap (heatmap) ili custom heatmap komponenta

## Pokretanje projekta

1. Kloniraj repozitorij:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Instaliraj ovisnosti:

   ```bash
   npm install
   ```

3. Pokreni aplikaciju u development modu:

   ```bash
   npm run dev
   ```

4. Otvori u pregledniku (Vite će ispisati URL u konzoli), najčešće:

   * `http://localhost:5173`

## Build i preview

1. Napravi production build:

   ```bash
   npm run build
   ```

2. Pokreni preview:

   ```bash
   npm run preview
   ```

## Konfiguracija podataka

### Opcija A: JSON

* Stavi datoteku u `src/data/accidents.json`
* U loaderu učitaj tu datoteku (npr. fetch ili import)

### Opcija B: CSV

* Stavi datoteku u `src/data/accidents.csv`
* U loaderu koristi PapaParse za parsiranje

> Preporuka: za razvoj koristi manji `accidents_sample.csv/json` da sve radi brzo, a kasnije zamijeni pravim datasetom.

## Korištenje

1. Otvori dashboard.
2. Filtriraj po **rasponu datuma**, uzroku, težini i području.
3. Klikni na **uzrok** u bar chartu kako bi filtrirao sve prikaze na taj uzrok.
4. Odaberi period na trend grafu (date range/brush) i prati kako se mijenjaju:

   * hotspotovi na karti
   * heatmap intenzitet
   * rangiranje uzroka
5. Hover na elemente prikaza (točka/ćelija/stupac) za tooltip i detalje.

## Struktura projekta (predložena)

```
traffic-dashboard/
│
├── public/
│
├── src/
│   ├── data/
│   │   ├── accidents_sample.csv
│   │   └── accidents_sample.json
│   │
│   ├── lib/
│   │   ├── dataLoaders.js      # učitavanje CSV/JSON
│   │   ├── transforms.js       # parsiranje i izvedeni atributi
│   │   └── aggregations.js     # groupByMonth, heatmap matrix, groupByCause...
│   │
│   ├── state/
│   │   ├── filtersReducer.js   # globalni filter state
│   │   └── selectors.js        # applyFilters + pomoćne funkcije
│   │
│   ├── components/
│   │   ├── FiltersPanel/
│   │   ├── KPIHeader/
│   │   ├── MapView/
│   │   ├── TimeSeriesChart/
│   │   ├── HeatmapChart/
│   │   └── CausesBarChart/
│   │
│   ├── pages/
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

## Napomene (performanse i buduće nadogradnje)

* Ako dataset ima puno zapisa, karta s velikim brojem točaka može biti spora:

  * koristiti klasteriranje ili agregaciju (grid/hexbin).
* Moguće nadogradnje:

  * “Compare mode” (usporedba 2 perioda)
  * export prikaza (PNG/CSV)
  * ponderirani rizik (teže nesreće povećavaju score zone)


