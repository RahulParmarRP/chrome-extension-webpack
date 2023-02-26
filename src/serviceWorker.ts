/* eslint-disable no-debugger */
import { initializeStorageWithDefaults } from './storage';


const delay = (seconds = 3) => {
  const start = new Date().getTime();
  let end = start;
  while (end < start + seconds * 1000) {
    end = new Date().getTime();
  }
};


function syncDelay(seconds) {
  const start = new Date().getTime();
  const milliseconds = seconds * 1000; // convert seconds to milliseconds
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}


function likeVideo2Dom() {
  // alert('like')
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

const showAlert2 = () => {
  console.log("showAlert - service worker script");
  alert('removal')
}

const showAlert = () => {
  console.log("showAlert - service worker script");
  alert('start')
  // syncDelay(20)
  // alert('20 sec')
  // likeVideo2Dom()
  // alert('test')
  debugger
  // alert('like')
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

// chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
//   if (message.type === "openNewTabFromContentScriptToServiceWorker") {
//     const result3 = await chrome.tabs.create({ url: message.url });

//     // Instead of using sendResponse, use chrome.runtime.sendMessage to send the response
//     chrome.runtime.sendMessage({ action: "openedTabFromServiceWorkerToContentScript", testData: 'test', result: result3 }, function (response) {
//       console.log(response);
//     });

//     // You should not use sendResponse after chrome.runtime.sendMessage
//     // sendResponse({result: result3});

//     // Make sure to return a Promise from the listener function
//     return Promise.resolve();
//   }
// });



// Listen for messages from the content script
// chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {


//   if (message.type === "openNewTabFromContentScriptToServiceWorker") {
//     console.log('trying open new tab from service worker');
//     // sendResponse({ action: "tabCreated" });
//     // chrome.runtime.sendMessage({ action: "openNewTabFromContentScriptToServiceWorker" })

//     const callbacktosend = (tab: any) => {
//       sendResponse({ action: "openedTabFromServiceWorkerToContentScript", tab })
//     }

//     console.log("tabCreatedFromServiceWorkerSendToContentScript", sender);
//     // sendResponse({ action: "openedTabFromServiceWorkerToContentScript" })

//     /*
//     // Open the video in a new tab
//     chrome.tabs.create({ url: message.url }, function (tab) {
//       // Add an event listener to the new tab to wait for the page to load
//       chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
//         // If the page has finished loading
//         if (tabId === tab.id && changeInfo.status === 'complete') {
//           // Remove the event listener
//           chrome.tabs.onUpdated.removeListener(listener);
//           // debugger
//           // syncDelay(20)
//           // debugger
//           console.log('tabCreated from service worker', tab);
//           callbacktosend(tab)
//           // sendResponse({ action: "openedTabFromServiceWorkerToContentScript", tab })
//           console.log('sent tab to content script', tab);

//           // const likeButtons = document.querySelectorAll(YOUTUBE_VIDEO_LIKE_BUTTON);
//           // if (likeButtons?.length) {
//           //   const button = likeButtons[0];
//           //   const isLiked = button.getAttribute("aria-pressed");
//           //   console.log(`Is video liked: ${isLiked}`);
//           //   if (isLiked === 'true') {
//           //     console.log("Already liked");
//           //   } else {
//           //     button.click();
//           //     console.log("Liked");
//           //   }
//           // }
//           // Find the like button on the new page and click it
//           // chrome.scripting.executeScript({
//           //   target: { tabId: newTab.id },
//           //   // files: ["script.js"],
//           //   func: showAlert,
//           //   // args: ['script executed']
//           // }, function () {

//           //   setTimeout(() => {
//           //     // Close the new tab
//           //     chrome.tabs.remove(newTab.id);
//           //   }, 4000)


//           //   // Switch back to the original tab
//           //   // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//           //   //   chrome.tabs.update(tabs[0].id, { active: true });
//           //   // });
//           // });


//         }
//       });
//     });
//     */

//     // Use the chrome.tabs API to open a new tab
//     const result3 = await chrome.tabs.create({ url: message.url })
//     sendResponse({ action: "openedTabFromServiceWorkerToContentScript", testData: 'test', result3 });

//     // .
//     //   then(function (tab) {

//     //     // chrome.scripting.executeScript({
//     //     //   target: { tabId: tab.id },
//     //     //   // files: ["script.js"],
//     //     //   func: showAlert,
//     //     //   // args: ['script executed']
//     //     // })
//     //     //   .then(function () {

//     //     //     delay(15)
//     //     //     alert('removal')
//     //     //     // likeVideo2Dom()
//     //     //     // delay()
//     //     //     console.log('close tab');
//     //     //     chrome.tabs.remove(tab.id);
//     //     //     // call back
//     //     //     chrome.browsingData.removeCache({}, function () {
//     //     //       console.log('Cache cleared.');
//     //     //     })
//     //     //   });

//     //     // Send a message back to the content script to let it know that the tab has been created
//     //     sendResponse({ action: "tabCreated", tab });
//     //   });

//   }
// });


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