---
name: Haute Atelier
colors:
  surface: '#f5fbf3'
  surface-dim: '#d6dcd4'
  surface-bright: '#f5fbf3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ee'
  surface-container: '#eaefe8'
  surface-container-high: '#e4eae2'
  surface-container-highest: '#dee4dd'
  on-surface: '#171d19'
  on-surface-variant: '#4c4549'
  inverse-surface: '#2c322d'
  inverse-on-surface: '#edf2eb'
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
  background: '#f5fbf3'
  on-background: '#171d19'
  surface-variant: '#dee4dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  display-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.005em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  title-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  tabular-nums:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves an elite, high-touch luxury wedding planning agency where editorial discernment intersects with complex multi-vendor logistics. The visual identity rejects sterile tech templates and aggressive neon palettes, opting instead for the poise of an archival fashion house and the surgical utility of an operations center.

The atmosphere balances **Editorial Luxury** and **High-Density Precision SaaS**:
- **Atmospheric Elegance:** Warm, tactile parchment tones paired with deep vintage plum create an authoritative, heirloom ambiance.
- **Architectural Rigor:** Ultra-fine 1px structural framing, structured hairline dividers, and deliberate whitespace provide clear boundaries for high-stress operational execution (vendor manifests, timeline minute-runs, high-value budgets).
- **Poise Under Pressure:** Data density is presented not as clutter, but as an impeccably curated register—resembling bespoke stationery printed with logistical precision.

## Colors

The palette establishes an organic, warm-canvas base punctuated by rich botanical-plum depths and metallic warmth:

- **Primary (`#241820` — Deep Plum):** The anchor for high-priority actions, selected navigational states, title typography, and prominent metric values. Evokes bespoke velvet and black-tie discipline.
- **Secondary (`#B99A72` — Champagne Gold):** Reserved for prestige status highlights, VIP tags, critical active indicators, and refined decorative rules. Never used for raw body text.
- **Tertiary (`#A77D83` — Dusty Rose):** A balancing muted tone for soft badge fills, secondary status labels (e.g., "Pending Approval", "Soft Hold"), and delicate data visualization series.
- **Neutral (`#343A35` — Olive Charcoal):** Applied to structural borders, micro-copy, tabular headers, muted icons, and high-contrast metadata. Provides softer contrast than stark carbon black.
- **Canvas Base (`#F5EFE7` — Warm Ivory):** The outer workspace canvas and viewport background. Gives the entire viewport an archival paper warmth.
- **Surface Elevation (`#FFFFFF` — Pure White):** The primary container fill for cards, sheets, data grids, and modals, creating subtle layered separation against the warm canvas.

## Typography

Typography establishes an intentional cadence between human intimacy and systematic execution:

- **Editorial Headings (`EB Garamond`):** Used exclusively for high-level page framing, client wedding dossier titles, milestone dates, and major financial summaries. Headings should feel like curated monograms or high-end magazine mastheads.
- **Operational Data (`Manrope`):** Engineered for dense, scannable data layouts. All table cells, metadata pills, task checklists, and interactive form elements use Manrope.
- **Numbers & Currencies:** Always utilize `font-feature-settings: "tnum"` (tabular figures) across tables and financial ledgers to ensure clean vertical alignment across multi-million budget breakdowns.
- **Micro-Labels:** Use `label-sm` with uppercase transforms and generous letter spacing (`0.08em`) for column headers, badge categories, and structural section tags.

## Layout & Spacing

This layout uses a fixed-width sidebar alongside a fluid canvas optimized for high-resolution desktop displays (1440px to 1920px+).

- **Grid Architecture:** Desktop workspace panels employ a 12-column fluid grid system with `gutter-lg` (24px) for dashboard overviews and `gutter` (16px) for compact data sheets. Outer canvas margin uses `margin-lg` (32px).
- **Density Philosophy:** Compact vertical rhythm. Component inner padding scales tightly (`space-xs` to `space-md`) inside table cells and form controls to maximize screen estate, while module containers are separated by `space-lg` to retain an uncluttered, high-end editorial rhythm.
- **Sidebar & Toolbars:** Navigation stays pinned at a disciplined 260px width. Sub-panels and side-drawers (e.g., guest RSVP inspectors, vendor contracts) use a standard 420px overlay or inline slide-out.

## Elevation & Depth

Visual hierarchy relies on crisp surface layering and warm, subdued shadows that evoke soft lighting on heavy paper stocks, avoiding synthetic blur clouds.

- **Surface Layering:**
  - Base: Warm Ivory (`#F5EFE7`)
  - Primary Surface: Pure White (`#FFFFFF`) with 1px border colored at `#343A35` with 12% opacity (`rgba(52, 58, 53, 0.12)`).
  - Raised Surface (Modals, Popovers, Flyout Drawers): Pure White (`#FFFFFF`) with 1px border at `#343A35` with 16% opacity.
- **Warm Ambient Shadow Scale:**
  - *Resting Card:* `0 1px 3px rgba(36, 24, 32, 0.04), 0 1px 2px rgba(36, 24, 32, 0.02)`
  - *Floating Menu / Dropdown:* `0 4px 16px -2px rgba(36, 24, 32, 0.08), 0 2px 6px -1px rgba(36, 24, 32, 0.04)`
  - *Modal Sheet:* `0 16px 36px -4px rgba(36, 24, 32, 0.12), 0 6px 12px -2px rgba(36, 24, 32, 0.06)`
- **Rule Lines & Hairlines:** Sections within containers are delineated using 1px solid hairlines tinted with `#B99A72` at 25% opacity or `#343A35` at 8% opacity.

## Shapes

The geometric signature is tailored, structured, and architectural. 

- **Level 1 (Soft / Tailored):** Standard controls (buttons, inputs, status pills) use a subtle 4px corner radius (`0.25rem`). This provides clean geometric sharpness without severe brutalist edges.
- **Container Radii:** Cards, canvas sheets, and tables use an 8px radius (`0.5rem`).
- **Modal & Drawer Overlays:** Large dialogs and sliding inspectors max out at 10px (`0.625rem`).
- **Circular Elements:** Reserved exclusively for user avatars, vendor certification checkmarks, and radio selection controls.

## Components

### Buttons
- **Primary:** Deep Plum (`#241820`) background, White text, 1px border of Deep Plum. Hover transitions softly to `#372732` with a subtle Champagne Gold accent glow (`box-shadow: 0 0 0 1px #B99A72`). Height: 36px (dense) or 40px (default).
- **Secondary (Outline):** Pure White background, 1px border of `#343A35` (30% opacity), Deep Plum text. On hover, background shifts to Warm Ivory (`#F5EFE7`).
- **Tertiary / Ghost:** Transparent background, Olive Charcoal (`#343A35`) text. On hover, background shifts to Champagne Gold at 10% opacity.

### Data Tables (Logistics & Budgets)
- **Header:** Background `#F5EFE7`, 32px height, uppercase `label-sm` text in Olive Charcoal (`#343A35` at 80% opacity), with a 1px solid bottom divider.
- **Row:** Pure White background, 40px compact row height, alternating hover state of `#FDFBF7`. Bottom hairline border of `#343A35` at 6% opacity.
- **Numeric Columns:** Right-aligned, utilizing tabular numerals font variant.

### Badges & Status Chips
- **VIP / Confirmed:** Champagne Gold surface (`rgba(185, 154, 114, 0.15)`), 1px solid Champagne Gold border (`#B99A72`), text `#735632`.
- **In Review / Tentative:** Dusty Rose surface (`rgba(167, 125, 131, 0.15)`), 1px solid border (`#A77D83`), text `#613E44`.
- **Draft / Inactive:** Warm neutral tint (`rgba(52, 58, 53, 0.08)`), text `#343A35`.
- **Shape & Padding:** 20px total height, 4px border radius, 4px horizontal padding, `label-sm` typography.

### Input Fields & Selects
- Pure White background, 1px border in `#343A35` (20% opacity), 36px height, text in `#241820`.
- **Focus State:** 1px border in Deep Plum (`#241820`) accompanied by an outer shadow ring of 2px Champagne Gold (`rgba(185, 154, 114, 0.35)`).

### Metric Cards (Event At-a-Glance)
- Pure White card container, 1px structural hairline border.
- Metric values set in `display-md` (EB Garamond), paired with an uppercase `label-sm` descriptor in Olive Charcoal.
- Sub-text indicator displaying progress or deviation accented in Dusty Rose or Champagne Gold.

### Timeline Minute-Run (Day-of Event Chronology)
- Left-anchored 1px Champagne Gold vertical rail.
- Time anchor set in Manrope semi-bold tabular figures.
- Milestone cards set with Pure White fill, 1px hairline border, and a 2px left accent border colored in Deep Plum for ceremony milestones and Champagne Gold for reception milestones.