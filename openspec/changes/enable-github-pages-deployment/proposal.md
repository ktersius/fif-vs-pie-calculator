## Why

The calculator is currently a local Vite app with no automated way to publish a static build. Publishing through GitHub Pages will make the site accessible from the repository's project URL without requiring a separate hosting service.

## What Changes

- Add a production build configuration suitable for the GitHub Pages project URL `/fif-vs-pie-calculator/`.
- Add a GitHub Actions workflow that builds the Vite app and deploys the generated static assets to GitHub Pages using the official Pages actions.
- Enable manual deployment runs in addition to deployments from pushes to the primary branch.

## Capabilities

### New Capabilities
- `github-pages-deployment`: Defines how the application is built and deployed to GitHub Pages as a static site.

### Modified Capabilities
- None.

## Impact

- Affected application configuration: Vite build configuration.
- Affected automation: GitHub Actions workflow configuration.
- Affected repository settings: GitHub Pages must be configured to use GitHub Actions as the source.
- No runtime API, calculation, or user-interface behavior changes are expected.
