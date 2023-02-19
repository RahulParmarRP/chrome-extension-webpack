console.log('content script loaded');

const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row a#thumbnail'
const YOUTUBE_VIDEO_LIKE_BUTTON = '#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button'

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


// Start clicking videos from the starting index
// Define a function to click on all the videos one by one
function clickVideos(startIndex) {
    // Get all the videos on the page
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);

    // Define the starting index
    let videoIndex = startIndex;

    // Define an interval to click on the videos
    const interval = setInterval(function () {
        console.log(videoIndex);

        // Click on the current video
        videos[videoIndex].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

        // Increment the video index
        videoIndex++;

        // If the end of the videos is reached
        if (videoIndex === videos.length) {
            console.log('end');

            // Stop the interval
            clearInterval(interval);
            // Wait for a short delay
            setTimeout(function () {
                const lastVideoIndex = videoIndex + 1
                // Call the function again to start over from the last index
                clickVideos(lastVideoIndex);
            }, 5000);
        }
    }, 2000);
}

// Call the function to click on the videos
// clickVideos();



window.addEventListener('myCustomEvent', function () {
    console.log('event occurred');
    // videos[index].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    // startLikingVideos()
    // scrollDownTillEnd();
    // clickVideo(startIndex);
    clickVideos(8);
});