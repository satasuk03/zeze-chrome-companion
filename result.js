document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const selectedTextElement = document.getElementById('selected-text');
  const promptNameElement = document.getElementById('prompt-name');
  const promptTemplateElement = document.getElementById('prompt-template');
  const promptSection = document.getElementById('prompt-section');
  const responseElement = document.getElementById('response');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const copyBtn = document.getElementById('copy-btn');
  const newPromptBtn = document.getElementById('new-prompt-btn');
  const settingsBtn = document.getElementById('settings-btn');
  
  // Load selected text and prompt information
  chrome.storage.local.get(['selectedText', 'activePrompt', 'promptType'], function(data) {
    const selectedText = data.selectedText || '';
    const promptType = data.promptType || 'default';
    const activePrompt = data.activePrompt || null;
    
    // Display the selected text
    selectedTextElement.textContent = selectedText;
    
    // Handle prompt display
    if (promptType === 'custom' && activePrompt) {
      promptNameElement.textContent = activePrompt.name;
      promptTemplateElement.textContent = activePrompt.template;
      promptSection.style.display = 'block';
    } else {
      promptNameElement.textContent = 'Default';
      promptTemplateElement.textContent = 'Provide a helpful response about the following text: {{data}}';
      promptSection.style.display = 'block';
    }
    
    // Get API settings
    chrome.storage.sync.get(['apiKey', 'model'], function(settings) {
      const apiKey = settings.apiKey;
      const model = settings.model || 'claude-3-sonnet-20240229';
      
      if (!apiKey) {
        showError('API key not found. Please go to Settings and add your Anthropic API key.');
        return;
      }
      
      // Prepare the prompt
      let promptText;
      if (promptType === 'custom' && activePrompt) {
        promptText = activePrompt.template.replace('{{data}}', selectedText);
      } else {
        promptText = `Provide a helpful response about the following text: ${selectedText}`;
      }
      
      // Call the Anthropic API
      callAnthropicAPI(apiKey, model, promptText);
    });
  });
  
  // Copy response to clipboard
  copyBtn.addEventListener('click', function() {
    const textToCopy = responseElement.textContent;
    navigator.clipboard.writeText(textToCopy).then(function() {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(function() {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  });
  
  // Go to custom prompts page
  newPromptBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'custom-prompts.html' });
  });
  
  // Go to settings page
  settingsBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  // Function to call the Anthropic API
  function callAnthropicAPI(apiKey, model, promptText) {
    // Show loading state
    loadingElement.style.display = 'flex';
    responseElement.style.display = 'none';
    errorElement.style.display = 'none';
    
    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: promptText
          }
        ],
        max_tokens: 4096
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(`API Error: ${err.error?.message || 'Unknown error occurred'}`);
        });
      }
      return response.json();
    })
    .then(data => {
      // Hide loading state, show response
      loadingElement.style.display = 'none';
      responseElement.style.display = 'block';
      
      // Format and display the response
      if (data.content && data.content.length > 0) {
        responseElement.textContent = data.content[0].text;
        copyBtn.disabled = false;
      } else {
        showError('Received an empty response from the API.');
      }
    })
    .catch(error => {
      showError(error.message);
    });
  }
  
  // Helper function to show errors
  function showError(message) {
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.textContent = message;
  }
}); 