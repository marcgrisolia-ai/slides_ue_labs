# Correccions aplicades - UE Labs

Data: 2026-05-21  
Abast: versió anglesa i sincronització de la versió francesa.

## Fonts revisades

- Carpeta `assets/CORRECCIO/`: captures i anotacions de correcció.
- Fitxer `assets/UE_2026_CATALOGUE.pdf`: referència de nomenclatura de famílies de producte.
- Correccions visuals i de coherència demanades a la conversa.

## Correccions generals

- S'ha aplicat Poppins com a tipografia global.
- S'ha actualitzat el copyright del footer a 2026.
- S'ha mantingut el footer com a element inicial de construcció, coordinat amb l'aparició del títol.
- S'ha unificat l'animació dels títols perquè apareguin com a bloc, seguint el comportament de les slides de laboratoris.
- S'ha eliminat l'estètica antiga de cercles de colors SU/ML/KP i s'ha substituït per cercle blanc, contorn Schneider green i inicials verdes.
- La mateixa estètica s'ha estès a les slides de KP, ML, Sarre-Union i a qualsevol aparició equivalent dels identificadors de laboratori.
- A la slide 10 s'han eliminat els codis cromàtics blau/taronja/lila dels headers SU/ML/KP; passen a un estil neutre verd coherent amb Schneider.

## Correccions per slide

### Slide 1

- S'ha substituït la identificació personal per l'àmbit organitzatiu:
  - `Universal Enclosures LoB`
  - `Customer Satisfaction & Quality`

### Slide 2

- `Lab Employees` passa a un concepte més correcte i menys literal:
  - EN: `Lab team`
  - FR: `Équipe des laboratoires`
- `3012 Tests done in 2021` passa a `+3000 Tests / year`.
- S'ha afegit suport tècnic al comptador perquè mostri el prefix `+`.
- S'ha incorporat la constel·lació dels tres laboratoris i s'ha ajustat a la nova estètica de cercles.

### Slide 4

- S'ha actualitzat l'estètica dels identificadors SU/ML/KP a cercle blanc + verd Schneider.
- S'ha corregit la jerarquia visual del model de governança i la separació amb els laboratoris inferiors.
- S'han retirat els accents de color heretats que trencaven la coherència Schneider.

### Slide 7

- `Coffrets acier PanelSeT` / variants antigues passen a `PanelSeT Steel Enclosures`.
- S'ha reforçat el missatge de Capellades com a verificació de producció de `PanelSeT Steel Enclosures`.
- S'ha preservat la referència `UL CTDP` i `DA307`.
- La versió francesa manté els noms de producte com a marques i tradueix només el discurs descriptiu.

### Slide 8

- S'ha complementat Sarre-Union amb l'àmbit de verificació PanelSeT.
- S'han afegit tres blocs de producte:
  - `PanelSeT Steel Enclosures`
  - `PanelSeT Stainless-Steel Enclosures`
  - `Specific Applications Enclosures`

### Slide 9

- S'ha evitat que Molins de Rei sembli limitat a tres productes concrets.
- El títol passa a expressar un abast més ampli:
  - EN: `ClimaSys and PanelSeT Insulated validation`
  - FR: `ClimaSys et validation PanelSeT Insulated`
- S'ha afegit `PanelSeT Insulated` com a quart exemple representatiu.
- S'ha mantingut la idea que els productes 3D són exemples, no el catàleg complet validat.

### Slide 10

- S'han incorporat els logos IEC, ISO, EN, UL i CSA.
- S'han ajustat logos, rodones, alineació i proximitat amb els acrònims.
- Els headers SU/ML/KP de la matriu passen a verd neutre.
- Els valors concrets de la matriu de normes no s'han modificat perquè la correcció indicava revisió posterior amb Fred/Alfaro.

### Slide 11

- `Thalassa` / `PanelSeT PLM` passa a `PanelSeT Insulated Enclosures`.
- `Spacial` / `PanelSeT SM` passa a `PanelSeT Steel Enclosures`.
- `ClimaSys` passa a `ClimaSys Thermal Management System`.
- S'ha actualitzat el subtítol i les descripcions de les tres targetes.

### Slide 12

- S'ha actualitzat el discurs perquè parli de `PanelSeT enclosures` i `ClimaSys thermal management solutions`, sense reduir-ho a SM/PLM.
- S'ha revisat la targeta de materials per parlar d'acer, acer inoxidable i coffrets aïllants.
- S'ha afegit subanimació de les quatre targetes verdes perquè puguin ampliar-se seqüencialment per clic.

## Versió francesa

- S'han portat les correccions de contingut de l'anglès a `fr/index.html`.
- S'ha sincronitzat la versió francesa publicada a:
  - `fr/`
  - `docs/fr/`
  - `web/fr/`
- S'han sincronitzat també `styles.css` i `app.js` perquè la versió francesa hereti la mateixa tipografia, animacions, estils de cercles, matriu i suport de comptadors.
- S'han preservat com a noms de producte:
  - `PanelSeT Steel Enclosures`
  - `PanelSeT Stainless-Steel Enclosures`
  - `Specific Applications Enclosures`
  - `PanelSeT Insulated`
  - `PanelSeT Insulated Enclosures`
  - `ClimaSys Thermal Management System`

## No aplicat expressament

- Observacions de proporcions i problemes derivats de sortir de fullscreen: obviades segons instrucció.
- Modificació dels valors tècnics de la matriu de normes de la slide 10: pendent de revisió amb Fred/Alfaro.
