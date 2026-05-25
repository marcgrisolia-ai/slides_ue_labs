# Certifications PDF - asset audit

Date: 2026-05-25

## Reference document

Primary reference found:

- `/Users/marcrodriguez/Desktop/web lab/clients_guide_lab.pdf`
- Title metadata: `clients_guide_lab`
- Pages: 25
- Page size: A4 portrait, 596 x 842 pt
- Producer: Skia/PDF m147 Google Docs Renderer

Visual rules extracted from the reference:

- White A4 portrait document.
- Large centered title page with minimal metadata.
- Black typography, generous margins and high whitespace.
- Simple tables with thin gray row rules and boxed header rows.
- Confidential footer on every page.
- No dark web styling, no heavy visuals, no decorative cards.
- Content first: short intro, summary tables, reference standards, catalogue index, then detailed entries.

Secondary related files found:

- `/Users/marcrodriguez/Desktop/web lab/lab-web-last/output/pdf/clients_guide_tests_laboratory_client_testing (1).pdf`
- `/Users/marcrodriguez/Desktop/tfg/clients_guide_tests_laboratory_client_testing (1).pdf`
- `/Users/marcrodriguez/Documents/web lab copy/lab-tests-spa/public/assets/clients_guide_tests_laboratory_client_testing (1).pdf`

The primary reference should be used for style because it is the cleaner Google Docs rendered version.

## Data source

Certification data is currently available in Git branch:

- `codex/certifications-integration:certifications/data/certifications.js`

The current working tree branch does not have this file checked out, so the PDF build step should either:

- read the file from the integration branch with `git show`, or
- merge/copy `certifications/data/certifications.js` into the active working branch before generation.

Totals from the dataset:

| Metric | Count |
| --- | ---: |
| Product/range rows | 29 |
| Certification entries | 71 |
| Active certification bodies | 8 |
| Product assets mapped in dataset | 65 |
| Product rows without listed certification | 1 |
| Products with certification but no own image | 1 |

## Certification bodies

| Body | Certifications | Local logo | PDF treatment |
| --- | ---: | --- | --- |
| Bureau Veritas | 16 | `assets/CERTIFICACIONS copy/BUREAU VERITAS/bureau-veritas-logo-1024x1024.jpg` | Use logo. |
| LCIE (Bureau Veritas) | 2 | Missing | Use text badge, or crop from UE catalogue page 610 if quality is acceptable. |
| Bureau Veritas Marine Division | 8 | `assets/CERTIFICACIONS copy/BUREAU MARITIME/bureau_veritas_marine_logo.png` | Use logo. |
| TUV Rheinland Group | 2 | `assets/CERTIFICACIONS copy/TUV RHEINLAND/tuev_rheinland_logo_core_4_3.jpg` | Use logo. |
| Underwriters Laboratories | 23 | `assets/CERTIFICACIONS copy/UL/ul-logo-png-transparent.png` | Use logo. |
| Laboratorio Oficial J.M. Madariaga | 0 | Missing | Exclude from active body legend and product sheets. Mention only if needed in source notes. |
| DNV-GL | 4 | `assets/CERTIFICACIONS copy/DNV-GL/DNV-GL-Logo-Vector.svg-.png` | Use logo. |
| Dekra | 15 | Missing | Use text badge, or crop from UE catalogue page 610 if quality is acceptable. Product images exist under `DECRA`. |
| Asefa | 1 | `assets/CERTIFICACIONS copy/ASEFA/Disseny sense títol-16.png` | Use logo. |

Body-logo gaps to resolve in implementation:

- `LCIE`: no standalone logo in the certification asset folder.
- `Dekra`: no standalone logo in the certification asset folder; source folder is named `DECRA` and contains product images.
- `LOM/Madariaga`: no certifications, so do not include as an active certifier.

## Standard logos

| Standard group | Logo assets | Status | PDF treatment |
| --- | --- | --- | --- |
| IEC | `assets/STANDARD_ASSETS/IEC.png` | Exists | Use logo. |
| UL / CSA | `assets/STANDARD_ASSETS/ul-logo-png-transparent.png`, `assets/STANDARD_ASSETS/CSA.png` | Both exist | Use paired logos. |
| EN | `assets/STANDARD_ASSETS/EN-standard.png` | Exists | Use logo. |
| ISO | `assets/STANDARD_ASSETS/ISO-Logo-1.png` | Exists | Use logo. |
| Directive | none | Missing by nature | Use a text badge: `Directive`. |
| Certified bodies | none | Missing by nature | Use a text badge: `Certified bodies`. |

Standards/functions in scope:

- Empty assemblies for low-voltage switchgear: IEC 62208.
- Standards for industrial equipment and UL classification: UL 508A and CAN/CSA C22.2 No. 14.
- Marine environment classification or approval: certified body requirements.
- Potentially explosive atmosphere: 2014/34/UE, EN 60079-0, EN 60079-7, EN 60079-3, EN 60529.
- Outdoor heavy-duty enclosures: IEC 61439-5, ISO 12944-6, IEC 61969-3.
- Low-voltage switchgear and controlgear assemblies: IEC 61439-1, IEC 61439-2.

## Product image map

Use the preferred asset when available. For PDF generation, convert WEBP to PNG/JPEG in a temporary cache before embedding if ReportLab cannot consume the source directly.

| Product | Family | Certs | Bodies | Preferred image | Fallback / issue |
| --- | --- | ---: | --- | --- | --- |
| SBM | PanelSeT - Steel and Stainless Steel Enclosures | 3 | TUV Rheinland, UL, DNV-GL | `assets/CERTIFICACIONS copy/TUV RHEINLAND/SBM.jpg` | - |
| S3D | PanelSeT - Steel and Stainless Steel Enclosures | 5 | LCIE, Dekra, UL, Bureau Veritas Marine, DNV-GL | `assets/CERTIFICACIONS copy/BUREAU MARITIME/S3D - S'ha editat.png` | LCIE and Dekra logos missing. |
| CRN | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Dekra, UL, DNV-GL | `assets/CERTIFICACIONS copy/DECRA/CRN copy.webp` | Dekra logo missing. |
| S3DEX | PanelSeT - Steel and Stainless Steel Enclosures | 2 | UL, LCIE | `assets/CERTIFICACIONS copy/UL/S3DEX.webp` | LCIE logo missing. |
| S3HF | PanelSeT - Steel and Stainless Steel Enclosures | 1 | UL | `assets/CERTIFICACIONS copy/UL/S3HF.jpg` | - |
| S3HD | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Dekra, UL, Bureau Veritas | `assets/CERTIFICACIONS copy/DECRA/S3HD copy.jpg` | Dekra logo missing. |
| S3CM | PanelSeT - Steel and Stainless Steel Enclosures | 1 | UL | `assets/CERTIFICACIONS copy/UL/S3CM.jpg` | - |
| SM | PanelSeT - Steel and Stainless Steel Enclosures | 4 | Bureau Veritas, Dekra, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SM.png` | Dekra logo missing. |
| SFN | PanelSeT - Steel and Stainless Steel Enclosures | 5 | Bureau Veritas, Dekra, UL, DNV-GL | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SFN.jpg` | Dekra logo missing. |
| SFHD | PanelSeT - Steel and Stainless Steel Enclosures | 5 | Bureau Veritas, Dekra, UL | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SFHD.jpg` | Dekra logo missing. |
| PrismaSeT HD | PanelSeT - Steel and Stainless Steel Enclosures | 2 | Dekra, Asefa | `assets/CERTIFICACIONS copy/ASEFA/PrismaSet-6300_sans-habillage-IC-980x560.jpg` | Dekra logo missing. |
| SBX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SBX.png` | - |
| S3X | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/S3X.jpg` | - |
| SMX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SMX.webp` | Note (3). |
| SFX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/SFX.webp` | Note (3). |
| TBS/TBP | PanelSeT - Polyester Enclosures | 2 | TUV Rheinland, UL | `assets/CERTIFICACIONS copy/UL/TBP.webp` | Note (1), only TBP. |
| PLS | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, UL | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLS.webp` | - |
| PLM | PanelSeT - Polyester Enclosures | 4 | Bureau Veritas, Dekra, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLM.jpg` | Dekra logo missing. |
| PLA | PanelSeT - Polyester Enclosures | 4 | Bureau Veritas, Dekra, UL, Bureau Veritas Marine | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLA.webp` | Dekra logo missing. |
| PLAT | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAT.jpg` | Dekra logo missing. |
| PLAZ | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAZ.webp` | Dekra logo missing. |
| PLAZT | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | `assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAZT.webp` | Dekra logo missing. |
| PLD | PanelSeT - Polyester Enclosures | 0 | none | none | Include as `No listed certification in source table`; use `assets/PANELSET_INSULATED.png` if an image is required. |
| PHD | PanelSeT - Polyester Enclosures | 2 | Dekra, Bureau Veritas | `assets/CERTIFICACIONS copy/DECRA/PHD copy.webp` | Dekra logo missing; note (2) and note (6). |
| CV | ClimaSys | 1 | UL | none | Use `assets/processed/product_climasys_centered.png`. |
| CU | ClimaSys | 1 | UL | `assets/CERTIFICACIONS copy/UL/Clima Sys CU.webp` | - |
| CE | ClimaSys | 1 | UL | `assets/CERTIFICACIONS copy/UL/CE.webp` | - |
| CR | ClimaSys | 1 | UL | `assets/CERTIFICACIONS copy/UL/ClimaSysCR.webp` | Note (5). |
| CC | ClimaSys | 1 | UL | `assets/CERTIFICACIONS copy/UL/ClimaSysCC.webp` | Alternate image: `ClimaSysCC copy.jpg`. |

## Family fallback images

Use only when a product has no direct asset or when a product image is visually unsuitable at PDF size.

| Family | Fallback image |
| --- | --- |
| PanelSeT - Steel and Stainless Steel Enclosures | `assets/processed/product_spacial_centered.png` or `assets/processed/STEEL_ENCLOSURES.jpg` |
| PanelSeT - Polyester Enclosures | `assets/PANELSET_INSULATED.png` or `assets/processed/product_thalassa_centered.png` |
| ClimaSys | `assets/processed/product_climasys_centered.png` or `assets/processed/climasys_products_from_pptx.png` |

## Source notes

These notes must appear in the affected product sheets and in the final annex.

| Note | Text |
| --- | --- |
| (1) | Only TBP. |
| (2) | ISO 12944-6 only applies to the PanelSeT enclosures. |
| (3) | Only for single-door versions. |
| (4) | EAC-compliant. |
| (5) | The insulated and aluminum resistance heaters of 12-24 V DC and 270-420 V AC are not certified. |
| (6) | Certificate by DEKRA. |

## Implementation requirements from this audit

1. Build a temporary image cache for PDF-safe PNG/JPEG conversions, especially WEBP sources.
2. Generate text badges for missing logos: LCIE, Dekra, Directive, Certified bodies.
3. Exclude LOM/Madariaga from active-body sections because it has 0 certification entries.
4. Include PLD as a product/range with no listed certification.
5. Include CV with UL certification and ClimaSys family fallback image.
6. Preserve all 71 certification entries and all 29 product/range rows.
7. Match the reference document style: A4 portrait, white background, thin rules, compact tables, confidentiality footer.
