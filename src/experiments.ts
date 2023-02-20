let currentIndex = 0;
let videos: string | any[] = [];

function clickVideos1() {
    // Get all the video elements on the page
    const videoElements = document.querySelectorAll('ytd-video-renderer');

    // Check if there are new videos since last execution
    if (videoElements.length > videos.length) {
        // Update the videos array
        videos = Array.from(videoElements);
        currentIndex = 0;
    }

    // Click on videos starting from the last index
    for (let i = currentIndex; i < videos.length; i++) {
        const video = videos[i];
        video.click();
        window.open(video.querySelector('a').href, '_blank'); // Open video in new tab
        window.focus(); // Switch focus to the new tab
        window.close(); // Close the new tab
        currentIndex = i + 1;

        // Check if we have reached the end of the current loop
        if (currentIndex === videoElements.length) {
            break;
        }
    }
}

// Call the function at a regular interval
setInterval(clickVideos1, 5000); // Click on videos every 5 seconds


//---------------------------------------------------------------------------------

// Set the starting index
let startIndex = 0;

// Define a function to simulate clicking on a video
function clickVideo(index: number) {
    console.log('start');

    // Get the list of videos
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    console.log(videos);

    // Check if the index is within the bounds of the video array
    if (index < videos.length) {
        // Scroll the video into view
        videos[index].scrollIntoView();
        console.log('scroll');

        // Wait for a random delay to simulate human-like interaction
        const delay = Math.floor(Math.random() * 10000) + 1000;
        setTimeout(function () {
            // Click the video
            videos[index].click();
            console.log('click');

            // Close the video in the new tab and switch back to the original tab
            setTimeout(function () {
                window.close();
                window.history.back();
            }, 5000); // Wait for 5 seconds before closing the tab

            // Increment the index and click the next video
            clickVideo(index + 1);
        }, delay);
    } else {
        // Wait for a delay before fetching the updated list of videos
        setTimeout(function () {
            // Get the updated list of videos
            const updatedVideos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);

            // Check if the length of the video array has changed
            // if (updatedVideos.length === videos.length) {
            if (videos.length === 28) {
                // Stop the program if the length hasn't changed
                console.log('No more videos to click.');
            } else {
                // Start again from the last index
                startIndex = index;
                clickVideo(startIndex);
            }
        }, 5000); // Wait for 5 seconds before fetching the updated list of videos
    }
}

// // Start clicking videos from the starting index
// clickVideo(startIndex);


//---------------------------------------------------------------------------------------
// Define a function to open a video in a new tab, hit the like button and close the tab
function likeVideo(videoIndex: string | number) {
    // Get the URL of the video to open
    const videoURL = document.querySelectorAll('a#thumbnail')[videoIndex].href;

    // Open the video in a new tab
    chrome.tabs.create({ url: videoURL }, function (newTab) {
        // Add an event listener to the new tab to wait for the page to load
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            // If the page has finished loading
            if (tabId === newTab.id && changeInfo.status === 'complete') {
                // Remove the event listener
                chrome.tabs.onUpdated.removeListener(listener);

                // Find the like button on the new page and click it
                chrome.tabs.executeScript(newTab.id, {
                    code: `document.querySelector('.like-button-renderer-like-button').click()`
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
}

// Define a function to click on all the videos one by one
function clickVideos2() {
    // Get all the videos on the page
    const videos = document.querySelectorAll('a#thumbnail');

    // Define the starting index
    let videoIndex = 0;

    // Define an interval to click on the videos
    const interval = setInterval(function () {
        // Click on the current video
        videos[videoIndex].click();

        // Increment the video index
        videoIndex++;

        // If the end of the videos is reached
        if (videoIndex === videos.length) {
            // Stop the interval
            clearInterval(interval);

            // Wait for a short delay
            setTimeout(function () {
                // Call the function again to start over from the last index
                clickVideos2();
            }, 1000);
        }
    }, 2000);
}

// Call the function to click on the videos
clickVideos2();


//--------------------------------------------------------------------------------------



function clickVideos4(startIndex: any) {
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    console.log("new count of the total videos", videos);

    let videoIndex = startIndex;

    const interval = setInterval((function (videos) {
        if (console.log(`Current video index: ${videoIndex}`), videos[videoIndex]) {
            videos[videoIndex].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

            const videoLink = videos[videoIndex].href;
            const newTab = window.open(videoLink, "_blank");

            setTimeout((function () {
                likeVideo();
                console.log(`Closing video tab: ${newTab}`);
                newTab.close();
                chrome.browsingData.removeCache({}, (function () {
                    console.log("Cache cleared.");
                }))
            }), 5000);
        } else {
            console.log(`Error: video element at index ${videoIndex} is undefined`);
            clearInterval(interval);
        }

        if (videoIndex++, videoIndex === videos.length) {
            const lastIndex = videoIndex + 1;
            console.log("last clicked video index", videoIndex);
            clearInterval(interval);
            setTimeout((function () {
                console.log("Restarting video click process...");
                clickVideos4(lastIndex);
            }), 7000);
        }
    }), 10000, videos);

    function likeVideo() {
        try {
            const likeButton = document.querySelectorAll(YOUTUBE_VIDEO_LIKE_BUTTON);
            if (likeButton?.length) {
                const button = likeButton[0];
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
}


// ----------------------------------------------------------------------------------------

// background.js

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "likeVideo") {
        likeVideo5(message.videoLink, function () {
            sendResponse({ result: "success" });
        });
    }
});

// Function to like a YouTube video by opening it in a new tab and clicking the like button
function likeVideo5(videoLink: any, callback: { (): void; (): void; }) {
    chrome.tabs.create({ url: videoLink }, function (newTab) {
        chrome.tabs.executeScript(newTab.id, {
            code: `
        const likeButton = document.querySelector('${YOUTUBE_VIDEO_LIKE_BUTTON}');
        if (likeButton) {
          if (!likeButton.getAttribute('aria-pressed')) {
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
