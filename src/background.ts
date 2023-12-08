chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.sidePanel
    .setOptions({ tabId, path: 'index.html', enabled: true })
    .catch(console.error);
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);
