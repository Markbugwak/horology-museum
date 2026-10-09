# HOROLOGY — Independent Watch Museum

An immersive, educational 3D watch museum exploring watchmaking, design, and the history of iconic timepieces. This is an independent, non-commercial fan/educational project and is not affiliated with or endorsed by Rolex SA.

## Stack
- React + TypeScript + Vite
- Three.js / React Three Fiber / Drei
- GSAP for scroll-led motion
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

## 3D model note
The included watch is a procedural demonstration model, not a factory-accurate Rolex model. For a true exploded animation, add a properly licensed GLB/GLTF model with separate named meshes for the case, bezel, crystal, dial, hands, movement, crown, and bracelet. Put it in `public/models/` and document the asset license.

## Scope
- No ecommerce or checkout
- Interactive rotating watch viewer
- Educational watch history and design details
- Scroll-led anatomy/exploded-view storytelling (model-dependent)

Product names and trademarks belong to their respective owners. The project is not an official Rolex website.