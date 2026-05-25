# Certifications PDF editable workflow

## Decision

The canonical master remains the generated PDF pipeline:

- Content source: `reports/certifications-pdf-content-model.json`
- Layout tuning source: `reports/certifications-pdf-layout-overrides.json`
- PDF generator: `scripts/build_certifications_pdf.py`
- Final PDF: `output/pdf/universal_enclosures_certifications_guide.pdf`

This avoids manual edits drifting away from the catalogue data. Fine movements should be made in the layout overrides JSON, then the PDF should be regenerated.

## Editable handoff

The PPTX handoff is:

- `output/editable/universal_enclosures_certifications_guide_canva_handoff_a4.pptx`

It is A4 portrait and contains one embedded reference image per final PDF page. It is useful for Canva or PowerPoint visual review, comments, and page-level annotation.

Important limitation: this PPTX is not the canonical object-layer source. For precise movements of logos, columns, or spacing, edit `reports/certifications-pdf-layout-overrides.json` instead.

## Canva workflow

Use this order:

1. Import `output/pdf/universal_enclosures_certifications_guide.pdf` into Canva when the goal is manual object editing. Canva may split PDF text and images into editable elements, but this conversion is not guaranteed to be perfectly faithful.
2. Import `output/editable/universal_enclosures_certifications_guide_canva_handoff_a4.pptx` when the goal is visual review, comments, page replacement, or annotation.
3. Mirror any accepted precise changes in `reports/certifications-pdf-layout-overrides.json`, then rebuild the PDF.

## Common fine-tuning edits

Move a cover certification logo:

```json
"tuv-rheinland": {
  "cover": {
    "dx": 0,
    "dy": 2,
    "scale": 1
  }
}
```

Increase the reserved area for page 2 family counts:

```json
"overview": {
  "familyCountReserveWidth": 118
}
```

Change the cover logo row:

```json
"coverBodyLogoRow": {
  "topY": 174,
  "logoWidth": 48,
  "logoHeight": 30,
  "gap": 10
}
```

Change product sheet certification logo size:

```json
"productSheets": {
  "certBodyLogoWidth": 22,
  "certBodyLogoHeight": 13
}
```

## Rebuild commands

Use the bundled Python runtime because it has the PDF dependencies:

```bash
/Users/marcrodriguez/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/build_certifications_pdf.py
```

Render the PDF pages for QA:

```bash
rm -rf tmp/pdfs/certifications-guide/rendered
mkdir -p tmp/pdfs/certifications-guide/rendered
pdftoppm -png -r 150 output/pdf/universal_enclosures_certifications_guide.pdf tmp/pdfs/certifications-guide/rendered/page
```

Rebuild the Canva / PowerPoint handoff:

```bash
/Users/marcrodriguez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/build_certifications_editable_pptx.mjs
```

## QA gate

Before treating a version as final:

- Rebuild the PDF.
- Render all pages to PNG.
- Confirm the build report has `warnings: []`.
- Confirm `badgeLabelsUsed: []`.
- Confirm `logoOverridesUsed` includes `dekra`, `lcie`, and `tuv-rheinland`.
- Review the rendered PNG pages or contact sheet for clipped logos, overlaps, and footer/header consistency.
