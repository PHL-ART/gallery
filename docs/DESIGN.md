---
name: ph1l74 Gallery
description: Street and documentary photography by Filat Astakhov — dark-first, zero-radius, three-color discipline.
colors:
  darkroom-black: "oklch(0.10 0.006 25)"
  darkroom-surface: "oklch(0.14 0.006 25)"
  darkroom-surface-hi: "oklch(0.18 0.006 25)"
  film-border: "oklch(0.22 0.006 25)"
  half-tone-grey: "oklch(0.48 0.006 25)"
  newsprint-white: "oklch(0.95 0.006 25)"
  press-red: "oklch(0.48 0.20 25)"
  press-red-light: "oklch(0.62 0.22 25)"
  press-red-dark: "oklch(0.32 0.18 25)"
typography:
  display:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "clamp(5rem, 14vw, 11rem)"
    fontWeight: 900
    lineHeight: 0.87
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "clamp(3rem, 8vw, 7rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.02em"
  label:
    fontFamily: "'Azeret Mono', monospace"
    fontSize: "0.58rem"
    fontWeight: 700
    letterSpacing: "0.16em"
  nav:
    fontFamily: "'Azeret Mono', monospace"
    fontSize: "0.66rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  body:
    fontFamily: "'Figtree', sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.9
rounded:
  none: "0"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
components:
  tag-chip:
    backgroundColor: "{colors.darkroom-surface}"
    textColor: "{colors.half-tone-grey}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  tag-chip-active:
    backgroundColor: "{colors.press-red}"
    textColor: "{colors.newsprint-white}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  nav-arrow:
    backgroundColor: "{colors.newsprint-white}"
    textColor: "{colors.darkroom-black}"
    rounded: "{rounded.none}"
    size: "48px"
  nav-arrow-hover:
    backgroundColor: "{colors.press-red}"
    textColor: "{colors.newsprint-white}"
    rounded: "{rounded.none}"
    size: "48px"
  context-badge:
    backgroundColor: "{colors.darkroom-surface-hi}"
    textColor: "{colors.newsprint-white}"
    rounded: "{rounded.none}"
    padding: "4px 16px"
  context-badge-hover:
    backgroundColor: "{colors.newsprint-white}"
    textColor: "{colors.darkroom-black}"
    rounded: "{rounded.none}"
    padding: "4px 16px"
---

# Design System: ph1l74 Gallery

## 1. Overview

**Creative North Star: "The Gallery Wall at Midnight"**

This is a photography gallery where the interface earns nothing. Every pixel either serves the photograph or disappears. The design references the experience of standing in front of a print in a dark gallery at night — the kind of space where ambient conversation stops, ambient light is absent, and the image is simply there. The architecture of the shell is sharp, quiet, and load-bearing without calling attention to itself.

The system is built on three colors and three fonts, both held to strict discipline. Red appears at most once per visible screen and marks a single state — never ambient, never decorative. The dark surface is not "developer aesthetic" or "night mode as feature"; it is the correct value for photographs to breathe at their own luminance, without the eye adjusting to a competing white field. Borders define structure where a lighter system would use cards, shadows, or rounded containers. There are none.

What this system explicitly rejects: the Tumblr softness of pastel overlays and flowing scripts; the rounded sentimentality of wedding-photography templates; the neon-on-dark clichés of generic developer portfolios (blue-purple gradients, glassmorphism, glowing accents); and the social-media pattern of equal-weight grid competition where every image shouts at the same volume.

**Key Characteristics:**
- Zero border-radius, globally enforced (`border-radius: 0 !important` in reset)
- Three colors: near-black, near-white, press-red — no grays introduced casually
- Dark mode primary; light mode structurally identical, only luminance changes
- Monospace for all metadata, labels, navigation — Figtree only for body copy
- Photographs at partial opacity at rest (55–72%), full on interaction — the hover is discovery, not decoration
- Flat elevation: depth via tonal layering (darkroom-black → darkroom-surface → darkroom-surface-hi), never shadows

## 2. Colors: The Darkroom Palette

A three-tone neutral field — all hue 25 (warm ochre tilt) to keep surfaces alive without competing with photographs — anchored by one surgical accent.

### Primary
- **Press Red** (`oklch(0.48 0.20 25)`): The only saturated color in the system. Used for: the active navigation state, hover state on navigation arrows and tag chips, the red digit in the logo mark, the small square dot in context badges, `aria-current` on navigation links. If Press Red appears more than twice on any screen, something has been designed incorrectly.
- **Press Red Light** (`oklch(0.62 0.22 25)`): Available as a hover variation and for lighter-surface accent contexts. Rarely needed directly.
- **Press Red Dark** (`oklch(0.32 0.18 25)`): Used for deep-state indicators and darkest accent moments. Defined; seldom applied.

### Neutral
- **Darkroom Black** (`oklch(0.10 0.006 25)`): The page canvas. `--bg` in dark mode. Photographs sit on this.
- **Darkroom Surface** (`oklch(0.14 0.006 25)`): Panel backgrounds (sidebar, admin cards). One step above the canvas. `--surface`.
- **Darkroom Surface Hi** (`oklch(0.18 0.006 25)`): Elevated surface for chips, context badges, EXIF toggle. `--surface-hi`. Two steps above canvas.
- **Film Border** (`oklch(0.22 0.006 25)`): Dividers and structural borders. Visible but quiet. `--border-color`.
- **Half-tone Grey** (`oklch(0.48 0.006 25)`): Muted text — labels, nav links at rest, EXIF keys, metadata counts. `--text-muted`.
- **Newsprint White** (`oklch(0.95 0.006 25)`): Primary text. Warm, not clinical white. `--text`.

**Light mode** uses the same hue family (25) at inverted luminance: canvas at `oklch(0.97 0.006 25)`, surface at `oklch(0.92 0.008 25)`. Press Red is identical in both themes — it does not shift between modes.

### Named Rules
**The One Accent Rule.** Press Red is used for one active or hover state per screen. Its rarity is not a constraint — it is the point. A screen with three red elements is a screen that has lost control of its hierarchy.

**The Warm Neutral Rule.** Every surface and text color is tinted toward hue 25 (warm ochre) at chroma 0.006–0.008. Pure grey (`oklch(L 0 0)`) is prohibited. The warmth is imperceptible at a glance but prevents the cold, clinical feeling of pure neutral photography portfolios.

## 3. Typography: The Press Stack

**Display Font:** Barlow Condensed (Black 900, ExtraBold 800) — condensed grotesque with press-photography energy. Reads like a contact sheet caption or a Magnum photo credit.
**Body Font:** Figtree (Regular 400, Medium 500) — clean, humanist, unobtrusive. Does not compete with the photography.
**Mono Font:** Azeret Mono (Bold 700, Medium 500, Regular 400) — used for all metadata, labels, navigation, EXIF data. Chosen specifically to avoid the Space Mono cliché common in developer portfolios.

**Character:** Barlow Condensed collapses large names into architectural monuments; Azeret Mono annotates without intruding; Figtree disappears into readability. The pairing has press-room utility rather than editorial elegance.

### Hierarchy

- **Display** (Barlow Condensed 900, `clamp(5rem, 14vw, 11rem)`, line-height 0.87, tracking -0.02em, UPPERCASE): Hero name on the homepage only. The entire name of "Filat Astakhov" in two lines at near-full viewport width.
- **Title** (Barlow Condensed 900, `clamp(3rem, 8vw, 7rem)`, line-height 0.88, tracking -0.02em, UPPERCASE): Album and section headings on content pages.
- **Date Display** (Azeret Mono 700, `1.4rem`, tracking -0.02em, line-height 1): The large date in the photo sidebar. Treated as a data number, not a heading.
- **Nav / UI** (Azeret Mono 700, `0.66rem`, tracking 0.12em, UPPERCASE): Navigation links, breadcrumbs, button text, tag chip labels.
- **Label** (Azeret Mono 700, `0.58rem`, tracking 0.16em, UPPERCASE): Section labels, sidebar labels ("Viewing from", "Shot on", "Tags"). The tightest, most restrained size in the system.
- **Body** (Figtree 400, `0.78rem`, line-height 1.9): Used only in the photographer bio text on the homepage. Not used for UI.
- **EXIF / Counts** (Azeret Mono 400–700, `0.60–0.66rem`): Technical data displayed in key-value rows. Key at `text-muted`, value at `text` bold-weight.

### Named Rules
**The Mono-First Rule.** Figtree is used for one purpose: paragraph body copy. Everything else — navigation, labels, tags, dates, EXIF, counts, footer — is Azeret Mono. Figtree in a nav link or a chip is a mistake.

**The EXIF Rule.** Metadata is annotation, not feature. Size 0.66rem, weight split: key muted, value bold. It sits quietly until examined.

## 4. Elevation

This system is flat. There are no box-shadows anywhere. Depth is conveyed entirely through tonal layering: three surface levels (Darkroom Black → Darkroom Surface → Darkroom Surface Hi) provide the spatial vocabulary. The photo pane uses a fourth level (`oklch(0.06 0.004 25)` — Photo Black) — even darker than the canvas — so photographs appear to float forward rather than sit on the page.

The sidebar in the photo view sits at Darkroom Surface against the Photo Black pane, creating a clear spatial hierarchy without any shadow. The 1px `Film Border` line dividers between sidebar sections provide structure that shadows would make heavy.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. No shadows appear in response to hover, elevation, or state. If depth is needed, use a tonal step, not a drop-shadow.

## 5. Components

Components are austere and direct. Affordance is declared through shape, color shift, and opacity — never through decoration. Every interactive element obeys the same focus ring: 2px solid Press Red, offset 4px, no border-radius.

### Navigation Links
- **Style:** Azeret Mono 700, 0.66rem, uppercase, tracking 0.12em. Background transparent.
- **Default:** `Half-tone Grey` text.
- **Hover:** `Newsprint White` text. Transition 0.15s ease.
- **Active (`aria-current="page"`):** `Press Red` text.
- **Focus:** 2px solid Press Red, offset 4px.

### Logo Mark
- Azeret Mono 700, 0.95rem, tracking -0.01em, color `Newsprint White`.
- The `1` digit in "ph1l74" is `Press Red` — the logo's single use of the accent.

### Tag Chip
- **Shape:** Sharp rectangle (0 radius). Azeret Mono 700, 0.64rem, uppercase, tracking 0.08em. Padding 4px 12px.
- **Default:** Background `Darkroom Surface`, text `Half-tone Grey`.
- **Active:** Background `Press Red`, text `Newsprint White`.
- **Hover (inactive):** Background `Newsprint White`, text `Darkroom Black` — full inversion. Transition 0.15s ease.
- **Focus:** 2px solid Press Red, offset 3px.

### Photo Card
- 2:3 aspect ratio, overflow hidden. Background `Darkroom Surface` (placeholder before image load).
- **Image at rest:** 72% opacity, no scale transform.
- **On hover/focus:** opacity 100%, scale(1.04). Transition: opacity 0.35s ease-out, transform 0.45s ease-out. Do not animate layout properties.
- **Tag reveal:** On hover, a gradient overlay fades in at bottom (`transparent → oklch(0.06 0.004 25 / 0.92)`). Tag labels in `oklch(0.88 0.006 25)` mono 0.58rem. The reveal is decorative and `aria-hidden`.

### Album Card
- 3:4 aspect ratio, same pattern as Photo Card. Cover image at 55% opacity at rest (dimmer — album covers are navigation, not content). On hover: opacity 100%, scale(1.04).
- Below image: name in Azeret Mono 700 uppercase 0.68rem, count in Azeret Mono 0.6rem muted. No background, no card border.

### Navigation Arrows (Photo Viewer)
- 48px × 48px sharp square. Background `Newsprint White`, text `Darkroom Black`. Unicode arrows (← →), font-size ~1.1rem.
- **Hover:** Background `Press Red`, text `oklch(0.97 0.006 25)`. Transition 0.15s ease.
- **Focus:** 2px solid Press Red, offset 3px.
- On mobile (≤900px): 40px × 40px, positioned at `--space-sm` from edge.

### Context Badge
- `inline-flex` with a 5×5px `Press Red` square dot and album/tag name in Azeret Mono 700 0.68rem uppercase, tracking 0.06em. Padding 4px 16px. Background `Darkroom Surface Hi`.
- **Hover:** Background `Newsprint White`, text `Darkroom Black` — same full inversion as tag chip.

### EXIF Data Row
- Two-column layout: key left in Azeret Mono 400 0.66rem muted, value right in Azeret Mono 700 0.66rem primary. `justify-content: space-between`. Gap `--space-md`.
- Rows separated by `--space-sm` vertical gap. No borders between rows.

### Sidebar
- Background `Darkroom Surface`. Sections separated by 1px `Darkroom Surface Hi` horizontal lines at `margin: 0 --space-lg`. Each section padding: `--space-xl --space-lg`.
- Section label: Azeret Mono 700, 0.58rem, uppercase, tracking 0.16em, `Half-tone Grey`. Margin-bottom `--space-md`.

### Lightbox (Photo Viewer)
- Full-screen overlay: `rgba(0,0,0,0.92)`. Framer Motion fade in/out (duration 0.2s). Hold-to-zoom at 2.5x, origin tracks cursor position. ESC closes. Close button: `×` in Azeret Mono 1.6rem, white/60 at rest, white on hover.

## 6. Do's and Don'ts

### Do:
- **Do** keep Press Red to one use per screen. One active nav state, one arrow hover, one dot — never all three simultaneously.
- **Do** use `border-radius: 0` everywhere. The global `* { border-radius: 0 !important }` reset enforces this; never override it.
- **Do** set images to partial opacity at rest (55% for album covers, 72% for photo cards) and reveal to full opacity on hover.
- **Do** use Azeret Mono for every metadata context: labels, navigation, tags, EXIF, counts, footer, dates.
- **Do** express depth through tonal steps (Black → Surface → Surface Hi → Photo Black), never shadows.
- **Do** use `clamp()` for display and title headings. Fixed `rem` for UI elements (nav, labels, chips).
- **Do** write `oklch(L C H)` for all color values. Every neutral must have chroma 0.005–0.010 at hue 25.
- **Do** transition only `opacity`, `transform`, and `color`/`background-color`. Never animate layout properties.
- **Do** use `ease-out` curves for transitions. `0.15s ease` for color/opacity state changes; `0.35–0.45s ease-out` for image reveals.
- **Do** give every interactive element the same focus ring: `outline: 2px solid var(--red); outline-offset: 4px`.

### Don't:
- **Don't** add a `border-radius` anywhere, for any reason. Not even 2px on a button. The zero-radius doctrine is the system's most structural rule.
- **Don't** introduce shadows (`box-shadow`, `drop-shadow`, `filter: drop-shadow`). Depth comes from tonal steps, not from light simulation.
- **Don't** use glassmorphism (`backdrop-filter: blur`). Never intentional in this system.
- **Don't** use gradient text (`background-clip: text`). Single solid color only.
- **Don't** add a border-left or border-right as a colored accent stripe on list items, callouts, or cards. Use a background tint or no decoration at all.
- **Don't** introduce a fourth color. The three-color discipline (near-black, near-white, press-red) is not a constraint to be relaxed — it is the character of the system.
- **Don't** use Figtree in navigation, chips, labels, or any UI element. Figtree is paragraph copy only.
- **Don't** use Space Mono, Inter, or any of the common portfolio-site font defaults. The font stack was chosen specifically to avoid them.
- **Don't** put images at full opacity at rest. The reveal on hover is the interaction; starting at full opacity removes the discovery.
- **Don't** use `oklch(L 0 0)` pure neutrals. Every surface must tilt toward hue 25 — the warmth is the system's invisible connective tissue.
- **Don't** design for Tumblr softness: no pastel overlays, flowing typography, decorative whitespace, rounded containers, blush tones, or script fonts.
- **Don't** use neon or blue-purple gradients. This system is not a developer portfolio.
