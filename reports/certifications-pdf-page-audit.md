# Certifications PDF - page-by-page visual audit

Date: 2026-05-25

PDF audited:

- `output/pdf/universal_enclosures_certifications_guide.pdf`

Rendered QA files:

- `tmp/pdfs/certifications-guide/rendered/page-01.png` to `page-15.png`
- `tmp/pdfs/certifications-guide/contact-sheet.png`

## Corrections applied before final audit

- Replaced text badges for LCIE and Dekra with real logo assets.
- Normalized TUV Rheinland into a padded logo asset so it no longer clips at the top.
- Replaced product-sheet body badges with small certification-body logos.
- Moved Directive and Certified bodies out of the logo grid and into a textual reference section.
- Fixed the family summary overlap on page 2.
- Compacted the annex so the document returns to 15 pages with no sparse trailing page.

## Logo source audit

| Body | Final treatment |
| --- | --- |
| Bureau Veritas | Existing source logo. |
| LCIE (Bureau Veritas) | Normalized from `assets/LCIE (BUREAU VERITAS)/LCIE BUREAU VERITAS LOGO.jpg`. |
| Bureau Veritas Marine Division | Existing source logo. |
| TUV Rheinland Group | Normalized padded asset from the existing TUV source logo. |
| Underwriters Laboratories | Existing source logo. |
| DNV-GL | Existing source logo. |
| Dekra | Normalized from `assets/DEKRA_Logo-Green-RGB.png`. |
| Asefa | Existing source logo. |

## Page audit

| Page | Section | Audit result |
| ---: | --- | --- |
| 1 | Cover | OK. All 8 active body logos render as logos, not badges. LCIE and Dekra are present. TUV Rheinland is padded and no longer clipped. Logo row is centered. |
| 2 | Overview | OK. Family name and count no longer overlap. Planned-structure wording no longer references missing-logo badges. |
| 3 | Standards referenced | OK. IEC, UL/CSA, EN and ISO logos render. Directive and Certified bodies are textual matrix references, not fake logo gaps. |
| 4 | Certification bodies | OK. LCIE and Dekra logos render in the active legend. Madariaga remains excluded with the correct reason. No clipping detected. |
| 5 | Product catalogue | OK. Steel and start of Polyester catalogue rows fit inside the page grid. No text overlap detected. |
| 6 | Product catalogue | OK. Polyester and ClimaSys catalogue rows fit. PLD remains included as no listed certification. |
| 7 | Product sheets | OK. SBM, S3D and CRN sheets use small logos instead of body badges. Footnote spacing remains readable. |
| 8 | Product sheets | OK. S3DEX, S3HF, S3HD and S3CM are aligned and not clipped. |
| 9 | Product sheets | OK. SM, SFN and SFHD fit with body logos and certification rows. |
| 10 | Product sheets | OK. PrismaSeT HD, SBX, S3X and SMX fit. |
| 11 | Product sheets | OK. SFX and start of Polyester section fit; no collision between family heading and product sheet. |
| 12 | Product sheets | OK. PLA, PLAT, PLAZ and PLAZT remain compact and aligned. |
| 13 | Product sheets | OK. PLD, PHD, CV, CU and CE fit. PLD no-certification state is preserved. |
| 14 | Product sheets | OK. CR and CC fit cleanly; page is intentionally sparse because it closes the product-sheet section. |
| 15 | Annex | OK. Notes, logo/reference treatments, image conversion summary and integrity checks fit on one page. |

## Automated checks

- PDF pages: 15.
- Rendered PNG pages: 15.
- Blank pages detected: 0.
- Build warnings: 0.
- Body logo overrides used: `dekra`, `lcie`, `tuv-rheinland`.
- Integrity markers present in extracted text: `29 / 29`, `71 / 71`, `PLD`, `CV`, and `Madariaga`.

## Residual design note

The product-sheet certification-body logos are intentionally small to preserve the compact one-document format. If the next iteration prioritizes logo prominence over density, the product-sheet table should reserve a wider certification-body column or reduce the number of product blocks per page.
