# Terrah 360 — CLAUDE.md

> Single source of truth for Claude Code sessions on this project.
> All design values map directly to `globals.css @theme`.
> Never hardcode a color, size, or shadow — reference the token instead.

---

## Source of Truth

This project uses a **Figma-hosted design system**. The following rules apply
to every build and iteration session:

- All design decisions originate from the Figma file — read it via MCP first
- This CLAUDE.md is a reference companion, not a replacement for the Figma file
- If any value in this file conflicts with what MCP reads from Figma,
  **Figma always wins**
- Before writing any component, read the relevant Figma frame via MCP and
  extract the current values — do not rely on memory or this file alone
- If new values are found in Figma that are not yet in globals.css @theme,
  add them to @theme first before using them anywhere

---

## Project Overview

**Terrah 360** is a real estate platform for agents and super agents to manage
property listings, clients, and transactions. The UI must feel professional,
fast, and trustworthy — agents use it daily to close deals and manage portfolios.

**Stack:**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS v4 — `@theme` block in `globals.css`, never `tailwind.config.ts`
- Language: TypeScript
- Animation: Framer Motion
- Icons: Lucide React — never emoji as substitutes
- Fonts: loaded via `next/font` in `layout.tsx`
- File locations: pages in `/src/app`, components in `/src/components`

---

## 1. Brand Personality

Terrah 360 is a professional tool used by real estate agents in active deal flow.
The visual language reflects:

- **Confident and clear** — agents need to scan listings, clients, and statuses
  at a glance; the UI must never slow them down
- **Action-oriented** — one strong blue drives primary actions (create listing,
  send invite, confirm); nothing competes with it
- **Trustworthy and structured** — property data, roles, and permissions must be
  immediately legible; hierarchy is communicated through type weight and color
- **Compact without feeling cramped** — tight spacing rhythm and consistent type
  scale let agents navigate large datasets without friction

**In practice:** think of a tool between Linear and a property CRM. Clean,
dense-when-needed, never decorative.

---

## 2. Color Palette

### Base palette

| Token | Hex | Name |
|---|---|---|
| `--color-white` | `#ffffff` | Pure white |
| `--color-black` | `#000000` | Pure black |
| `--color-grey-10` | `#fcfcfc` | Dashboard bg tint |
| `--color-grey-50` | `#f4f4f4` | Input fill, pill bg, card bg |
| `--color-grey-100` | `#eaeaea` | Stroke / divider |
| `--color-grey-150` | `#dfdfdf` | Disabled border |
| `--color-grey-400` | `#aaaaaa` | Placeholder / muted / meta |
| `--color-grey-950` | `#101010` | Near-black (overlays, scrim) |
| `--color-blue-100` | `#d1e1ff` | Blue tint bg |
| `--color-blue-150` | `#bad2ff` | Blue hover tint |
| `--color-blue-400` | `#4787fe` | Blue hover state |
| `--color-blue-500` | `#1969fe` | Primary brand blue |
| `--color-yellow-100` | `#fcebd5` | Yellow tint bg |
| `--color-yellow-500` | `#ee9c2e` | Draft / pending status |
| `--color-purple-100` | `#e1def5` | Purple tint bg |
| `--color-purple-500` | `#6a59ce` | Viewer / read-only role accent |
| `--color-red-100` | `#ffd3d3` | Error tint bg |
| `--color-red-400` | `#ff5150` | Error / destructive action |

### Semantic aliases — use these in components, not raw values

| Token | Resolves to | Use for |
|---|---|---|
| `--color-surface-primary` | `#ffffff` | Cards, panels, modal shells |
| `--color-surface-dashboard` | `#fcfcfc` | App background, sidebar bg |
| `--color-surface-fg-01` | `#f4f4f4` | Input fills, search pills, row hover |
| `--color-surface-stroke` | `#eaeaea` | All borders and dividers |
| `--color-frame` | `#f0f0f0` | Skeleton / loading placeholder |
| `--color-text-heading-01` | `#000000` | Page titles, modal titles |
| `--color-text-heading-02` | `#171717` | Section headings, card titles |
| `--color-text-heading-04` | `#424242` | Agent names, primary labels |
| `--color-text-heading-05` | `#5a5a5a` | Property addresses, body text |
| `--color-text-heading-06` | `#777777` | Captions, timestamps, meta |
| `--color-text-body` | `#5a5a5a` | Default paragraph text |
| `--color-btn-primary-bg` | `#1969fe` | Primary CTA buttons |
| `--color-btn-primary-text` | `#ffffff` | Primary button label |
| `--color-spot-blue` | `#1969fe` | Editor / agent role accent |

### Color usage rules

- **One primary action per view** — only the primary CTA gets `--color-btn-primary-bg`
- **Role colors**: agent/editor → blue, viewer → purple, owner → neutral, remove → red
- Tint variants (`-100`) are used as badge/pill backgrounds paired with their `500` text
- Never use raw grey values for text — always use a `--color-text-*` semantic token
- Overlay scrims use `--color-grey-950` at reduced opacity

---

## 3. Typography

### Font families

| Token | Family | Role |
|---|---|---|
| `--font-sans` | `"Geist", sans-serif` | All UI text — labels, body, captions, buttons |
| `--font-display` | `"Helvetica Neue", Helvetica, Arial, sans-serif` | Page and modal title headings only |

Geist handles everything functional. Helvetica Neue appears only on prominent headings.

### Type scale

| Token | Size | Weight | Line-height | Family | Use |
|---|---|---|---|---|---|
| `--text-h6` / `--weight-medium` | `19px` | `500` | `1.2` | Display | Modal titles, section headers |
| `--text-body` / `--weight-regular` | `16px` | `400` | `1.406` | Sans | Description / helper text |
| `--text-caption-1` / `--weight-regular` | `14px` | `400` | `1.2` | Sans | Agent email, input placeholder |
| `--text-caption-1` / `--weight-medium` | `14px` | `500` | `1.2` | Sans | Agent name, button labels, pill text |
| `--text-caption-2` / `--weight-regular` | `12px` | `400` | `1.2` | Sans | Permission label, secondary meta |
| `--text-caption-2` / `--weight-medium` | `12px` | `500` | `1.2` | Sans | Role badges, section labels |
| `--text-caption-3` / `--weight-regular` | `10px` | `400` | `1.2` | Sans | Timestamps, fine print |
| `--text-caption-3` / `--weight-medium` | `10px` | `500` | `1.2` | Sans | Micro labels |

### Typography rules

- Use `--leading-tight` (1.2) for all headings and captions
- Use `--leading-body` (1.406) only for paragraph / multi-line body copy
- Never go below `--text-caption-3` (10px) for readable UI text

---

## 4. Spacing Rhythm

| Token | Value | Typical use |
|---|---|---|
| `--space-0` | `0px` | Reset / flush |
| `--space-2` | `2px` | Icon nudges, micro gaps |
| `--space-4` | `4px` | Pill dismiss icon padding |
| `--space-6` | `6px` | Pill internal padding (vertical), badge padding |
| `--space-8` | `8px` | Input padding (vertical), icon-to-label gap |
| `--space-10` | `10px` | Row vertical padding |
| `--space-12` | `12px` | Pill horizontal padding, button padding |
| `--space-14` | `14px` | Section sub-gap |
| `--space-16` | `16px` | Panel horizontal padding, field spacing |
| `--space-20` | `20px` | Row-to-row gap, section content gap |
| `--space-24` | `24px` | Card / modal section gap |
| `--space-32` | `32px` | Modal/panel vertical padding |
| `--space-40` | `40px` | Large layout gaps |
| `--space-64` | `64px` | Breathing room, max-height offsets |

**Rhythm rule:** prefer `--space-8 / 12 / 16 / 24 / 32` for vertical rhythm.
Use odd values (10, 14) only when matching the Figma spec exactly.

---

## 5. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Role badges, status chips |
| `--radius-md` | `6px` | Input fields, dropdowns, small buttons |
| `--radius-lg` | `8px` | Primary buttons, compact elements |
| `--radius-xl` | `10px` | Pill input container, search bar |
| `--radius-2xl` | `16px` | Modal panels, drawer panels |
| `--radius-3xl` | `18px` | Large cards |
| `--radius-4xl` | `20px` | Feature panels |
| `--radius-full` | `9999px` | Search pills, avatars, goo dropdown items |

**Rule:** modal panels use `--radius-2xl`. Pills and goo dropdown items always
use `--radius-full`. Never mix radius values within the same component.

---

## 6. Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-xs` | `0px 0px 4px 0px rgba(0,0,0,0.08)` | Focused input, button rest state |
| `--shadow-soft` | `0px 0px 4px 0px rgba(186,186,186,0.25)` | Permission / role dropdown |
| `--shadow-card` | `0px 2px 1.5px rgba(234,234,234,0.15), 0px 0px 1.5px rgba(235,234,234,0.25)` | Listing card resting state |
| `--shadow-sm` | `0px 2px 8px 0px rgba(232,230,230,0.2)` | Hovered card / row |
| `--shadow-md` | `0px 2px 13.3px 0px rgba(197,197,197,0.1)` | Dropdown menus |
| `--shadow-lg` | `0px 6px 14px 0px rgba(135,133,133,0.12)` | Modal panels, drawers |
| `--shadow-inset-sm` | `inset 0px 1.5px 2px 0px rgba(0,0,0,0.08)` | Pressed button |
| `--shadow-inset-light` | `inset 0px 1.5px 2px 0px #ffffff` | Inner highlight on search pill |
| `--shadow-inset-focus` | `inset 0px 0px 4px 0px #1969fe` | Focus ring on pill input / search bar |
| `--shadow-inset-inner` | `inset 0px -2px 1px 0px rgba(244,244,244,0.4)` | Bottom-lit surfaces |

**Rules:**
- Focus states always use `--shadow-inset-focus` — never browser default outline
- Modal panels use `--shadow-lg`
- Dropdown menus use `--shadow-md`

---

## 7. Component Patterns

### App Shell (layout.tsx)
- Top nav: fixed, `--color-surface-primary`, `1px solid --color-surface-stroke` bottom border
- Sidebar: fixed left, `--color-surface-dashboard`, `--space-16` padding
- Main content: offset by sidebar width, `--color-surface-dashboard` bg
- Nav active state: `--color-icon-nav-active`, `--color-blue-100` bg pill
- Never rebuild nav or sidebar inside page files — layout.tsx only

### Search Bar / Search Modal
- Input container: `--color-surface-primary`, `--radius-xl`, `1px solid --color-surface-stroke`
- Focus: `--shadow-inset-focus`, border shifts to `--color-blue-500`
- Placeholder: "Search properties, agents…" in `--color-grey-400`, `--text-caption-1`
- Padding: `--space-8` vertical, `--space-12` horizontal
- Search input is the trigger — it must remain OUTSIDE the goo filter wrapper
- Dropdown results use the Gooey Dropdown component (see Section 9)

### Gooey Search Dropdown (GooeyDropdown.tsx)
- Trigger: search input — always sits outside the goo filter wrapper
- Items: individual pills, `--radius-full`, `--color-surface-fg-01` bg
- Item text: `--text-caption-1`, `--weight-medium`, `--color-text-heading-04`
- Item padding: `--space-6` vertical, `--space-12` horizontal
- Animate on keystroke when results are available — not on focus alone
- Each instance must receive a unique `filterId` prop
- SVG filter: `stdDeviation="10"`, alpha `20 -10` (sharp / search modal preset)
- Spring: `stiffness: 380`, `damping: 24`
- See SKILL.md Gooey Dropdown section for full implementation reference

### Property Listing Card
- Background: `--color-surface-primary`, `--radius-2xl`, `--shadow-card`
- Hover: `--shadow-sm`
- Image: top of card, full-width, `--radius-2xl` top corners only
- Title: `--text-caption-1`, `--weight-medium`, `--color-text-heading-02`
- Address / meta: `--text-caption-2`, `--weight-regular`, `--color-text-heading-06`
- Status badge: `--radius-sm`, tint bg + 500 text matching role color rules
- Price: `--text-body`, `--weight-medium`, `--color-text-heading-01`

### Pill Input (PillInput.tsx)
- Container: `--color-surface-primary`, `--radius-xl`, `1px solid --color-surface-stroke`
- Focus: `--shadow-inset-focus`, border shifts to `--color-blue-500`
- Pills flow left-to-right, wrapping inside the container
- Placeholder: `--color-grey-400`, `--text-caption-1`
- Padding: `--space-8` vertical, `--space-12` horizontal
- Error: `--text-caption-2`, `--color-red-400`, below the container

### Search Pill / Tag Pill
- Shape: `--radius-full`, bg: `--color-surface-fg-01`
- `--shadow-inset-light` to lift off input background
- Text: `--text-caption-1`, `--weight-medium`, `--color-text-heading-04`
- Dismiss icon: ×, `--color-grey-400`, `--space-4` padding, right side
- Padding: `--space-6` vertical, `--space-12` horizontal
- Dismiss hover: `--color-red-400`

### Buttons

**Primary**
- bg: `--color-btn-primary-bg`, text: `--color-btn-primary-text`
- `--radius-lg`, `--shadow-xs` at rest, `--shadow-inset-sm` on press
- Font: `--text-caption-1`, `--weight-medium`
- Padding: `--space-10` vertical, `--space-16` horizontal
- Disabled: `--color-grey-150` bg, `--color-grey-400` text, `cursor-not-allowed`

**Secondary / Ghost**
- Border: `1px solid --color-surface-stroke`, bg: transparent
- Text: `--color-text-heading-04`
- Same radius and padding as primary

### Input Fields
- Border: `1px solid --color-surface-stroke`, bg: `--color-surface-primary`
- `--radius-md`, padding: `--space-12` horizontal, `--space-10` vertical
- Placeholder: `--color-grey-400`
- Focus: `--shadow-inset-focus`, border shifts to `--color-blue-500`

### Role / Permission Select
- Trigger: `--text-caption-2`, `--weight-medium`, `--color-text-heading-04`
- Chevron icon right-aligned, `--color-grey-400`
- Dropdown: `--color-surface-primary`, `--radius-md`, `--shadow-md`
- Options: "Can edit", "Can view", "Remove"
- Remove option: `--color-red-400` text
- Active: `--color-blue-100` bg, `--color-blue-500` text
- Trigger border: none at rest, `1px solid --color-blue-500` on open

### Error States
- Text: `--text-caption-2`, `--color-red-400`, inline below the input
- "Already added" — duplicate email / agent
- "Enter a valid email address" — invalid format

### Loading Skeletons
- Background: `--color-frame` (`#f0f0f0`)
- Apply matching `--radius-*` to each skeleton block
- No animation unless explicitly requested

---

## 8. Layout

- **App shell:** top nav (fixed) + sidebar (fixed left) + main content area
- **Modal panels:** `480px` wide, centered in viewport, `--radius-2xl`, `--shadow-lg`
- **Overlay scrim:** full viewport, `--color-grey-950` at `40%` opacity
- **Modal internal layout:** vertical flex column
  - Title row (title + close button)
  - Search/input row
  - Divider
  - Results list (scrollable)
- **Z-index order:** scrim → modal panel → dropdowns → goo dropdown → tooltips
- **Modal padding:** `--space-32` top/bottom, `--space-24` left/right

### Next.js Integration
- Layout shell (nav + sidebar) lives only in `layout.tsx`
- Modal components render via a portal or top-level slot in `layout.tsx`
- Never inline modal markup in page files
- Each modal's state is managed in its own `use[ModalName].ts` hook
- Goo dropdown SVG filter must live inside the same portal as the dropdown

---

## 9. Interaction States

- **Hover:** background shifts one step, no scale transform
- **Active/Pressed:** `--shadow-inset-sm` on buttons
- **Focus:** `--shadow-inset-focus` — never use browser default outline
- **Disabled:** `--color-grey-150` border, `--color-grey-400` text, no shadow, `cursor-not-allowed`
- **Transition:** `150ms ease` on buttons and inputs only
- **Pill dismiss hover:** icon color shifts to `--color-red-400`
- **Permission dropdown open:** trigger border shifts to `--color-blue-500`
- **Goo items:** enter via spring stagger (`stiffness: 380, damping: 24`), exit reversed

---

## 10. Component File Map

| Component | File path |
|---|---|
| App layout shell | `src/app/layout.tsx` |
| Top nav | `src/components/nav/TopNav.tsx` |
| Sidebar | `src/components/nav/Sidebar.tsx` |
| Search bar | `src/components/search/SearchBar.tsx` |
| Gooey dropdown | `src/components/search/GooeyDropdown/index.tsx` |
| Gooey dropdown component | `src/components/search/GooeyDropdown/GooeyDropdown.tsx` |
| Gooey dropdown types | `src/components/search/GooeyDropdown/types.ts` |
| Gooey dropdown styles | `src/components/search/GooeyDropdown/GooeyDropdown.css` |
| Property listing card | `src/components/listings/ListingCard.tsx` |
| Listings grid | `src/components/listings/ListingsGrid.tsx` |
| Pill input | `src/components/ui/PillInput.tsx` |
| Permission select | `src/components/ui/PermissionSelect.tsx` |
| Primary button | `src/components/ui/Button.tsx` |
| Input field | `src/components/ui/Input.tsx` |
| Role badge | `src/components/ui/RoleBadge.tsx` |
| Modal shell | `src/components/modals/ModalShell.tsx` |
| Search modal hook | `src/components/search/useSearchModal.ts` |

---

## 11. Ready-to-Paste `@theme` Block

```css
@import "tailwindcss";

@theme {
  /* Colors — Base */
  --color-white:          #ffffff;
  --color-black:          #000000;
  --color-grey-10:        #fcfcfc;
  --color-grey-50:        #f4f4f4;
  --color-grey-100:       #eaeaea;
  --color-grey-150:       #dfdfdf;
  --color-grey-400:       #aaaaaa;
  --color-grey-950:       #101010;
  --color-blue-100:       #d1e1ff;
  --color-blue-150:       #bad2ff;
  --color-blue-400:       #4787fe;
  --color-blue-500:       #1969fe;
  --color-yellow-100:     #fcebd5;
  --color-yellow-500:     #ee9c2e;
  --color-purple-100:     #e1def5;
  --color-purple-500:     #6a59ce;
  --color-red-100:        #ffd3d3;
  --color-red-400:        #ff5150;

  /* Colors — Semantic */
  --color-surface-primary:        #ffffff;
  --color-surface-dashboard:      #fcfcfc;
  --color-surface-fg-01:          #f4f4f4;
  --color-surface-stroke:         #eaeaea;
  --color-frame:                  #f0f0f0;
  --color-text-heading-01:        #000000;
  --color-text-heading-02:        #171717;
  --color-text-heading-04:        #424242;
  --color-text-heading-05:        #5a5a5a;
  --color-text-heading-06:        #777777;
  --color-text-body:              #5a5a5a;
  --color-icon-nav-active:        #424242;
  --color-icon-explainer:         #777777;
  --color-icon-button-primary:    #ffffff;
  --color-icon-button-secondary:  #212121;
  --color-btn-primary-bg:         #1969fe;
  --color-btn-primary-text:       #ffffff;
  --color-spot-blue:              #1969fe;

  /* Typography */
  --font-sans:        "Geist", sans-serif;
  --font-display:     "Helvetica Neue", Helvetica, Arial, sans-serif;
  --text-h4:          29px;
  --text-h6:          19px;
  --text-body:        16px;
  --text-caption-1:   14px;
  --text-caption-2:   12px;
  --text-caption-3:   10px;
  --weight-regular:   400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --leading-tight:    1.2;
  --leading-body:     1.406;

  /* Spacing */
  --space-0:    0px;
  --space-2:    2px;
  --space-4:    4px;
  --space-6:    6px;
  --space-8:    8px;
  --space-10:   10px;
  --space-12:   12px;
  --space-14:   14px;
  --space-16:   16px;
  --space-20:   20px;
  --space-24:   24px;
  --space-32:   32px;
  --space-40:   40px;
  --space-64:   64px;

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:   10px;
  --radius-2xl:  16px;
  --radius-3xl:  18px;
  --radius-4xl:  20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs:          0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  --shadow-soft:        0px 0px 4px 0px rgba(186, 186, 186, 0.25);
  --shadow-card:        0px 2px 1.5px 0px rgba(234, 234, 234, 0.15),
                        0px 0px 1.5px 0px rgba(235, 234, 234, 0.25);
  --shadow-sm:          0px 2px 8px 0px rgba(232, 230, 230, 0.2);
  --shadow-md:          0px 2px 13.3px 0px rgba(197, 197, 197, 0.1);
  --shadow-lg:          0px 6px 14px 0px rgba(135, 133, 133, 0.12);
  --shadow-inset-sm:    inset 0px 1.5px 2px 0px rgba(0, 0, 0, 0.08);
  --shadow-inset-light: inset 0px 1.5px 2px 0px #ffffff;
  --shadow-inset-focus: inset 0px 0px 4px 0px #1969fe;
  --shadow-inset-inner: inset 0px -2px 1px 0px rgba(244, 244, 244, 0.4);

  /* Goo Dropdown */
  --goo-blur:           10px;
  --goo-spring-stiff:   380;
  --goo-spring-damp:    24;
}

/* Goo container base — do not put overflow: hidden on this or its ancestors */
.goo-container {
  overflow: visible;
  will-change: filter;
  isolation: isolate;
}
```
