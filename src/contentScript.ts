console.log('content script loaded');
const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row a#thumbnail'
const YOUTUBE_VIDEO_LIKE_BUTTON = '#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button'


function syncDelay(seconds: number) {
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


function likeVideoIntoDOM() {
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
                likeVideoIntoDOM()
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

function clickAllVideos(startIndex: number) {
    // Get all video thumbnails on the page
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    console.log('new count of the total videos', videos);

    // Keep track of the current video index
    let videoIndex = startIndex;

    // Set up an interval to click on the video thumbnails
    function intervalFunction(allVideos: any[]): void {
        console.log(`Current video index: ${videoIndex}`);

        // Check if the current video index is within the bounds of the videos array
        if (allVideos[videoIndex]) {
            // Scroll the current video thumbnail into view
            allVideos[videoIndex].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

            // Get the URL of the video from the thumbnail and open it in a new tab
            const videoLink = allVideos[videoIndex].href;
            initiateServiceWorkerToCreateTab(videoLink)
        }

        // Increment the video index
        videoIndex++;

        // Check if the end of the video list has been reached
        if (videoIndex === allVideos.length) {
            const lastIndex = videoIndex + 1
            console.log("last clicked video index", videoIndex);
            // Clear the  last interval function to stop clicking on those videos
            clearInterval(interval);
            // Schedule the next round of video clicking after a delay of 5 seconds
            setTimeout(function () {
                console.log("Restarting video click process...");
                clickAllVideos(lastIndex);
            }, 7000);
        }
    }

    const interval = setInterval(intervalFunction, 20000, videos)
}


window.addEventListener('myCustomEvent', function () {
    console.log('event occurred');
    clickAllVideos(8);
    // const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    // initiateServiceWorkerToCreateTab(videos[8].href)
});

