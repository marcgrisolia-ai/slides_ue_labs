# Visual QA Report

- PPTX: `/Users/marcrodriguez/Desktop/SLIDE_SCHNEIDER/dist/UE_LABS_Presentation_2025_Redesigned.pptx`
- PDF: `/Users/marcrodriguez/Desktop/SLIDE_SCHNEIDER/dist/UE_LABS_Presentation_2025_Redesigned.pdf`
- Thumbnails: `/Users/marcrodriguez/Desktop/SLIDE_SCHNEIDER/dist/thumbnails`
- Export path: LibreOffice headless `impress_pdf_Export`, then `pdftoppm` thumbnail generation.
- Manual review: final thumbnail contact sheet inspected at `work/final_contact_sheet.png`.
- Fixed during QA: Slide 11 initially had the product-section label overlapping the product cards after LibreOffice PDF export; the duplicate label was removed and the wording was folded into the subtitle.

## Programmatic Checks

- Slide count in PPTX: 13
- Thumbnail count: 13
- Missing thumbnails: none
- Blank/near-blank thumbnails: none
- Out-of-bounds objects: 0

## Slide Review

| Slide | Detected issues | Text overflow checks | Image quality warnings | Layout issues | Recommended fixes | Fixed |
|---:|---|---|---|---|---|---|
| 1 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 2 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 3 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 4 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 5 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 6 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 7 | None | No rendered overflow observed; PPTX boundary check clean. | Uses extracted source imagery with dark grade; no stretched low-resolution image observed in final render. | None. | No action. | N/A |
| 8 | None | No rendered overflow observed; PPTX boundary check clean. | Uses extracted source imagery with dark grade; no stretched low-resolution image observed in final render. | None. | No action. | N/A |
| 9 | None | No rendered overflow observed; PPTX boundary check clean. | Uses extracted source imagery with dark grade; no stretched low-resolution image observed in final render. | None. | No action. | N/A |
| 10 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |
| 11 | First pass overlap fixed | No rendered overflow observed; PPTX boundary check clean. | Uses extracted source imagery with dark grade; no stretched low-resolution image observed in final render. | Resolved product label/card overlap from first render. | Keep final revised layout. | Yes |
| 12 | None | No rendered overflow observed; PPTX boundary check clean. | Uses extracted source imagery with dark grade; no stretched low-resolution image observed in final render. | None. | No action. | N/A |
| 13 | None | No rendered overflow observed; PPTX boundary check clean. | None. | None. | No action. | N/A |

## Residual Risk

- Speaker-note text is preserved for long standards descriptions; the visible matrix intentionally uses standard codes to keep the slide readable.
- Some lab photos from the source deck include legacy text overlays in the original raster, but the final treatment crops/darkens them so they do not compete with the rebuilt slide text.