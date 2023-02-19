let currentIndex = 0;
let videos = [];

function clickVideos() {
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
setInterval(clickVideos, 5000); // Click on videos every 5 seconds


//---------------------------------------------------------------------------------

// Set the starting index
let startIndex = 0;

// Define a function to simulate clicking on a video
function clickVideo(index) {
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
function likeVideo(videoIndex) {
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
function clickVideos() {
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
                clickVideos();
            }, 1000);
        }
    }, 2000);
}

// Call the function to click on the videos
clickVideos();
