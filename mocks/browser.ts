import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

/**
 * Setup Mock Service Worker for browser
 * This enables API mocking during development
 */
export const worker = setupWorker(...handlers)

/**
 * Start the MSW worker
 * Call this function in your application entry point (e.g., app initialization)
 */
export async function startMockServiceWorker() {
  if (typeof window === "undefined") {
    // Don't start MSW in server-side rendering
    return
  }

  if (process.env.NODE_ENV === "development") {
    try {
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      })
      console.log("[MSW] Mocking enabled")
    } catch (error) {
      console.error("[MSW] Failed to start:", error)
    }
  }
}
