# Maison Éclat - static preview build

Deploy on GitHub Pages:

1. Push this `docs` folder to the root of a repository (so the path is `/docs`).
2. In the repository: Settings > Pages.
3. Source: "Deploy from a branch". Branch: `main`, folder: `/docs`. Save.
4. The site goes live in a minute or two at `https://<user>.github.io/<repo>/`.

Pages

- `index.html` - home
- `collection.html` - collection
- `desert-rose.html` - product page
- `spiral.html` - product page

Notes

- `.nojekyll` must stay, so GitHub serves the folder as-is.
- `support.js` is the runtime the pages need. Do not remove it.
- `assets/` holds the images and the hero video. The video is about 5 MB.
- Headline fonts load from Google Fonts, so the live site needs a connection.
- Desktop layout only for now. Mobile is not done yet.
