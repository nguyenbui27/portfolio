# Thao Nguyen Bui Full-Stack Portfolio

This is a VS Code-ready portfolio project with a tiny Node backend and a browser frontend.

## Run

```bash
npm run dev
```

Then open:

```text
http://[::1]:8017
```

## Structure

- `server.mjs` serves static files and exposes `GET /api/profile`.
- `data/profile.json` contains resume and project content.
- `src/` contains the HTML, CSS, and frontend renderer.
- `.vscode/` includes a launch configuration and a `Run portfolio` task.

## Customize

Edit `data/profile.json` to change project descriptions, links, metrics, skills, and contact details.
