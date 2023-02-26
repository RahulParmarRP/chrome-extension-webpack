import { initializeStorageWithDefaults } from './storage';

chrome.runtime.onInstalled.addListener(async () => {
  // Here goes everything you want to execute after extension initialization
  await initializeStorageWithDefaults({});
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

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.action === "createTab") {
      console.log("inside the service worker request received", request);
      chrome.tabs.create({ url: request.url }, function (createdTab) {
        console.log("tab created", createdTab);
        chrome.scripting.executeScript({
          target: { tabId: createdTab.id },
          files: ["contentScript.js"],
        }, function () {
          console.log('send message to the content script of the created tab that it is ready to be liked');
          chrome.tabs.sendMessage(createdTab.id, { action: "readyToBeLiked", createdTab });
          // send to main tab
          // chrome.tabs.sendMessage(sender.tab.id, { message: "Hello from background script!", tab });
        })
      });
    }
  }
);