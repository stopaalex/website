# Alex Stopa — personal portfolio

[View the live website on GitHub Pages](https://stopaalex.github.io/website/)

React + TypeScript + Vite. Requires Node 22.12+.

## Develop

Run `npm ci`, then `npm run dev`. Website: http://127.0.0.1:5173.
Open `alex-stopa.code-workspace` in VS Code.

## Local content studio

Run `npm run edit` to start the website and editor together. Open http://127.0.0.1:5174. Existing running servers are reused. Stop newly started servers with Ctrl+C.
Edit copy, projects, experience, links, and theme colors in the form. Save writes `content/site.json` atomically; Vite updates the preview. Lists support adding/removing entries; advanced JSON editing is available. New projects need unique IDs. Add images to `public/images`, then set `/images/filename.webp` in the editor.

Review changes in the editor, then commit and push when ready to publish. The editor only reads Git status and diffs; it never commits or pushes. It binds only to loopback, validates content, and requires a session token and matching origin for writes. It is excluded from the production bundle. Images can be uploaded directly in the form.

GitHub Pages is the intended static host. It cannot persist web-admin edits by itself. This setup deliberately uses local files and Git rather than adding a database, authentication service, or hosted CMS. Saving previews changes locally; publishing still requires a commit and push. A deployed admin that saves without commits would require external storage and authentication.

All editorial content and theme colors live in `content/site.json`. Layout: `src/App.tsx`. Dialog: `src/components/ProjectDialog.tsx`. Styles: `src/styles/global.css`. Palette values become CSS custom properties. Check contrast after changing colors. Short interface labels remain in the components.

## Verify and deploy

Use `develop` for everyday changes and as the repository default branch. Merge reviewed changes into `main` to publish. Only `main` can run the Pages deployment, including manual runs. After both branches are pushed, set the GitHub default branch with `gh repo edit stopaalex/website --default-branch develop`.

Run `npm run check` and `npm run build`. Preview production with `npm run preview`.
GitHub Pages deployment is configured in `.github/workflows/deploy.yml`. In the repository, open Settings → Pages and select GitHub Actions as the source. Push to `main` (or run the Deploy portfolio to GitHub Pages workflow manually). The workflow checks, builds, and publishes `dist/`. Expected URL: https://stopaalex.github.io/website/. Asset paths automatically follow the Pages base path, including a custom domain if configured later. No additional hosting service, database, or application secrets are required.

## Performance and accessibility

System fonts, compressed local WebP images, explicit image dimensions, lazy images and project dialogs, CSS artwork, one-time IntersectionObserver reveals, transform/opacity transitions. No animation library, autoplay media, tracking, or UI framework. Native dialog focus handling, keyboard controls, skip link, responsive navigation, and reduced motion support. Configure immutable caching for hashed `/assets/` files on your chosen host.

## Sources

Resume supplied by Alex and copied unchanged to `public/AlexStopa_Resume.pdf`. Personal positioning and AI experiment framing supplied by Alex.

- https://www.slytrunk.com/work/williams/ — credits Alex in frontend engineering; factual role context.
- https://www.slytrunk.com/work/mlsj/ — company context. Alex’s shared-platform contribution comes from his resume.
- https://www.slytrunk.com/labs/trash-panda/ — product context; contributor role from resume.
- https://www.linkedin.com/in/alex-stopa-1b080779/ — linked as supplied; automated retrieval unavailable, so no additional claims inferred.

Client work is credited to Slytrunk. No sole authorship, unverified metrics, or testimonials claimed. Images belong to their respective owners.

All portfolio copy is original and grounded in Alex's supplied facts. Featured projects are Williams (web and native app), Healthline (consumer web), and Trash Panda (native app only). Media captures show Williams Pit Wall Predictions and its help state, plus an interior Healthline article and reading view. Current captures illustrate the product context and do not imply Alex authored every displayed feature. App media slots are explicitly pending Alex's own screenshots; they are never substituted with marketing website captures.

To replace app placeholders: put a portrait screenshot in public/images, set the matching project's media entry image to /images/filename.webp, and change status from pending to captured. The local studio exposes those fields. Use original app captures, ideally without notifications or personal account information. Media states are selectable and transition within the project showcase.


Williams lead visual: Alex-supplied Williams ID screenshot (November 2026), replacing the prior Predictions captures. The full card and loyalty progress are preserved in the project preview.


Project navigation uses measured sticky-panel height and requestAnimationFrame-batched native scroll progress. The counter and named project buttons stay visible; scrolling forward/backward selects the corresponding project. Buttons navigate to the exact project position, and Skip projects exits to the approach section. No wheel or touch events are intercepted.


Trash Panda app images were supplied by Alex. Only personal Dynamic Island activity icons were redacted; the app UI is unchanged. Cleaned originals are available separately as PNGs, and site copies are lossless WebP. Views: Discover, Ingredients, Shopping lists.


Additional platform entry supplied by Alex: Alex Albon (specific scope not detailed). Healthline visuals now show the interior Nutrition article grid and expanded Wellness topic navigation, captured directly from the live site. Deloitte examples are high-level summaries of the supplied resume.


Williams mobile views now use Alex-supplied responsive web screenshots, ordered fan identity, live feed, and race results before desktop web. Only outer gray capture margins were removed; interface content was retained.

