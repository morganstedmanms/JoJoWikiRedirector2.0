// Simple extension to redirect all requests to JoJo Fandom to JoJo Wiki
(function(){
  'use strict';
  let isPluginDisabled = false; // Variable storing whether or not the plugin is disabled.
  let storage = (typeof chrome.storage === "undefined") ? browser.storage : chrome.storage; // Check to see if using Chrome or Firefox

  const WIKIA_REGEX = /^jojo\.(wikia|fandom)\.com$/i; // Used to match the domain of the old wikia/fandom to make sure we are redirecting the correct domain.

  // Listen to before anytime the browser attempts to navigate to the old Wikia/Fandom sites.
  chrome.webNavigation.onBeforeNavigate.addListener(
    function(info) {
      if(isPluginDisabled) { // Ignore all navigation requests when the extension is disabled.
        console.log("JoJo Fandom intercepted, ignoring because plugin is disabled.");
        return;
      }

      // Create a native URL object to more easily determine the path of the url and the domain.
      const url = new URL(info.url);

      const isWikia = WIKIA_REGEX.test(url.host); // Check to ensure the redirect is occurring on either the fandom/wikia domain.
      // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if (!isWikia) return;

      // Generate new url
      const host = 'jojowiki';
      const redirectUrl = `https://${host}.com${url.pathname.replace(/^\/wiki\//i,"/")}`; // Create the redirect URL
      console.log(`JoJo Fandom intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`); 
      // Redirect the old wikia request to new wiki
      chrome.tabs.update(info.tabId,{url:redirectUrl});
    });

  function updateIcon(){
    // Change the icon to match the state of the plugin.
    chrome.action.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  });
  }

  storage.local.get(['isDisabled'],(result)=>{
      // Get the initial condition of whether or not the extension is disabled
      isPluginDisabled= result ? result.isDisabled : false;
      updateIcon(); // Update icon to match new state
  });

  // Anytime the state of the plugin changes, update the internal state of the background script.
  storage.onChanged.addListener(
      function(changes, areaName) {
        // If isDisabled changed, update isPluginDisabled
        if(changes["isDisabled"]!==undefined && changes["isDisabled"].newValue!=changes["isDisabled"].oldValue) {
          console.log(`JoJo Fandom Redirector is now ${changes["isDisabled"].newValue?'disabled':'enabled'}`);
          isPluginDisabled=changes["isDisabled"].newValue;
          updateIcon();
        }
      }
    );
})();
