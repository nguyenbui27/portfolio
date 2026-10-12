# Nguyen's World

An explorable portfolio for Thao Nguyen Bui. Five destinations reveal projects,
experience, technical skills, About and awards, and contact details.

## Run in VS Code

Open this folder and run `npm run dev` in the terminal. Visit
`http://localhost:8017`. To choose another port, run `PORT=8025 npm run dev`.
No build step or dependencies are required.

## Explore

Click or tap a destination to walk there. Click the landscape to move freely,
or focus the map and use arrow keys / WASD. Press Enter near a destination.
The top navigation opens details immediately. Escape closes a destination.
Visit all five destinations to complete the explorer passport. Progress lasts
for the browser session; Reset journey clears it.

## Content and Deployment

Edit `data/profile.json` to update resume information and project links. Media
lives in `src/assets`. `src/app.js` draws the canvas world and renders accessible
HTML detail panels; `src/styles.css` defines responsive layouts.

The root `index.html` works on GitHub Pages at `/portfolio/`. The optional
Node server provides `/api/profile` locally; the published site loads the same
JSON directly, so GitHub Pages does not require a backend runtime.
