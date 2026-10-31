---
name: Haute Editorial Elegance
colors:
  surface: '#fff8f0'
  surface-dim: '#dfd9d1'
  surface-bright: '#fff8f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3eb'
  surface-container: '#f3ede5'
  surface-container-high: '#ede7df'
  surface-container-highest: '#e7e2da'
  on-surface: '#1d1b17'
  on-surface-variant: '#4c4549'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f6f0e8'
  outline: '#7e7579'
  outline-variant: '#cfc3c8'
  surface-tint: '#6a5a63'
  primary: '#010001'
  on-primary: '#ffffff'
  primary-container: '#241820'
  on-primary-container: '#917f89'
  inverse-primary: '#d6c1cc'
  secondary: '#745a37'
  on-secondary: '#ffffff'
  secondary-container: '#fddaae'
  on-secondary-container: '#785e3b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e1318'
  on-tertiary-container: '#a3797f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f3dde8'
  primary-fixed-dim: '#d6c1cc'
  on-primary-fixed: '#241820'
  on-primary-fixed-variant: '#51424c'
  secondary-fixed: '#ffddb3'
  secondary-fixed-dim: '#e3c196'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5a4322'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#eabac1'
  on-tertiary-fixed: '#2e1318'
  on-tertiary-fixed-variant: '#603d43'
  background: '#fff8f0'
  on-background: '#1d1b17'
  surface-variant: '#e7e2da'
typography:
  display-hero:
    fontFamily: EB Garamond
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: EB Garamond
    fontSize: 44px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: '0'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.18em
  label-interactive:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.06em
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 4rem
---

## Brand & Style

The brand personality embodies quiet luxury, couture craftsmanship, and timeless romance. Designed for ultra-high-net-worth couples and discerning clientele, the aesthetic draws inspiration from high-end print editorials (*Vogue Weddings*, *Architectural Digest*) and bespoke atelier stationery.

The visual style is **Minimalist Editorial with Tactile Restraint**:
- Generous, intentional whitespace allowing architectural layouts to breathe.
- Understated grandeur driven by precision typography, high-contrast headline scales, and ultra-fine hairline divisions.
- A delicate balance between historical reverence and contemporary minimalism, deliberately avoiding gaudy metallic gradients or ostentatious embellishments in favor of whisper-quiet confidence.

## Colors

The palette relies on organic, textural tones anchored in regal intimacy:
- **Primary (`#241820` — Deep Plum):** Used for authoritative typography, deep structural backdrops, bespoke CTA containers, and high-contrast editorial blocks.
- **Neutral Surface (`#F5EFE7` — Warm Ivory):** The foundational canvas. Provides the tactile warmth of heavy archival cotton paper, eliminating stark clinical whites.
- **Secondary (`#B99A72` — Champagne Gold):** A desaturated, muted metallic tone reserved for delicate 1px hairline dividers, subtle badge borders, interactive accents, and monogram flourishes. Never used as heavy solid backgrounds.
- **Tertiary (`#A77D83` — Dusty Rose):** A muted botanical neutral that introduces warmth to secondary tags, romantic vignettes, hover states, and interactive feedback.
- **Accent Neutral (`#343A35` — Olive Charcoal):** A grounded supporting charcoal used for secondary body typography, technical subtext, and subtle micro-borders when warmth must be subdued.

## Typography

The type system pairs the grace of classical serif literature with modern sans-serif functional clarity:
- **Headlines & Editorial Statements (EB Garamond):** Used exclusively for poetic titles, chapter numbers, romantic statements, and high-impact lead-ins. Headings prioritize natural italicization for emphasis (`font-style: italic` for select decorative phrasing).
- **Body & Functional UI (Manrope):** Set in clean, geometric proportions with airy tracking to maintain pristine legibility against warm ivory backgrounds.
- **Labels & Micro-copy:** Always rendered in uppercase tracked lettering (`letter-spacing: 0.18em`) to mirror archival publication conventions.

## Elevation & Depth

Visual hierarchy rejects artificial volumetric dropshadows in favor of authentic tactile layering:
- **Low-Contrast Hairlines:** Elevation boundaries are established via crisp 1px borders using Champagne Gold (`rgba(185, 154, 114, 0.3)`) or Deep Plum at low opacity (`rgba(36, 24, 32, 0.08)`).
- **Surface Layering:** Stacking depth relies on subtle tonal transitions: moving from the Warm Ivory base (`#F5EFE7`) to elevated containers draped in pure white (`#FFFFFF`) or tinted ivory overlays (`#ECE5DC`).
- **Ambient Diffusion:** For modal dialogs and floating editorial navigations, depth uses an imperceptible plum-tinted haze: `0 24px 48px -12px rgba(36, 24, 32, 0.06)`. Blur radii are wide and saturation is subdued, evoking natural morning ambient light.
- **Glassmorphism Restraint:** Floating persistent headers employ a frosted veil (`backdrop-filter: blur(16px)` with 85% opacity of `#F5EFE7`), allowing imagery beneath to pass through softly without color distortion.

## Shapes

The design system embraces an uncompromising **Sharp (`0`)** shape language:
- All cards, primary CTAs, inputs, and image viewports use crisp 90-degree right angles (`0px border-radius`). This reinforces high-fashion editorial rigor, evoking custom cut stationery, heavy cardstock invitations, and architectural layouts.
- Circular elements are strictly reserved for functional round micro-toggles (e.g., audio moodboard controls, bespoke custom carousels, or icon-only floating anchors) to introduce deliberate organic tension against the architectural grid.

## Components

### Buttons & Interactive CTAs
- **Primary Button:** Solid Deep Plum (`#241820`) background, Warm Ivory (`#F5EFE7`) text. Sharp edges, uppercase `label-caps` typography, generous horizontal padding (`1.25rem 2.5rem`). Hover state shifts background softly to Olive Charcoal (`#343A35`) with an instantaneous hairline gold border transition.
- **Secondary / Ghost Button:** Transparent background, 1px Champagne Gold (`#B99A72`) border, Deep Plum text. On hover, fills with semi-transparent Champagne Gold (`rgba(185, 154, 114, 0.1)`).
- **Text Link CTA:** Inline `label-interactive` accompanied by a custom 1px trailing gold rule that expands outward on hover (`transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1)`).

### Input Fields & Selectors
- **Text Inputs:** Transparent background resting on Warm Ivory canvas with a bottom-only 1px hairline border (`#B99A72`). Labels sit in `label-caps` above the field in Dusty Rose (`#A77D83`). Active focus transitions the border to Deep Plum (`#241820`) with no outline rings.
- **Checkboxes & Radios:** Unrounded, sharp square geometries (18px × 18px) with a 1px border. Checked state uses an interior square inset in Deep Plum rather than utilitarian checkmark icons.

### Cards & Content Modules
- **Editorial Experience Card:** Clean ivory substrate framed by a 1px plum hairline (`rgba(36, 24, 32, 0.08)`). Imagery maintains strict 4:5 or 16:9 aspect ratios. Card interactions trigger a slow, subtle image zoom (`scale(1.03)` over 700ms) within an overflow-hidden wrapper, accompanied by an accent color shift in the title.
- **Service & Portfolio Tiles:** Feature minimal padding (`space-lg`), pairing oversized serif numerals (`01`, `02`, `03`) in muted gold above body narratives.

### Chips & Metadata Badges
- **Status & Category Chips:** Ultra-compact, sharp rectangular framing with 1px borders in Dusty Rose (`#A77D83`). Set in uppercase `label-caps` with a 4px dot indicator. Never filled with solid colors.

### Domain-Specific Components
- **Moodboard Grid:** An organic collage module utilizing CSS Grid spanning variable column heights, separated by 1px champagne hairlines to mimic high-fashion scrapbook curation.
- **Curated Itinerary Timeline:** A vertical 1px line in Champagne Gold with sharp diamond nodal indicators denoting event milestones (e.g., Sangeet, Ceremony, Reception).
- **Concierge Inquiry Drawer:** A full-height right-aligned canvas sheet featuring low-contrast ivory layering, designed for bridal party consultations and bespoke bespoke vendor selections.