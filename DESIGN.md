# Design System

This document holds two durable design worlds. The first governs the portfolio at `/portafolio/` and is frozen: its visual identity must be preserved byte-for-byte. The second governs the construction page at `/`.

---

## Portfolio Route (`/portafolio/`)

## Direction Contract

**THESIS** — An operational dossier makes Juan's range legible as one connected practice, refusing the conventional centered portfolio hero and card grid.
**OWN WORLD** — Paper-white fields, graphite text, mineral blue structure, and a precise orange contact signal; square rules, index rails, and process lines replace decorative containers.
**STORY** — Visitors understand Juan's cross-functional profile, verify it through experience and documented projects, then contact him or download the source CV.
**FIRST VIEWPORT** — A slim identity rail frames a large left-aligned name, concise value proposition, contact action, and an animated route joining Web, ERP, IA, and Operación.
**FORM** — Operational project folio, grounded direction 7; structured as a dossier index with a single route-drawing motion moment (seed `a3ea7f16`).

## Visual System

- **Scene:** A recruiter reviews the portfolio in a bright office; the interface is light, crisp, and printable rather than category-default dark tech chrome.
- **Color:** `#F4F3EF` paper, `#15191F` graphite, `#174EA6` mineral blue, `#C2410C` contact orange, and restrained neutral rules.
- **Typography:** Local UI sans stack led by Aptos/Segoe UI; Bahnschrift/DIN Alternate gives headings and factual labels an operational wayfinding voice. No remote font dependency.
- **Geometry:** Predominantly square edges and 1px rules. Rounded pills and generic card grids are avoided.
- **Composition:** Desktop uses a fixed-feeling left index rail and broad content field. Mobile turns the rail into a compact top bar and preserves the same reading order.
- **Motion:** The hero route draws once after load. Content remains visible before animation; reduced-motion users receive the finished state immediately.

## Interaction Rules

- Contact is the primary action and uses the orange signal color consistently.
- CV download and project visit are secondary text actions.
- Focus indicators use a high-contrast double outline and never rely on color alone.
- External project links open in a new tab with `noopener noreferrer`; email and telephone use native protocols.
- Sticky navigation must never obscure anchored headings.

## Content Rules

- Public copy is neutral professional Spanish.
- Portfolio facts come only from `public/portafolio/js/portfolio-data.js`, supported by the preserved DOCX or another explicit verified source.
- Missing LinkedIn and GitHub URLs are omitted rather than represented by disabled or placeholder links.
- New projects inherit the project renderer and are added only as data objects.

## Responsive and Accessibility Rules

- Body copy targets a maximum readable measure of 72 characters.
- Layout supports 320px-wide screens without horizontal scrolling.
- Semantic landmarks, heading order, skip navigation, status-safe rendering, and descriptive labels are mandatory.
- Contrast meets WCAG AA; touch targets are at least 44px where practical.
- Print styles remove navigation and motion while preserving contact and chronology.

---

## Construction Route (`/`)

### Direction Contract

**THESIS** — A machine waking up. The root page presents the site as firmware mid-boot: honest about being unfinished, confident about what is coming.
**OWN WORLD** — Devkit console aesthetic: firmware rails, calibration ticks, and a boot log. Not a generic "coming soon" placeholder but a bench instrument that belongs to an engineer.
**STORY** — The visitor interrupts a boot sequence. The system self-reports, calibrates, and delivers one verdict — "El mundo aún no está listo para esto." — then offers the single finished module: the portfolio.
**FIRST VIEWPORT** — Boot log, oversized verdict, and the "Abrir portafolio" action are all visible without scrolling on any viewport, including 320px-wide screens.
**FORM** — Full-viewport grid with asymmetric side rails. One staged boot motion, removed entirely under reduced motion.

### Visual System

- **Color:** Deep indigo `#0D1022` ground with graphite `#171B2E` and rail `#262C45` structure; acid chartreuse `#C8F542` for system-ok states and the primary action; hot coral `#FF5D4D` reserved for warnings and calibration marks; ice white `#EEF3F7` text with dimmed `#9AA6C0` secondary text. No gradient text, no glass effects, no remote fonts.
- **Typography:** Local monospace stack (ui-monospace, Cascadia Mono, Consolas) for firmware voice; the oversized verdict switches to the local UI sans stack at 800 weight, uppercase, for maximum impact.
- **Geometry:** Square edges, 1px rules, hard-stop tick marks. Asymmetric rails: a narrow left rail and a wider right rail on desktop; the right rail drops below 40rem.
- **Motion:** A single authored boot sequence — log lines stagger in, the verdict rises, the status dot blinks twice, then the action fades in. Under `prefers-reduced-motion` every element renders in its final state with no animation.

### Interaction Rules

- One primary action only: "Abrir portafolio" links to `/portafolio/` and inverts to an outlined state on hover and focus.
- Focus indicators use a 3px chartreuse outline with offset and never rely on color alone.
- Skip navigation targets the main stage.
- The page makes no factual claims beyond the site being under construction; decorative firmware labels (revisions, addresses) are clearly instrumental fiction.

### Responsive and Accessibility Rules

- Contrast meets WCAG AA on the dark ground for all text and the primary action.
- Layout supports 320px-wide screens without horizontal scrolling; secondary rail metadata hides on small screens.
- Semantic landmarks (`header`, `main`, `footer`), a single `h1`, and skip navigation are mandatory.
