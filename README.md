# Dust Away — Landing Page

Static website (HTML + CSS + JavaScript, no build step, no framework).

```
dustaway-website/
├── index.html          # the landing page (Thai default, EN toggle)
├── css/styles.css      # all styles + brand tokens (purple #5C0F8B, off-white #F4F0E9)
├── js/main.js          # language toggle, price calculator, B2B estimator, booking form
└── assets/
    ├── logo-horizontal-purple.png / -white.png
    ├── logo-stacked-purple.png / -white.png
    └── favicon.svg
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
npx serve .        # or: python3 -m http.server 8000
```

## Deploy (free options)
- **Netlify Drop**: drag the `dustaway-website` folder onto https://app.netlify.com/drop
- **Vercel / Cloudflare Pages / GitHub Pages**: upload the folder as a static site (no build command, output = root)
Then connect your domain in the host's settings.

## How bookings work
No server is needed. When a customer presses **ส่งการจองทาง LINE**, the page opens LINE Official Account `@065zopjp`
with the booking details already typed (service, date, time, name, phone, province, address, total and 50% deposit).
The B2B **quote** button opens an email to Dustaway.th@gmail.com with the estimate filled in.

## Photos (just upload with these exact names)
| Photo | File name | Suggested size |
|---|---|---|
| Hero (top of page) | `assets/hero.jpg` | ~1200 × 1000 px |
| Mattress service | `assets/services/mattress.jpg` | ~1200 × 900 px (4:3) |
| Sofa service | `assets/services/sofa.jpg` | ~1200 × 900 px |
| Pillows & duvets | `assets/services/pillow-duvet.jpg` | ~1200 × 900 px |
| Curtains & rugs | `assets/services/curtain-rug.jpg` | ~1200 × 900 px |

Until a photo is uploaded, its card shows a soft lavender background instead of a broken image.
Names are case-sensitive (`.jpg`, not `.JPG`). Keep each photo under ~500 KB so the page loads fast.

## Colours
All colours are variables at the top of `css/styles.css` (`:root`). Change `--purple` to recolour buttons and headings.

## Things to replace
| What | Where |
|---|---|
| Mite-test numbers `[XX]` | `.proof-card` in the hero |
| Logo files | `assets/` — the PNGs were cropped from the brand guideline PDF; swap in the original vector/PNG exports for best sharpness |
| Prices / rules | `index.html` (display) and the constants at the top of `js/main.js` (`MIN_ORDER`, discounts) |

## Editing text
Thai text is written directly in `index.html`. The English version of each element is in its `data-en` attribute
(or `data-en-html` / `data-en-placeholder`). Change both when you edit copy.
