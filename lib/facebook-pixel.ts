type EventType =
  | "PageView"
  | "AddToCart"
  | "Purchase"
  | "CompleteRegistration"
  | "Contact"
  | "Lead"
  | "Schedule"
  | "Search"
  | "ViewContent"

type EventProps = {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  contents?: any[]
  content_type?: string
  value?: number
  currency?: string
  [key: string]: any
}

// Track a standard event
export const trackEvent = (eventName: EventType, props?: EventProps) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, props)
  }
}

// Track a custom event
export const trackCustomEvent = (eventName: string, props?: EventProps) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, props)
  }
}

// Type definitions for global window object
declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

