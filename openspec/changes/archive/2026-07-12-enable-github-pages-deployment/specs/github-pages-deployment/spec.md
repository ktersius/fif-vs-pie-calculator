## ADDED Requirements

### Requirement: Production build uses GitHub Pages project path
The application SHALL build production assets that resolve correctly when served from the repository GitHub Pages project path `/fif-vs-pie-calculator/`.

#### Scenario: Built site loads from project path
- **WHEN** the production build is served from `https://ktersius.github.io/fif-vs-pie-calculator/`
- **THEN** the generated HTML SHALL reference JavaScript and CSS assets using URLs that resolve under `/fif-vs-pie-calculator/`

### Requirement: GitHub Actions deploys the static build to Pages
The repository SHALL include a GitHub Actions workflow that builds the application and deploys the generated static output to GitHub Pages using the official GitHub Pages deployment actions.

#### Scenario: Primary branch push deploys site
- **WHEN** a push occurs on the repository's primary branch
- **THEN** the workflow SHALL install dependencies, run the production build, upload the `dist` output as a Pages artifact, and deploy that artifact to GitHub Pages

### Requirement: Deployment can be run manually
The GitHub Pages deployment workflow SHALL support manual execution.

#### Scenario: Maintainer starts deployment manually
- **WHEN** a maintainer dispatches the deployment workflow manually
- **THEN** the workflow SHALL build and deploy the same `dist` output used for primary-branch deployments

### Requirement: Deployment uses scoped GitHub Pages permissions
The deployment workflow SHALL request only the GitHub token permissions needed to read repository contents and deploy to GitHub Pages.

#### Scenario: Workflow runs with Pages permissions
- **WHEN** the deployment workflow starts
- **THEN** it SHALL request `contents: read`, `pages: write`, and `id-token: write` permissions for the deployment job
