import type { AnalyticsEventName, AnalyticsEvents } from "./events";

// Provider-agnostic tracking. Supports Plausible and Umami (both cookie-less) when
// their script is added to the layout. Until then events are only logged in development.

type Props = Record<string, string | number>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    umami?: { track: (event: string, data?: Props) => void };
  }
}

export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;
  const data = props as Props;

  try {
    if (window.plausible) window.plausible(event, { props: data });
    else if (window.umami) window.umami.track(event, data);
  } catch {
    // Analytics must never break the product.
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, data);
  }
}
