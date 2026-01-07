# Interaktivni dashboard: Prometne nesreće i rizične zone

Web aplikacija (React + JavaScript) za istraživanje prometnih nesreća kroz **prostornu** i **vremensku** analizu, uz **interaktivne filtre** i **povezane prikaze (cross-filtering)**. Cilj je omogućiti korisniku da brzo prepozna **rizične zone (hotspotove)**, trendove i obrasce (dani/sati) te poveže to s atributima nesreće (uzrok, težina, područje).



## 1. Ciljevi projekta

### Što korisnik želi saznati
- **Gdje** se nesreće najčešće događaju (hotspotovi / rizične zone).
- **Kada** se događaju (trend kroz vrijeme, sezonalnost).
- Koji su **najčešći uzroci** i kako se mijenjaju po području i vremenu.
- Koji su **najrizičniji dani i sati** (obrasci ponašanja).

### Definicija “rizične zone”
Rizična zona je područje s povišenom **učestalošću nesreća** (gustoća/učestalost). Opcionalno se može koristiti i **ponderirani rizik** (npr. teže nesreće imaju veći ponder).



## 2. Tipovi podataka (semantika)

Podaci kombiniraju:
- **Temporal**: datum i vrijeme nesreće (npr. `dateTime`)
- **Spatial**: geografska lokacija (lat/lon) i/ili administrativna regija (grad/županija)
- **Quantitative**: broj nesreća (agregacije), broj ozlijeđenih (ako postoji)
- **Categorical (nominal/ordinal)**: uzrok, težina (razredi), tip sudionika, vremenski uvjeti (ovisno o datasetu)



## 3. Vizualizacije (idiomi) i opravdanje

Dashboard se sastoji od nekoliko povezanih prikaza:

1) **Karta (MapView)**  
   - Prikaz nesreća kao točaka ili agregirano (gustoća/heat).  
   - Odgovara na pitanje “**gdje**?”.

2) **Vremenska serija (TimeSeriesChart)**  
   - Linijski graf: broj nesreća kroz vrijeme (po danu/tjednu/mjesecu).  
   - Odgovara na “**kada i trend**?”.

3) **Heatmap (HeatmapChart)**  
   - Matrica **dan u tjednu × sat** s intenzitetom (broj nesreća).  
   - Odgovara na “**koji su rizični termini**?”.

4) **Bar chart uzroka (CausesBarChart)**  
   - Top uzroci (rangirano).  
   - Odgovara na “**zašto / koji uzroci dominiraju**?”.



## 4. Oznake (marks) i kanali (channels)

### Karta
- **Oznaka**: točka / ćelija agregacije
- **Kanali**:
  - Pozicija (x,y) = lat/lon (visoka točnost za prostor)
  - Boja = intenzitet (gustoća) ili težina (razredi)
  - Veličina = broj nesreća (kod agregacije)

### Vremenska serija
- **Oznaka**: linija
- **Kanali**: x = vrijeme, y = broj nesreća

### Heatmap
- **Oznaka**: ćelije (area)
- **Kanal**: boja = count (intenzitet)

### Bar chart
- **Oznaka**: stupci
- **Kanali**: duljina (y) = count, kategorija (x) = uzrok



## 5. Interakcije (ključni dio projekta)

Minimalni set interakcija:
- **Filter panel**:
  - raspon datuma
  - težina (multi-select)
  - uzrok (multi-select)
  - područje (grad/županija)
- **Tooltip** (detalji na zahtjev) na karti i grafovima
- **Cross-filtering**:
  - klik na uzrok (bar chart) uključuje/isključuje uzrok i filtrira sve prikaze
  - odabir raspona vremena (date range / brush) filtrira kartu, heatmap i uzroke
  - (opcionalno) selekcija područja na karti filtrira ostale prikaze



## 6. Tehnologije

- **React** (Vite) + **JavaScript**
- **Leaflet / react-leaflet** (karta)
- **Recharts** (linija + bar)
- (Opcionalno) **@nivo/heatmap** za heatmap, ili custom heatmap komponenta
- **PapaParse** (ako je input CSV)



## 7. Pokretanje projekta

### Preduvjeti
- Node.js (preporučeno LTS)
- npm

### Instalacija
```bash
npm install
# Prometne-nesrece-i-rizicne-zone
