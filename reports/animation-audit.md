# UE LABS Animation Audit

Source reviewed: `UE_LABS_Presentation_2025_Redesigned.pptx`

Important source note: the current PPTX contains 13 slides, each built from a full-slide raster image generated from the panoramic PDF. The animated web rebuild uses the PPTX slide images as visual source of truth, then reconstructs the visible content as separated HTML layers for motion.

## Global Motion System

- Navigation model: one full-screen HTML section per slide, scroll-snap, keyboard controls and previous/next controls.
- Runtime model: the user can also use Play/Pause autoplay and a bottom progress rail.
- Slide transition: active slide reveals with background scale-down, left shade wipe, title fade/slide and element-specific stagger.
- Element lifecycle: inactive slide elements fade and translate down; active slide elements restore opacity/position. This gives both appearance and disappearance behavior without relying on PowerPoint timings.
- Timing baseline: 720-900 ms for major elements, 120 ms stagger increments for grouped elements.
- Reduced motion: CSS honors `prefers-reduced-motion`.

## `design.md` Applied Scope

The added `design.md` was used only for construction and transition behavior, not for typography or color replacement.

- Applied full-bleed gallery construction to cover, lab and closing scenes.
- Re-centered hero-style slides so the first and last scenes behave like cinematic section openers.
- Converted badges, controls and compact callouts to lozenge geometry.
- Kept content containers visually light and transparent, with 10px radius only on featured card-like groups.
- Added direction-aware slide states, so elements exit upward or downward depending on navigation direction.
- Added matrix cell cascade timing for a more deliberate reveal on the standards slide.
- Added an `is-visible` state so partially visible slides do not become blank during fast keyboard/control navigation.

## Slide-by-Slide Element Plan

| Slide | Main elements | Animation treatment |
|---:|---|---|
| 1 | Hero photo, shade, logo, title, presenter | Photo zoom-out, shade wipe, title stack reveal, accent rule draw |
| 2 | Map, intro note, 4 metrics, UL callout | Map reveal, metric count-up, staggered metric cards, callout late reveal |
| 3 | Five-step organization chain | Header reveal, pathway nodes cascade left-to-right, connectors draw |
| 4 | Governance hierarchy, lab badges | Lead node first, explanatory line second, department nodes, then lab badges |
| 5 | Seven mission responsibilities | Value-chain cards reveal in reading order with final synthesis line |
| 6 | Network map and lab list | Map reveal/scale plus lab badges staggered by SU, ML, KP |
| 7 | Capellades photo, UL certificate, badges | Photo zoom-out, side panel wipe, badges stagger, certificate reveal |
| 8 | Sarre-Union photo and lab badge | Same lab-hero system as slide 7, blue lab accent |
| 9 | Molins de Rei photo, lab badge, ClimaSys products | Split photo/product scene; lab panel reveals first, product cluster enters as a second motion layer |
| 10 | UL panel and standards matrix | UL panel reveal, matrix cells cascade, standards remain readable |
| 11 | Product hero image and 3 product cards | Background product image reveal, product cards staggered left-to-right |
| 12 | Technical environment field, statement, themes | Technical background scale, statement reveal, theme cards stagger |
| 13 | Closing background, logo, headline, line | Closing hero reveal, accent line draw |

## Files Created

- `web/index.html`: semantic slide structure and separated animatable elements.
- `web/styles.css`: layout, responsive behavior and transition states.
- `web/app.js`: active-slide detection, keyboard navigation, autoplay, progress rail and count-up metrics.

## Design.md Status

No `design.md` file was present in the workspace at implementation time. The current motion system is isolated in `web/styles.css` and `web/app.js`, so the transition construction from `design.md` can be merged later without changing the content model, color system or typography.
