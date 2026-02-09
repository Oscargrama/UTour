// Google Analytics or other analytics integration

export const analytics = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      console.log("[v0] Analytics event:", eventName, properties)

      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", eventName, properties)
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq("track", eventName, properties)
      }
    }
  },

  trackPageView: (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        page_path: url,
      })
    }
  },
}

// Add type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}
