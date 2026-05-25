# Certifications PDF - content model

Date: 2026-05-25

## Purpose

This file freezes the content decisions for the auxiliary certifications PDF before layout starts. The machine-readable source is `reports/certifications-pdf-content-model.json`.

## Source and reference

- Data source: `codex/certifications-integration:certifications/data/certifications.js`
- Reference style PDF: `/Users/marcrodriguez/Desktop/web lab/clients_guide_lab.pdf`
- Intended output: `output/pdf/universal_enclosures_certifications_guide.pdf`
- Language for first build: English, matching the reference guide and the current certification dataset.

## Document copy

- Cover kicker: Universal Enclosures
- Title: Certifications guide
- Subtitle: Universal Enclosures - PanelSeT and ClimaSys ranges
- Source line: Source: UE 2026 Catalogue, Certifications matrix, page 610.
- Footer: CONFIDENTIAL - Schneider Electric Universal Enclosures Laboratories. Unauthorized distribution is not permitted.

Overview copy:

> This guide consolidates the certification matrix for Universal Enclosures into a product-by-product reference. It is designed as an auxiliary document for commercial and technical review, not as a replacement for official certificates or declarations of conformity.

## Metrics

| Metric | Count |
| --- | ---: |
| Product/range rows | 29 |
| Certification entries | 71 |
| Active certification bodies | 8 |
| Standard groups | 6 |
| Families | 3 |
| Rows without listed certification | 1 |

## Families

| Family | Products | Cert entries | Product codes |
| --- | ---: | ---: | --- |
| PanelSeT - Steel and Stainless Steel Enclosures | 15 | 46 | SBM, S3D, CRN, S3DEX, S3HF, S3HD, S3CM, SM, SFN, SFHD, PrismaSeT HD, SBX, S3X, SMX, SFX |
| PanelSeT - Polyester Enclosures | 9 | 20 | TBS/TBP, PLS, PLM, PLA, PLAT, PLAZ, PLAZT, PLD, PHD |
| ClimaSys | 5 | 5 | CV, CU, CE, CR, CC |

## Active certification bodies

| Body | Cert entries | PDF logo treatment |
| --- | ---: | --- |
| Bureau Veritas | 16 | assets/CERTIFICACIONS copy/BUREAU VERITAS/bureau-veritas-logo-1024x1024.jpg |
| LCIE (Bureau Veritas) | 2 | assets/processed/certification_logos/lcie_logo.png |
| Bureau Veritas Marine Division | 8 | assets/CERTIFICACIONS copy/BUREAU MARITIME/bureau_veritas_marine_logo.png |
| TUV Rheinland Group | 2 | assets/processed/certification_logos/tuv_rheinland_logo_padded.png |
| Underwriters Laboratories | 23 | assets/CERTIFICACIONS copy/UL/ul-logo-png-transparent.png |
| DNV-GL | 4 | assets/CERTIFICACIONS copy/DNV-GL/DNV-GL-Logo-Vector.svg-.png |
| Dekra | 15 | assets/processed/certification_logos/dekra_logo.png |
| Asefa | 1 | assets/CERTIFICACIONS copy/ASEFA/Disseny sense títol-16.png |

## Gaps and treatments

LCIE, Dekra, and TUV Rheinland are now resolved through normalized processed logo assets. Directive and Certified bodies remain text references, not logo gaps.

| Type | Item | Treatment |
| --- | --- | --- |
| Standard group logo | Directive | Use compact text badge. |
| Standard group logo | Certified bodies | Use compact text badge. |
| Product certification | PLD | No listed certification in the source table. |
| Product image | PLD | Use fallback assets/PANELSET_INSULATED.png |
| Product image | CV | Use fallback assets/processed/product_climasys_centered.png |

## Product catalogue content

| Product | Family | Certs | Bodies | Standards | Chosen PDF image |
| --- | --- | ---: | --- | --- | --- |
| SBM | PanelSeT - Steel and Stainless Steel Enclosures | 3 | TUV Rheinland Group, Underwriters Laboratories, DNV-GL | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/TUV RHEINLAND/SBM.jpg |
| S3D | PanelSeT - Steel and Stainless Steel Enclosures | 5 | LCIE (Bureau Veritas), Dekra, Underwriters Laboratories, Bureau Veritas Marine Division, DNV-GL | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU MARITIME/S3D - S'ha editat.png |
| CRN | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Dekra, Underwriters Laboratories, DNV-GL | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/DECRA/CRN copy.webp |
| S3DEX | PanelSeT - Steel and Stainless Steel Enclosures | 2 | Underwriters Laboratories, LCIE (Bureau Veritas) | UL 508A, CAN/CSA C22.2 No. 14, 2014/34/UE, EN 60079-0, EN 60079-7, EN 60079-3, EN 60529 | assets/CERTIFICACIONS copy/UL/S3DEX.webp |
| S3HF | PanelSeT - Steel and Stainless Steel Enclosures | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/S3HF.jpg |
| S3HD | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Dekra, Underwriters Laboratories, Bureau Veritas | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, IEC 61439-5, ISO 12944-6, IEC 61969-3 | assets/CERTIFICACIONS copy/DECRA/S3HD copy.jpg |
| S3CM | PanelSeT - Steel and Stainless Steel Enclosures | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/S3CM.jpg |
| SM | PanelSeT - Steel and Stainless Steel Enclosures | 4 | Bureau Veritas, Dekra, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/SM.png |
| SFN | PanelSeT - Steel and Stainless Steel Enclosures | 5 | Bureau Veritas, Dekra, Underwriters Laboratories, DNV-GL | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements, IEC 61439-1, IEC 61439-2 | assets/CERTIFICACIONS copy/BUREAU VERITAS/SFN.jpg |
| SFHD | PanelSeT - Steel and Stainless Steel Enclosures | 5 | Bureau Veritas, Dekra, Underwriters Laboratories | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, IEC 61439-5, ISO 12944-6, IEC 61969-3, IEC 61439-1, IEC 61439-2 | assets/CERTIFICACIONS copy/BUREAU VERITAS/SFHD.jpg |
| PrismaSeT HD | PanelSeT - Steel and Stainless Steel Enclosures | 2 | Dekra, Asefa | IEC 62208, IEC 61439-1, IEC 61439-2 | assets/CERTIFICACIONS copy/ASEFA/PrismaSet-6300_sans-habillage-IC-980x560.jpg |
| SBX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/SBX.png |
| S3X | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/S3X.jpg |
| SMX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/SMX.webp |
| SFX | PanelSeT - Steel and Stainless Steel Enclosures | 3 | Bureau Veritas, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/SFX.webp |
| TBS/TBP | PanelSeT - Polyester Enclosures | 2 | TUV Rheinland Group, Underwriters Laboratories | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/TBP.webp |
| PLS | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Underwriters Laboratories | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLS.webp |
| PLM | PanelSeT - Polyester Enclosures | 4 | Bureau Veritas, Dekra, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLM.jpg |
| PLA | PanelSeT - Polyester Enclosures | 4 | Bureau Veritas, Dekra, Underwriters Laboratories, Bureau Veritas Marine Division | IEC 62208, UL 508A, CAN/CSA C22.2 No. 14, Certified body requirements | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLA.webp |
| PLAT | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | IEC 62208 | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAT.jpg |
| PLAZ | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | IEC 62208 | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAZ.webp |
| PLAZT | PanelSeT - Polyester Enclosures | 2 | Bureau Veritas, Dekra | IEC 62208 | assets/CERTIFICACIONS copy/BUREAU VERITAS/PLAZT.webp |
| PLD | PanelSeT - Polyester Enclosures | 0 | None listed | None listed | assets/PANELSET_INSULATED.png |
| PHD | PanelSeT - Polyester Enclosures | 2 | Dekra, Bureau Veritas | IEC 62208, IEC 61439-5, ISO 12944-6, IEC 61969-3 | assets/CERTIFICACIONS copy/DECRA/PHD copy.webp |
| CV | ClimaSys | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/processed/product_climasys_centered.png |
| CU | ClimaSys | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/Clima Sys CU.webp |
| CE | ClimaSys | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/CE.webp |
| CR | ClimaSys | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/ClimaSysCR.webp |
| CC | ClimaSys | 1 | Underwriters Laboratories | UL 508A, CAN/CSA C22.2 No. 14 | assets/CERTIFICACIONS copy/UL/ClimaSysCC.webp |

## Integrity checks

- Product/range rows: 29 / 29
- Certification entries: 71 / 71
- Active bodies: 8 / 8
- Excluded body: Laboratorio Oficial J.M. Madariaga
- Product without listed certification: PLD
- Products using fallback images: PLD, CV

## Next build rules

1. Create tmp/pdfs/certifications-guide/image-cache for WEBP and SVG conversions before embedding images.
2. Use ReportLab to build the A4 PDF under output/pdf/.
3. Render the PDF pages to tmp/pdfs/certifications-guide/rendered with pdftoppm and visually inspect for clipping or overlap.
4. Do not include LOM/Madariaga in the active certification-body legend.
5. Include PLD as a product row with the text No listed certification in the source table.
