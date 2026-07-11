## Context

The application is a Vite React static site. The existing `npm run build` script type-checks the project and emits production assets to `dist`, but there is no deployment automation and the Vite config currently does not define a GitHub Pages project-site base path.

The intended public URL is the repository project site at `https://ktersius.github.io/fif-vs-pie-calculator/`, which means production assets must be built with `/fif-vs-pie-calculator/` as their base URL.

## Goals / Non-Goals

**Goals:**
- Produce a static production build that loads correctly from the GitHub Pages project path.
- Deploy the `dist` build output to GitHub Pages through GitHub Actions.
- Use the official GitHub Pages actions rather than a `gh-pages` branch or `gh-pages` CLI deployment.
- Support both automatic deployment from the primary branch and manual deployment runs.

**Non-Goals:**
- Change calculator behavior, visual layout, tax logic, or simulation logic.
- Add a custom domain.
- Introduce a separate hosting provider or server-side runtime.
- Commit generated `dist` assets to the source branch.

## Decisions

1. Configure Vite with `base: '/fif-vs-pie-calculator/'` for production assets.

   GitHub Pages project sites are served from a repository subpath, so absolute asset URLs must include the repository name. Keeping this in Vite config allows local development to keep using the dev server while production builds emit correct asset references.

   Alternative considered: use root-relative `/` paths. This works only for a root/user site or custom domain and would break the repository project URL.

2. Deploy with the official GitHub Pages Actions flow.

   The workflow will build the app, upload `dist` via `actions/upload-pages-artifact`, and publish it with `actions/deploy-pages`. This avoids maintaining a generated `gh-pages` branch and aligns with GitHub's current Pages deployment model.

   Alternative considered: use the `gh-pages` package/CLI. That would require an additional dev dependency or external command and a branch-based deployment model that is unnecessary for this static Vite app.

3. Trigger deployments on pushes to the primary branch and via `workflow_dispatch`.

   Automatic deployment keeps the published site current after changes are merged. Manual dispatch gives maintainers a way to redeploy without creating a new commit.

4. Grant only the permissions required by GitHub Pages deployment.

   The workflow will use `contents: read`, `pages: write`, and `id-token: write`, with the Pages environment URL sourced from the deployment step output. This keeps deployment permissions scoped to the official Pages action requirements.

## Risks / Trade-offs

- GitHub Pages source is not configured for GitHub Actions -> The workflow can build successfully but Pages will not serve the deployment until repository settings use GitHub Actions as the Pages source.
- Repository name changes -> The configured Vite base path must be updated to match the new project-site path.
- Deployments from non-primary branches are not automatic -> Manual workflow dispatch remains available for explicit redeploys, but routine publishing follows the primary branch.
