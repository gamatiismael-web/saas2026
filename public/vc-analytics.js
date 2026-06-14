// ValueConnection Analytics Tracking Script
// Usage: Add this script to your website to track analytics
// Configuration: Replace TRACKING_SCRIPT_ID with your unique ID from the dashboard

(function() {
  'use strict';

  // The URL this script was loaded from, e.g.
  // https://your-app.vercel.app/vc-analytics.js?id=vc_xxx
  const SCRIPT_URL = (document.currentScript && document.currentScript.src) || '';

  // Resolve the API endpoint. Priority:
  //   1. An explicit window.vc_api_endpoint override (advanced/manual use)
  //   2. The origin this very script was served from (auto-detected) — this is
  //      the dashboard app's domain, which is exactly where events should go.
  //   3. localhost as a last resort for local development only.
  function resolveEndpoint() {
    if (window.vc_api_endpoint) return window.vc_api_endpoint;
    try {
      if (SCRIPT_URL) return new URL(SCRIPT_URL).origin;
    } catch (e) {
      /* fall through */
    }
    return 'http://localhost:3000';
  }

  const API_ENDPOINT = resolveEndpoint();

  // Read the tracking ID from the ?id= query param on the script src.
  let TRACKING_SCRIPT_ID = '{{TRACKING_SCRIPT_ID}}';
  try {
    if (SCRIPT_URL) {
      TRACKING_SCRIPT_ID = new URL(SCRIPT_URL).searchParams.get('id') || '{{TRACKING_SCRIPT_ID}}';
    }
  } catch (e) {
    /* keep placeholder */
  }

  if (!TRACKING_SCRIPT_ID || TRACKING_SCRIPT_ID === '{{TRACKING_SCRIPT_ID}}') {
    console.warn('[VC Analytics] Tracking script ID not configured');
    return;
  }

  // Session management
  class SessionManager {
    constructor() {
      this.sessionId = this.getOrCreateSessionId();
      this.visitorId = this.getOrCreateVisitorId();
      this.sessionStartTime = Date.now();
      this.pageViewCount = 0;
    }

    getOrCreateSessionId() {
      let sessionId = sessionStorage.getItem('vc_session_id');
      if (!sessionId) {
        sessionId = this.generateId();
        sessionStorage.setItem('vc_session_id', sessionId);
      }
      return sessionId;
    }

    getOrCreateVisitorId() {
      let visitorId = localStorage.getItem('vc_visitor_id');
      if (!visitorId) {
        visitorId = this.generateId();
        localStorage.setItem('vc_visitor_id', visitorId);
      }
      return visitorId;
    }

    generateId() {
      return 'vc_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    getSessionDuration() {
      return Math.round((Date.now() - this.sessionStartTime) / 1000);
    }

    recordPageView() {
      this.pageViewCount += 1;
    }
  }

  // Analytics tracker
  class AnalyticsTracker {
    constructor(sessionManager) {
      this.session = sessionManager;
      this.queue = [];
      this.isOnline = navigator.onLine;
      this.setupEventListeners();
    }

    setupEventListeners() {
      // Track page view on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.trackPageView());
      } else {
        this.trackPageView();
      }

      // Track session start
      window.addEventListener('load', () => this.trackSessionStart());

      // Track before unload
      window.addEventListener('beforeunload', () => this.trackSessionEnd());

      // Handle online/offline
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      // Track page visibility
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackSessionEnd();
        } else {
          this.trackSessionStart();
        }
      });
    }

    trackPageView() {
      this.session.recordPageView();
      this.sendEvent('pageview', {
        page_url: window.location.href,
        referrer: document.referrer,
        title: document.title,
      });
    }

    trackSessionStart() {
      this.sendEvent('session_start', {
        pages_in_session: this.session.pageViewCount,
      });
    }

    trackSessionEnd() {
      this.sendEvent('session_end', {
        session_duration: this.session.getSessionDuration(),
        pages_in_session: this.session.pageViewCount,
      });
    }

    getDeviceInfo() {
      const ua = navigator.userAgent;
      const uaData = navigator.userAgentData;
      
      // Detect device type
      let deviceType = 'desktop';
      if (/mobile/i.test(ua)) deviceType = 'mobile';
      if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

      return {
        device_type: deviceType,
        browser_name: this.parseBrowser(ua),
        os_name: this.parseOS(ua),
      };
    }

    getLocationInfo() {
      // This would ideally use the Geo IP API on the server side
      // For now, we'll collect timezone info
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    parseBrowser(ua) {
      if (/Chrome/.test(ua)) return 'Chrome';
      if (/Safari/.test(ua)) return 'Safari';
      if (/Firefox/.test(ua)) return 'Firefox';
      if (/Edge/.test(ua)) return 'Edge';
      return 'Unknown';
    }

    parseOS(ua) {
      if (/Windows/.test(ua)) return 'Windows';
      if (/Mac/.test(ua)) return 'macOS';
      if (/Linux/.test(ua)) return 'Linux';
      if (/Android/.test(ua)) return 'Android';
      if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
      return 'Unknown';
    }

    sendEvent(eventType, additionalData = {}) {
      const event = {
        tracking_script_id: TRACKING_SCRIPT_ID,
        session_id: this.session.sessionId,
        visitor_id: this.session.visitorId,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...this.getDeviceInfo(),
        ...this.getLocationInfo(),
        ...additionalData,
      };

      if (this.isOnline) {
        this.sendRequest(event);
      } else {
        this.queue.push(event);
      }
    }

    sendRequest(event) {
      if (!API_ENDPOINT) {
        console.warn('[VC Analytics] API endpoint not configured');
        return;
      }

      // Use sendBeacon for reliability if available
      if (navigator.sendBeacon && event.event_type === 'session_end') {
        navigator.sendBeacon(
          `${API_ENDPOINT}/api/tracking/events`,
          JSON.stringify(event)
        );
        return;
      }

      // Otherwise use fetch
      fetch(`${API_ENDPOINT}/api/tracking/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tracking-Script-ID': TRACKING_SCRIPT_ID,
        },
        body: JSON.stringify(event),
        keepalive: true,
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(data => {
              console.error('[VC Analytics] Event failed:', {
                status: res.status,
                tracking_script_id: TRACKING_SCRIPT_ID,
                api_endpoint: API_ENDPOINT,
                error: data.detail || data.message,
              });
            });
          }
          return res.json();
        })
        .catch(err => {
          console.error('[VC Analytics] Failed to send event:', {
            error: err.message,
            api_endpoint: API_ENDPOINT,
            tracking_script_id: TRACKING_SCRIPT_ID,
          });
          this.queue.push(event);
        });
    }
      });
    }

    flushQueue() {
      while (this.queue.length > 0) {
        const event = this.queue.shift();
        this.sendRequest(event);
      }
    }
  }

  // Initialize tracking
  const sessionManager = new SessionManager();
  const tracker = new AnalyticsTracker(sessionManager);

  // Expose global object for custom events
  window.vc_analytics = {
    trackConversion: (conversionType, value) => {
      tracker.sendEvent('conversion', {
        conversion_type: conversionType,
        conversion_value: value,
      });
    },
    trackCustomEvent: (eventName, data) => {
      tracker.sendEvent('custom', {
        event_name: eventName,
        event_data: data,
      });
    },
  };
})();
