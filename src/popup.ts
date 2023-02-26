import '../styles/popup.scss';
const likeVideos = document.getElementById("like-videos")

document.getElementById('go-to-options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});


async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


function sendCustomEvent() {
  alert('start?')
  const event = new CustomEvent('myCustomEvent');
  window.dispatchEvent(event);
}

likeVideos.addEventListener('click', async () => {
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: sendCustomEvent,
  });
});
