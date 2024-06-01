chrome.storage.local.get(['endTime', 'timerTabId', 'timerSeconds'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving storage data: ', chrome.runtime.lastError.message);
      return;
    }
  
    const endTime = result.endTime;
    const timerTabId = result.timerTabId;
    const timerSeconds = result.timerSeconds;
  
    console.log(`Retrieved endTime: ${endTime}`);
    console.log(`Retrieved timerTabId: ${timerTabId}`);
    console.log(`Retrieved timerSeconds: ${timerSeconds}`);
  
    if (!endTime || !timerTabId || !timerSeconds) {
      console.error('No endTime, timerTabId, or timerSeconds found in storage.');
      return;
    }
  
    const now = Date.now();
    if (now > endTime) {
      console.log('Timer has already expired.');
      return;  // Exit if the timer has already expired
    }
  
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.position = 'fixed';
    progressBarContainer.style.bottom = '0';
    progressBarContainer.style.left = '0';
    progressBarContainer.style.width = '100%';
    progressBarContainer.style.height = '50px';
    progressBarContainer.style.backgroundColor = 'transparent';
    progressBarContainer.style.zIndex = '9999';
    document.body.appendChild(progressBarContainer);
  
    const progressBar = document.createElement('div');
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = 'blue';
    progressBarContainer.appendChild(progressBar);
  
    const timeLabel = document.createElement('div');
    timeLabel.style.position = 'absolute';
    timeLabel.style.bottom = '0';
    timeLabel.style.left = '50%';
    timeLabel.style.transform = 'translateX(-50%)';
    timeLabel.style.color = 'white';
    timeLabel.style.fontSize = '36px';
    timeLabel.style.fontWeight = 'bold';
    progressBarContainer.appendChild(timeLabel);
  
    const updateProgressBar = () => {
      const now = Date.now();
      const elapsed = now - (endTime - timerSeconds * 1000);
      const remainingTime = Math.max(endTime - now, 0);
      const progress = Math.min(elapsed / (timerSeconds * 1000), 1);
  
      progressBar.style.width = progress * 100 + '%';
  
      const remainingMinutes = Math.floor(remainingTime / 60000);
      const remainingSeconds = Math.ceil((remainingTime % 60000) / 1000);
  
      if (remainingMinutes > 0) {
        timeLabel.textContent = `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} remaining`;
      } else {
        timeLabel.textContent = `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} remaining`;
      }
  
      if (progress >= 1) {
        progressBar.style.backgroundColor = 'red';  // Change color to red when time expires
        clearInterval(intervalId);  // Stop updating when the progress bar is complete
      }
    };
  
    const intervalId = setInterval(updateProgressBar, 1000);  // Update every second
    updateProgressBar();  // Initial call to set the progress bar width and time
  });
  