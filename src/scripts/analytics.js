/*
      Anthony Krivonos
      src/scripts/analytics.js
      10.22.2018
*/

'use strict';

// Global tracking ID
const TRACKING_ID = "UA-127981338-1";

// Global event constants
const EVENT = {
      PAGE_VIEW: 'pageview'
};

/*
 *
 *    Analytics Initialization
 *
 */

(function () {

      $(document).ready(function () {

            // Initialize Analytics Asynchronously
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            Analytics.createTracker();
            Analytics.sendEvent(EVENT.PAGE_VIEW);
      });

})();

/*
 *
 *    Analytics Encapsulation Class
 *
 */

class Analytics {

      // Creates a new tracker with an optional name
      static createTracker(withName = null) {
            if (withName) {
                  ga('create', TRACKING_ID, 'auto', withName);
            } else {
                  ga('create', TRACKING_ID, 'auto');
            }
            console.log(`💡 Created tracker '${withName ? withName : "[DEFAULT]"}'`)
      }

      // Creates a new tracker with an optional name
      static sendEvent(category = null, action = null, label = null, callback = null, toTracker = null) {
            ga(toTracker ? `send.${toTracker}` : 'send', 'event', category, action, label, {
                  hitCallback: function () {
                        console.log(`✅ Logged event '${label}':\n - Category: ${category}\n - Action: ${action}\n - Tracker: ${toTracker}`);
                        if (callback) callback();
                  }
            });
      }

}
