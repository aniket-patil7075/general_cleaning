"use client";

import { useEffect, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Google Analytics ID from environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Client-side component that uses `useSearchParams`
const GoogleAnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoize search params to prevent unnecessary re-renders
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (pathname && window.gtag) {
      // Send page view with path
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, searchParamsString]);

  return null; // This component doesn't render anything
};

export default function GoogleAnalytics() {
  // Don't render anything if no GA ID is provided
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Suspense fallback={<div>Loading Google Analytics...</div>}>
      <GoogleAnalyticsTracker />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </Suspense>
  );
}