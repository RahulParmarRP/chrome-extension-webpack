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
        console.log('scroll', index);

        // Wait for a random delay to simulate human-like interaction
        const delay = Math.floor(Math.random() * 10000) + 1000;

        setTimeout(function () {
            // Click the video
            // videos[index].click();
            // console.log('click');

            // // Close the video in the new tab and switch back to the original tab
            // setTimeout(function () {
            //     window.close();
            //     window.history.back();
            // }, 5000); // Wait for 5 seconds before closing the tab

            // Increment the index and click the next video
            clickVideo(index + 1);
        }, delay);
    }
}

// // Start clicking videos from the starting index
// clickVideo(startIndex);


function scrollDownTillEnd() {
    let scrollingInterval = setInterval(function () {
        console.log("scroll");
        window.scrollBy(0, 1000);
        if (window.scrollHeight > 10000) {
            console.log("loop ends");
            clearInterval(scrollingInterval);
        }
    }, 500);
}



function scrollVideos() {
    alert("start");
    console.log("get videos...");
    // Get all the video elements
    const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    console.log("total videos found ---------", videos);
    // Define the starting index
    let start = 0;
    //  keep track of the last video index that was clicked
    let last_index = start - 1;

    const scrollingInterval = setInterval(function () {

        if (start > videos.length) {
            console.log("loop ends");
            clearInterval(scrollingInterval);
        }
        let i = start
        console.log("scroll");
        window.scrollBy(0, 1000);

        last_index = i
        i++
    }, 100);
}




window.addEventListener('myCustomEvent', function () {
    console.log('event occurred');
    // const YOUTUBE_VIDEO_THUMBNAIL = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row'
    // const videos = document.querySelectorAll(YOUTUBE_VIDEO_THUMBNAIL);
    // const { index } = event.detail;
    // window.scrollBy(0, event.detail.scrollAmount);
    // videos[index].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

    // startLikingVideos()
    // scrollDownTillEnd();


    // Start clicking videos from the starting index
    clickVideo(startIndex);
});



window.addEventListener('myScroll', function () {
    console.log('scroll by 10');
    window.scrollBy(0, 300)
});
