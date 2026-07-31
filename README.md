# David Adeshina — Portfolio

Vite + React single-page portfolio. Dark Nocturne palette, canvas hero,
cursor trail, scroll-driven reveals and a data-driven work grid.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview  # serve the build locally
```

## Publish

The build is plain static files — `dist/` can go on any host.

- **Vercel** — import the repo, framework preset *Vite*, deploy. No config.
- **Netlify** — build `npm run build`, publish directory `dist`.
- **Cloudflare Pages** — same as Netlify.
- **GitHub Pages** — set `base: "/<repo-name>/"` in `vite.config.js` first,
  then publish `dist/`.

## Where things are

| Path | What |
| --- | --- |
| `src/App.jsx` | Whole page: hero, stats, approach, stack, experience, work, education, contact |
| `src/data/apps.js` | The eleven published apps — name, copy, store links, image paths |
| `src/components/AppCard.jsx` | One card in the work grid |
| `src/components/AppDialog.jsx` | The detail modal |
| `src/fx.js` | Canvas hero, cursor trail, orbit ring, reveals, tilt, typing |
| `src/styles/nocturne.css` | Design tokens and `.btn` / `.tag` classes |
| `src/styles/app.css` | Resets, keyframes, hover states, responsive overrides |
| `public/media/` | App screenshots and logos |

## Editing content

Nearly everything is copy in `src/App.jsx`. To change the apps — add, remove,
reorder, swap a link — edit `src/data/apps.js`; the grid and the dialog both
read from it. Replace an image by dropping a new file into `public/media/`
under the same name.

Colours come from CSS custom properties in `src/styles/nocturne.css` —
`--color-accent` drives the whole accent system, including the canvas.
