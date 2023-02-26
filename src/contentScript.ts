/* eslint-disable no-debugger */
console.log('content script loaded');

const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row a#thumbnail'
const YOUTUBE_VIDEO_LIKE_BUTTON = '#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button'


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

const delay = (seconds = 3) => {
    const start = new Date().getTime();
    let end = start;
    while (end < start + seconds * 1000) {
        end = new Date().getTime();
    }
};


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
            // window.scrollBy(0, 10)

            const scrollAmount = 500; // customize this value
            const event = new CustomEvent('myScroll', { detail: { scrollAmount: scrollAmount, index: i } });
            window.dispatchEvent(event);
            // videos[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

            // setTimeout(() => {
            //     const scrollAmount = 500; // customize this value
            //     const event = new CustomEvent('myCustomEvent', { detail: { scrollAmount: scrollAmount, index: i } });
            //     window.dispatchEvent(event);
            // }, 1000)

            // const scrollAmount = 100; // customize this value
            // const event = new CustomEvent('myCustomEvent', { detail: { scrollAmount: scrollAmount } });
            // window.dispatchEvent(event);

            // videos[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
            // Scroll to the video element
            delay(5)
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

function likeYoutubeVideo(videoLink: any, callback: { (): void; (): void; }) {

    chrome.tabs.create({ url: videoLink }, function (newTab) {
        chrome.tabs.executeScript(newTab.id, {
            code: `
        const likeButton = document.querySelector('${YOUTUBE_VIDEO_LIKE_BUTTON}');
        if (likeButton) {
          if (!Bool(likeButton.getAttribute('aria-pressed'))) {
            likeButton.click();
          }
        }
      `
        }, function () {
            chrome.tabs.remove(newTab.id);
            callback();
        });
    });
}


function checkLikeButton() {
    return new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(() => {
            const likeButton = document.querySelector(YOUTUBE_VIDEO_LIKE_BUTTON)
            if (likeButton) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 500);
    });
}


function likeVideo2Dom() {
    try {
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
    } catch (e) {
        console.log("Some error occurred while liking the video");
    }
}


// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("received at content script", message, sender);
    if (message.action === "readyToBeLiked") {
        // Do something with the newly created tab
        console.log("window", window);
        console.log("newly created tab", message.createdTab);
        checkLikeButton()
            .then(() => {
                console.log('like button ready to be clicked');
                likeVideo2Dom()
                setTimeout(() => {
                    console.log('at last close the window regardless of error');
                    window.close()
                }, 20000)
            })
    }
});

async function initiateServiceWorkerToCreateTab(url: string) {
    // Send a message to the background script
    chrome.runtime.sendMessage({ action: "createTab", url });
    console.log('sent message to service worker for tab creation');
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




function clickVideos(startIndex: number) {
    // Get all video thumbnails on the page
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    console.log('new count of the total videos', videos);

    // Keep track of the current video index
    let videoIndex = startIndex;

    // Set up an interval to click on the video thumbnails
    function intervalFunction(videos: any[]) {
        console.log(`Current video index: ${videoIndex}`);

        // Check if the current video index is within the bounds of the videos array
        if (videos[videoIndex]) {
            // Scroll the current video thumbnail into view
            videos[videoIndex].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

            // Get the URL of the video from the thumbnail and open it in a new tab
            const videoLink = videos[videoIndex].href;

            initiateServiceWorkerToCreateTab(videoLink)
        }

        // Increment the video index
        videoIndex++;

        // Check if the end of the video list has been reached
        if (videoIndex === videos.length) {
            const lastIndex = videoIndex + 1
            console.log("last clicked video index", videoIndex);

            // Clear the  last interval function to stop clicking on those videos
            clearInterval(interval);

            // Schedule the next round of video clicking after a delay of 5 seconds
            setTimeout(function () {
                console.log("Restarting video click process...");
                clickVideos(lastIndex);
            }, 7000);
        }
    }

    const interval = setInterval(intervalFunction, 20000, videos)
}


window.addEventListener('myCustomEvent', function () {
    console.log('event occurred');
    // videos[index].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    // startLikingVideos()
    // scrollDownTillEnd();
    // clickVideo(startIndex);
    // clickVideos(8);
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    initiateServiceWorkerToCreateTab(videos[8].href)
});

