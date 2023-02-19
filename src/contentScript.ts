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

            const newTab = window.open(videoLink, '_blank');

            setTimeout(function () {
                console.log(`Closing video tab: ${newTab}`);
                newTab.close();
            }, 5000);

        } else {
            // Log an error message if the video element at the current index is undefined
            console.log(`Error: video element at index ${videoIndex} is undefined`);
            clearInterval(interval);
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

    const interval = setInterval(intervalFunction, 7000, videos)
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