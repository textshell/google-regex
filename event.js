chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.init) {
    sendResponse(localStorage.getItem("rules").split("\n"));
    chrome.pageAction.show(sender.tab.id);
  }
});


