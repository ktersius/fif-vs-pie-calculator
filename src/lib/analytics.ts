const goatCounterEndpoint = import.meta.env.VITE_GOATCOUNTER_ENDPOINT;
const goatCounterScriptId = 'goatcounter-script';

export const analyticsEvents = {
  rerollCrashYears: {
    path: '/event/reroll-crash-years',
    title: 'Re-roll crash years',
  },
  adjustCrashDepth: {
    path: '/event/adjust-crash-depth',
    title: 'Adjust crash depth',
  },
  expandYearBreakdown: {
    path: '/event/expand-year-breakdown',
    title: 'Expand year breakdown',
  },
  clickTaxChartYear: {
    path: '/event/click-tax-chart-year',
    title: 'Click tax chart year',
  },
} as const;

export type AnalyticsEvent = keyof typeof analyticsEvents;

export function initializeAnalytics() {
  if (!goatCounterEndpoint || document.getElementById(goatCounterScriptId)) {
    return;
  }

  const script = document.createElement('script');
  script.id = goatCounterScriptId;
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = goatCounterEndpoint;
  document.head.appendChild(script);
}

export function trackEvent(event: AnalyticsEvent) {
  const details = analyticsEvents[event];
  try {
    window.goatcounter?.count(details);
  } catch (error) {
    console.warn('GoatCounter analytics event failed', error);
  }
}
