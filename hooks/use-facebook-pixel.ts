"use client"

import { trackEvent, trackCustomEvent } from "@/lib/facebook-pixel"

export function useFacebookPixel() {
  // Track a booking completion
  const trackBookingComplete = (bookingId: string, value: number) => {
    trackEvent("Purchase", {
      content_name: "Cleaning Service",
      content_category: "Service",
      content_ids: [bookingId],
      value: value,
      currency: "AED",
    })
  }

  // Track a lead form submission
  const trackLeadSubmission = (formType: string) => {
    trackEvent("Lead", {
      content_name: formType,
      content_category: "Lead",
    })
  }

  // Track a service view
  const trackServiceView = (serviceName: string) => {
    trackEvent("ViewContent", {
      content_name: serviceName,
      content_category: "Service",
    })
  }

  return {
    trackEvent,
    trackCustomEvent,
    trackBookingComplete,
    trackLeadSubmission,
    trackServiceView,
  }
}

