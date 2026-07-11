## 1. Build Configuration

- [x] 1.1 Configure Vite to build production assets with the `/fif-vs-pie-calculator/` base path.
- [x] 1.2 Run the production build and confirm `dist/index.html` references generated assets under `/fif-vs-pie-calculator/`.

## 2. GitHub Pages Workflow

- [x] 2.1 Add a GitHub Actions workflow for Pages deployment triggered by pushes to the primary branch and by `workflow_dispatch`.
- [x] 2.2 Configure the workflow to install dependencies, run `npm run build`, and upload the `dist` directory with `actions/upload-pages-artifact`.
- [x] 2.3 Configure the workflow deployment job to use `actions/deploy-pages` with `contents: read`, `pages: write`, and `id-token: write` permissions.

## 3. Verification

- [x] 3.1 Run the local build command successfully after the Vite configuration change.
- [x] 3.2 Verify the workflow file is syntactically valid YAML and points at the `dist` build output.
