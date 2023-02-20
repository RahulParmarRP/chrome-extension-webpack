/* eslint-disable no-debugger */
import '../styles/popup.scss';
const likeVideos = document.getElementById("like-videos")



// Define a function to click on videos
function startLikingVideos() {

  const delay = (seconds = 3) => {
    const start = new Date().getTime();
    let end = start;
    while (end < start + (seconds * 1000)) {
      end = new Date().getTime();
    }
  }
  const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row a#thumbnail'
  const YOUTUBE_VIDEO_LIKE_BUTTON = '#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button'

  const scrollElement = (element: any) => {
    // window.scrollBy(0, 100);
    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
  }

  alert()
  console.log(window.origin);

  console.log('get videos...');
  // Get all the video elements
  const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
  console.log("total videos found ---------", videos)
  // Define the starting index
  let start = 0;
  //  keep track of the last video index that was clicked
  let last_index = start - 1
  while (start < videos.length) {
    console.log('start scroll...');
    for (let i = start; i < videos.length; i++) {
      // console.log(i);
      // const video = videos[i]
      // delay(5)
      // setTimeout(() => {
      //   console.log('set time out');
      //   videos[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
      // }, 0)
      // alert()
      // scrollElement(videos[i])
      console.log('start scroll into view...', i)

      setTimeout(() => {
        const scrollAmount = 500; // customize this value
        const event = new CustomEvent('myCustomEvent', { detail: { scrollAmount: scrollAmount, index: i } });
        window.dispatchEvent(event);
      }, 1000)
      // const scrollAmount = 100; // customize this value
      // const event = new CustomEvent('myCustomEvent', { detail: { scrollAmount: scrollAmount } });
      // window.dispatchEvent(event);

      // videos[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
      // Scroll to the video element
      delay(10)
      last_index = i
    }


    /*
        // Open the video in a new tab
        const videoLink = videos[start].href;
        const videoTab = window.open(videoLink, '_blank');
    
        // Wait for the video to load and then simulate clicking the like button
        videoTab.addEventListener("load", () => {
          const likeButton = videoTab.document.querySelector(".like-button");
          if (likeButton) {
            likeButton.click();
          }
          // Close the tab after a short delay
          setTimeout(() => {
            videoTab.close();
          }, 500);
        });
    */




    start = last_index + 1
    console.log(start);
    // console.log("last index -----------", start, last_index)
    // videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    // console.log("total videos found ---------", videos.length)
  }



  // Wait for a short delay to give the browser time to open the new tabs
  // setTimeout(() => {
  //   // Get a list of all open tabs
  //   const tabs = Array.from(window.top.window.frames).filter(frame => frame.length > 0);

  //   // Switch to the last open tab
  //   const lastIndex = tabs.length - 1;
  //   tabs[lastIndex].focus();
  // }, 2000);

  // Repeat the function after a delay of 5 to 10 seconds to simulate user interaction
  // const repeatDelay = Math.floor(Math.random() * 5000) + 5000;
  // setTimeout(startLikingVideos, repeatDelay);
}

document.getElementById('go-to-options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});


async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function showAlert() {
  const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row a#thumbnail'
  console.log('test');
  alert()
  const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
  console.log("total videos found ---------", videos.length)
  // videos[4].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
  // videos[4].click()
  // console.log(videos[4]);
  // const videoLink = videos[4].href;
  // console.log(videoLink);
  // const videoTab = window.open(videoLink, '_blank');


  // videoTab.addEventListener("load", () => {
  //   // const likeButton = videoTab.document.querySelector(".like-button");
  //   // if (likeButton) {
  //   //   likeButton.click();
  //   // }
  //   // Close the tab after a short delay
  //   setTimeout(() => {
  //     videoTab.close();
  //   }, 2000);
  // });

  const scrollAmount = 500; // customize this value
  const event = new CustomEvent('myCustomEvent', { detail: { scrollAmount: scrollAmount, index: 4 } });
  window.dispatchEvent(event);
}


// likeVideos.addEventListener('click', async () => {
//   const tab = await getCurrentTab();

//   const name = 'World';
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: showAlert,
//     args: [name]
//   });
// });



// likeVideos.addEventListener('click', async () => {
//   const tab = await getCurrentTab();

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['contentScript.js']
//   });
// });

likeVideos.addEventListener('click', async () => {
  const tab = await getCurrentTab();

  const name = 'World';
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showAlert,
    // func: startLikingVideos,
  });
  chrome.tabs.create({ url: "https://www.youtube.com/@sadhguru/videos" })

});
