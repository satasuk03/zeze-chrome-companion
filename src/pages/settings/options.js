document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'model'], function(items) {
    if (items.apiKey) {
      document.getElementById('api-key').value = items.apiKey;
    }
    
    if (items.model) {
      document.getElementById('model-select').value = items.model;
    } else {
      // Default to Claude 3 Sonnet if no model is selected
      document.getElementById('model-select').value = 'claude-3-5-sonnet-latest';
    }
  });

  // Save settings
  document.getElementById('save-btn').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    const model = document.getElementById('model-select').value;
    const statusElement = document.getElementById('status');
    
    if (!apiKey) {
      statusElement.textContent = 'Please enter your API key.';
      statusElement.className = 'status error';
      return;
    }
    
    chrome.storage.sync.set(
      { 
        apiKey: apiKey,
        model: model 
      },
      function() {
        statusElement.textContent = 'Settings saved successfully!';
        statusElement.className = 'status success';
        
        // Clear the success message after 3 seconds
        setTimeout(function() {
          statusElement.className = 'status';
        }, 3000);
      }
    );
  });
}); 