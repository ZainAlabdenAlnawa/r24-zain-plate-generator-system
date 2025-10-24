# Plate Generator System

A responsive web application for configuring and visualizing custom wall plates.
Built with React + Vite, optimized for both desktop and mobile devices.

---

## Features

### Core Requirements

* Initial Plate Generation

  * On load, one default plate is created with predefined dimensions and motif.
  * Configuration is persisted using browser 'localStorage'.

* Plate Dimensions Input

  * Custom width (20–300 cm) and height (30–128 cm).
  * Supports both English (`.`) and German (`,`) locales for decimal inputs.
  * Invalid inputs trigger styled warnings without auto-correction.
  * On blur, invalid values are reverted to the last valid state.

* Plate Management

  * Between 1–10 plates can exist.
  * Users can add or remove plates (except the last one).
  * Each plate is individually resizable.

* Dual-Canvas UI

  * Left panel: realistic visual preview (scales 1 cm = 1 px).
  * Right panel: input controls.
  * Fully responsive and touch-friendly.

* Image Rendering on Plates

  * Shared motif image split proportionally across plates.
  * Cropping from the center outward for mismatched aspect ratios.
  * Plates display exactly their portion of the motif.

* Image Extension (Mirroring

  * If total width > 300 cm, the motif extends seamlessly via horizontal mirroring.

### Extara Features

* Upload custom motif image.
* Export canvas as PNG.
* Drag & drop plate reordering.
* Toggle between cm/inches.
* Animated transitions.

---

## Tech Stack

* Framework: React + Vite
* Styling: CSS (responsive, mobile-first)
* State Persistence: localStorage
* Build Tool: Vite

---

## Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/ZainAlabdenAlnawa/r24-zain-plate-generator-system.git
cd r24-zain-plate-generator-system
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Live Demo

Deployed on Netlify: [Demo Link](https://r24-pls.netlify.app/)

---

## Known Limitations / Assumptions

* Only tested with the provided initial motif image.
* Input validation currently focused on numeric + locale detection.
* Advanced bonus features may not yet be implemented.


---

## License

For assessment purposes only.
