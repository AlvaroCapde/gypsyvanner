# Sistema de Diseño: Gypsy Vanner Horse Society (México)
**Version:** 1.0
**Project:** GVHS Mexico Official Registry Website

---

## 1. Executive Summary
This document outlines the visual and functional design system for the Mexican branch of the Gypsy Vanner Horse Society (GVHS). The objective is to maintain the authoritative, heritage-rich identity of the original US registry (`vanners.org`) while elevating the digital experience to a modern, "Editorial Equestrian" aesthetic. 

By utilizing the official brand colors—**Black, Red, and White**—with a strict application ratio, the UI will act as a premium, minimalist canvas that allows the striking photography of the piebald Gypsy Vanner horses to take center stage.

---

## 2. Brand Principles
* **Heritage & Authority:** As an official registry, trust is paramount. The design must feel official, secure, and permanent.
* **Modern Elegance:** Information (like pedigrees and DNA records) should be easy to digest through the use of generous whitespace, clean typography, and bento-box layouts.
* **Photographic Focus:** The horses are the stars. The UI should frame the photography, never compete with it.

---

## 3. Color Palette & Application
The palette is restricted to the official brand colors, applied using the **90-8-2 Rule** to avoid a "discount" or "sports" aesthetic.

### 3.1 The 90-8-2 Rule
* **90% Surface:** White and very light grays.
* **8% Structure & Typography:** Deep blacks and rich dark grays.
* **2% Action:** The signature Crimson Red, reserved *strictly* for interactions and alerts.

### 3.2 Color Tokens
| Role | Color Name | HEX Code | Tailwind Class | Usage Guidelines |
| :--- | :--- | :--- | :--- | :--- |
| **Surface Core** | Pure White | `#FFFFFF` | `bg-white` | Default background for pages, cards, and modals. |
| **Surface Subdued** | Alabaster | `#FAFAFA` | `bg-zinc-50` | Secondary backgrounds to differentiate sections without using lines. |
| **Primary Text** | Rich Black | `#09090B` | `text-zinc-950` | Primary headings and standard body copy. Offers high readability. |
| **Structural** | Onyx | `#18181B` | `bg-zinc-900` | Footer backgrounds, dark mode surfaces, and heavy structural borders. |
| **Brand Action** | Registry Crimson| `#B91C1C` | `bg-red-700` | Primary buttons, active navigation states, verified badges, error states. |
| **Borders** | Platinum | `#E4E4E7` | `border-zinc-200` | Subtle dividers in tables, bento grids, and input field borders. |

---

## 4. Typography System
Typography in a registry serves two purposes: exuding prestige (certificates, titles) and delivering dense data (pedigrees, ownership history). We use a dual-font strategy.

### 4.1 Font Families
* **Display & Headings (Prestige):** `Playfair Display` or `Cormorant Garamond` (Serif). Gives a timeless, engraved, certificate-like feel.
* **Body & UI (Functionality):** `Inter` or `DM Sans` (Sans-serif). Highly legible at small sizes for data tables and forms.

### 4.2 Typographic Scale (Tailwind)
* **Hero Title (H1):** Serif, `text-5xl md:text-7xl font-bold tracking-tight text-zinc-950`
* **Section Title (H2):** Serif, `text-3xl md:text-4xl font-semibold text-zinc-900`
* **Card Title (H3):** Sans-serif, `text-xl font-semibold text-zinc-950`
* **Body Primary:** Sans-serif, `text-base text-zinc-700 leading-relaxed`
* **Data/Pedigree (Small):** Sans-serif, `text-sm text-zinc-600 font-medium`

---

## 5. Photography & Imagery Guidelines
Gypsy Vanners are known for their heavy feathering and striking piebald (black and white) coats. The photography is an extension of the color palette.

* **Desaturation Technique:** When using hero images, slightly cool or desaturate the environmental greens/browns by 10-15%. This makes the black and white of the horse pop perfectly against the UI.
* **Gradient Overlays:** Text over images must *always* remain legible. Use smooth, dark gradients rather than flat opacity overlays.
  * *Tailwind:* `bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent`
* **No Clutter:** Avoid placing complex UI elements directly over busy parts of the photograph (like the horse's mane or legs).

---

## 6. UI Components & Patterns

### 6.1 Buttons
Buttons must clearly indicate interactivity using the Registry Crimson.

* **Primary Button:** Solid crimson background, white text. No rounded pills; use subtle rounding for a professional look.
  * *Tailwind:* `bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-md transition-colors`
* **Secondary Button:** White background, thin black border, black text.
  * *Tailwind:* `bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-medium px-6 py-2 rounded-md`
* **Ghost Button (Nav):** No background, black text, crimson underline on hover.

### 6.2 The "Bento Box" Grid
For displaying features or pedigree overviews, avoid long vertical lists. Use distinct, bordered cards on a slightly contrasting background.
* *Container:* `bg-zinc-50 p-8`
* *Card:* `bg-white border border-zinc-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow`

### 6.3 Hero Section (Glassmorphism)
The top of the landing page should be an immersive experience.
* **Layout:** `h-screen w-full relative`
* **Header/Nav:** Floats over the image using a blur effect to maintain readability without a heavy solid block.
  * *Tailwind:* `absolute top-0 w-full backdrop-blur-md bg-white/10 border-b border-white/20 z-50`

### 6.4 Data Tables (Pedigrees & Lineage)
Data tables must be perfectly clean.
* No vertical borders.
* Subtle horizontal borders (`border-b border-zinc-200`).
* Table header text should be uppercase, small, and tracked out (`text-xs font-semibold uppercase tracking-wider text-zinc-500`).
* Highlight the selected horse in the pedigree tree with a very subtle red left-border (`border-l-4 border-red-700`).

---

## 7. Tone of Voice (Copywriting)
* **Authoritative:** Use clear, declarative statements. ("Verify Pedigree", not "Check out if your horse is real.")
* **Elegant:** Use elevated language when describing the breed. ("Preserving the Standard of Excellence," "A Legacy in Motion.")
* **Accessible:** Keep forms and instructions incredibly simple. The registry process can be complex; the digital interface should feel effortless.