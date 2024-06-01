document.getElementById('start').addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const totalSeconds = (minutes * 60) + seconds;
  
    if (totalSeconds <= 0) {
      alert('Please enter a valid number of minutes or seconds.');
      return;
    }
  
    chrome.storage.local.set({ timerSeconds: totalSeconds }, () => {
      chrome.runtime.sendMessage({ action: 'startTimer' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error starting timer:', chrome.runtime.lastError.message);
        } else if (response && response.success) {
          console.log('Timer started successfully');
        } else {
          console.error('Error starting timer:', response.error);
        }
      });
    });
  });
  