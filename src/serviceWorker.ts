/* eslint-disable no-debugger */
import { initializeStorageWithDefaults } from './storage';


const delay = (seconds = 3) => {
  const start = new Date().getTime();
  let end = start;
  while (end < start + seconds * 1000) {
    end = new Date().getTime();
  }
};



function likeVideo2Dom() {
  alert('like')
  const likeButtons = document.querySelectorAll(YOUTUBE_VIDEO_LIKE_BUTTON);
  if (likeButtons?.length) {
    const button = likeButtons[0];
    const isLiked = button.getAttribute("aria-pressed");
    console.log(`Is video liked: ${isLiked}`);
    if (isLiked === 'true') {
      console.log("Already liked");
    } else {
      button.click();
      console.log("Liked");
    }
  }
}

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


const showAlert = () => {
  console.log("showAlert - service worker script");
  alert('start')
  delay(20)
  alert('20 sec')
  likeVideo2Dom()
  // alert('test')
}



// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "openNewTab") {

    console.log('open new tab');


    // Open the video in a new tab
    chrome.tabs.create({ url: request.url }, function (newTab) {
      // Add an event listener to the new tab to wait for the page to load
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        // If the page has finished loading
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          // Remove the event listener
          chrome.tabs.onUpdated.removeListener(listener);

          // Find the like button on the new page and click it
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            // files: ["script.js"],
            func: showAlert,
            // args: ['script executed']
          }, function () {
            // Close the new tab
            chrome.tabs.remove(newTab.id);

            // Switch back to the original tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              chrome.tabs.update(tabs[0].id, { active: true });
            });
          });
        }
      });
    });
    // Use the chrome.tabs API to open a new tab
    chrome.tabs.create({ url: request.url }).
      then(function (tab) {

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          // files: ["script.js"],
          func: showAlert,
          // args: ['script executed']
        })
          .then(function () {

            delay(15)
            alert('removal')
            // likeVideo2Dom()
            // delay()
            console.log('close tab');
            chrome.tabs.remove(tab.id);
            // call back
            chrome.browsingData.removeCache({}, function () {
              console.log('Cache cleared.');
            })
          });

        // Send a message back to the content script to let it know that the tab has been created
        sendResponse({ action: "tabCreated", tab: tab });
      });

  }
});
