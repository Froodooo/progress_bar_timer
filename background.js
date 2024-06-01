chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTimer') {
      chrome.storage.local.get(['timerSeconds'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error retrieving storage data: ', chrome.runtime.lastError.message);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
  
        const timerSeconds = result.timerSeconds;
        const endTime = Date.now() + timerSeconds * 1000;
        console.log(`Setting endTime: ${endTime}`);
        
        chrome.storage.local.set({ endTime: endTime }, () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab) {
              const tabId = currentTab.id;
              console.log(`Setting timerTabId: ${tabId}`);
              
              chrome.storage.local.set({ timerTabId: tabId }, () => {
                chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  files: ['content.js']
                }, (results) => {
                  if (chrome.runtime.lastError) {
                    console.error('Script injection failed: ', chrome.runtime.lastError.message);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else {
                    console.log('Script injected successfully');
                    sendResponse({ success: true });
                  }
                });
              });
            } else {
              console.error('No active tab found.');
              sendResponse({ success: false, error: 'No active tab found.' });
            }
          });
        });
      });
      // Return true to indicate that we will respond asynchronously
      return true;
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get(['timerTabId'], (result) => {
        if (result.timerTabId === tabId) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }, (results) => {
            if (chrome.runtime.lastError) {
              console.error('Script injection failed: ', chrome.runtime.lastError.message);
            } else {
              console.log('Script injected successfully on tab update');
            }
          });
        }
      });
    }
  });
  