"use client";

import { useEffect, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Facebook Pixel ID from environment variable
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Client-side component that uses `useSearchParams`
const FacebookPixelTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoize search params to prevent unnecessary re-renders
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    // Track page views on route change
    if (pathname && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParamsString]); // Use memoized value

  return null; // This component doesn't render anything
};

export default function FacebookPixel() {
  // Don't render anything if no pixel ID is provided
  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Suspense fallback={<div>Loading Facebook Pixel...</div>}>
        <FacebookPixelTracker />
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;n.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}