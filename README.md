# Alex Stopa — personal portfolio

React + TypeScript + Vite. Requires Node 22.12+.

## Develop

Run `npm ci`, then `npm run dev`. Website: http://127.0.0.1:5173.
Open `alex-stopa.code-workspace` in VS Code.

## Local content studio

Run `npm run studio` in a second terminal. Open http://127.0.0.1:5174.
Edit copy, projects, experience, links, and theme colors in the form. Save writes `content/site.json` atomically; Vite updates the preview. Lists support adding/removing entries; advanced JSON editing is available. New projects need unique IDs. Add images to `public/images`, then set `/images/filename.webp` in the editor.

Review `git diff`, commit changes, and `git push`. The editor never runs Git commands. It binds only to loopback, validates content, and requires a session token and matching origin for writes. It is excluded from the production bundle.

All editorial content and theme colors live in `content/site.json`. Layout: `src/App.tsx`. Dialog: `src/components/ProjectDialog.tsx`. Styles: `src/styles/global.css`. Palette values become CSS custom properties. Check contrast after changing colors. Short interface labels remain in the components.

## Verify and deploy

Run `npm run check` and `npm run build`. Preview production with `npm run preview`.
Deploy `dist/` to a static host such as Vercel, Netlify, or Cloudflare Pages. Build command: `npm run build`. No runtime server, secrets, CMS, or database required. Git push updates source; connect a host separately for automatic deployment.

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

