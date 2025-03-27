document.addEventListener('DOMContentLoaded', function() {
  // Handle settings button click
  document.getElementById('options-btn').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  // Handle custom prompts button click
  document.getElementById('custom-prompt-btn').addEventListener('click', function() {
    chrome.tabs.create({ url: 'custom-prompts.html' });
  });
}); 