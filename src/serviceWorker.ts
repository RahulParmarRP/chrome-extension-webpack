import { initializeStorageWithDefaults } from './storage';

chrome.runtime.onInstalled.addListener(async () => {
  // Here goes everything you want to execute after extension initialization

  await initializeStorageWithDefaults({});
  // const t = document.querySelector('a#thumbnail')
  // console.log(t);
  console.log('Extension successfully installed!');
});

// Log storage changes, might be safely removed
chrome.storage.onChanged.addListener((changes) => {
  for (const [key, value] of Object.entries(changes)) {
    console.log(
      `"${key}" changed from "${value.oldValue}" to "${value.newValue}"`,
    );
  }
});

function likeVideo(videoLink: any, callback: () => void) {
  chrome.runtime.sendMessage({ type: "openNewTab", url: videoLink }, function (response) {
    chrome.tabs.executeScript(response.tabId, {
      code: `
        const likeButton = document.querySelector('${YOUTUBE_VIDEO_LIKE_BUTTON}');
        if (likeButton) {
          if (!likeButton.getAttribute('aria-pressed')) {
            likeButton.click();
          }
        }
      `
    }, function () {
      chrome.tabs.remove(response.tabId, function () {
        callback();
      });
    });
  });
}



// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    // Use the chrome.tabs API to open a new tab
    chrome.tabs.create({ url: request.url }, function (tab) {
      // Send a message back to the content script to let it know that the tab has been created
      sendResponse({ action: "tabCreated", tab: tab });
    });
  }
});
