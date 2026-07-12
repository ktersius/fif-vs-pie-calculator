## Context

The calculator is a static Vite React app deployed to GitHub Pages. GitHub Pages does not provide application-level visitor analytics, so basic usage visibility requires a browser-side analytics service.

GoatCounter is a lightweight privacy-conscious analytics option that supports automatic pageviews and explicit custom events through `window.goatcounter.count(...)`. Because the calculator handles financial assumptions, analytics must avoid sending user-entered amounts, rates, balances, tax values, or simulation outputs.

## Goals / Non-Goals

**Goals:**
- Track basic pageviews for the GitHub Pages site.
- Track a small set of anonymous high-level UI interactions.
- Keep analytics optional/configurable so local development and forks can run without a GoatCounter account.
- Avoid collecting financial input values, calculated results, or user identifiers.

**Non-Goals:**
- Add cookie-based user tracking or advertising analytics.
- Track individual investment amounts, tax rates, balances, or calculated outputs.
- Add a server-side analytics collector.
- Build an in-app analytics dashboard.

## Decisions

1. Use GoatCounter as the analytics provider.

   GoatCounter fits the static-site deployment model because it can be loaded from the page and can receive custom event counts from client-side handlers. It provides enough detail for basic usage without adding a backend.

   Alternative considered: Google Analytics. It provides more detail but is heavier and has more privacy and consent implications than needed for this project.

2. Make the GoatCounter endpoint configurable.

   The implementation should read the GoatCounter count endpoint from a Vite environment variable, such as `VITE_GOATCOUNTER_ENDPOINT`. The intended endpoint for this site is `https://ktersius.goatcounter.com/count`. If it is not configured, analytics should be disabled without breaking the app.

   This keeps the production account explicit while letting forks or local environments opt out.

3. Load GoatCounter once from the static app shell.

   The app should load GoatCounter's script from the Vite HTML entry point or an equivalent single app-shell location. The script should only be emitted or activated when a GoatCounter endpoint is configured.

4. Centralize custom event tracking behind a helper.

   A small analytics helper should expose named event tracking functions or a typed `trackEvent` wrapper. UI code should call that helper rather than directly referencing `window.goatcounter`, keeping event names consistent and making analytics no-op behavior testable. The helper should debounce events by event name so rapid interactions, such as dragging a crash-depth slider, do not send excessive GoatCounter requests.

5. Track only anonymous interaction categories.

   Initial events should be limited to:
   - `/event/reroll-crash-years`
   - `/event/adjust-crash-depth`
   - `/event/expand-year-breakdown`
   - `/event/click-tax-chart-year`

   These describe app usage without including the user's financial assumptions or model results.

## Risks / Trade-offs

- Analytics endpoint not configured -> Pageviews and events are not sent; document the required environment variable and keep the app functional.
- Ad blockers block GoatCounter -> Analytics undercounts usage; accept this as a privacy-friendly analytics trade-off.
- Custom events become too granular over time -> Keep a documented allowlist of event names and avoid values/payloads.
- Rapid repeated interactions trigger GoatCounter rate limiting -> Debounce event sends per event name before calling GoatCounter.
- External script load failure -> GoatCounter should fail open; the calculator must continue to load and function.
