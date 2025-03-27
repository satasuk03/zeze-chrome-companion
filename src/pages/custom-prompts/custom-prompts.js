document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const promptNameInput = document.getElementById('prompt-name');
  const promptTemplateInput = document.getElementById('prompt-template');
  const savePromptBtn = document.getElementById('save-prompt-btn');
  const clearBtn = document.getElementById('clear-btn');
  const promptsList = document.getElementById('prompts-list');
  
  // Load saved prompts
  loadPrompts();
  
  // Save prompt
  savePromptBtn.addEventListener('click', function() {
    const name = promptNameInput.value.trim();
    const template = promptTemplateInput.value.trim();
    
    if (!name || !template) {
      alert('Please enter both a name and template for your prompt.');
      return;
    }
    
    if (!template.includes('{{data}}')) {
      alert('Your prompt template must include the {{data}} placeholder to insert the selected text.');
      return;
    }
    
    // Get existing prompts or initialize empty array
    chrome.storage.sync.get('customPrompts', function(data) {
      const prompts = data.customPrompts || [];
      
      // Check if a prompt with this name already exists
      const existingIndex = prompts.findIndex(p => p.name === name);
      
      if (existingIndex > -1) {
        // Update existing prompt
        prompts[existingIndex] = { name, template };
      } else {
        // Add new prompt to the top of the list
        prompts.unshift({ name, template });
      }
      
      // Save to storage
      chrome.storage.sync.set({ customPrompts: prompts }, function() {
        // Clear form
        promptNameInput.value = '';
        promptTemplateInput.value = '';
        
        // Reload prompts list
        loadPrompts();
      });
    });
  });
  
  // Clear form
  clearBtn.addEventListener('click', function() {
    promptNameInput.value = '';
    promptTemplateInput.value = '';
  });
  
  // Load prompts from storage and display them
  function loadPrompts() {
    chrome.storage.sync.get('customPrompts', function(data) {
      const prompts = data.customPrompts || [];
      
      if (prompts.length === 0) {
        promptsList.innerHTML = '<div class="empty-state">No saved prompts yet. Create one above.</div>';
        return;
      }
      
      // Build HTML for prompts
      let html = '';
      
      prompts.forEach(function(prompt, index) {
        html += `
          <div class="prompt-item" data-index="${index}">
            <div class="prompt-header">
              <div class="prompt-name">${escapeHtml(prompt.name)}</div>
              <div class="prompt-actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="use-btn" data-index="${index}">Use</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
              </div>
            </div>
            <div class="prompt-text">${escapeHtml(prompt.template)}</div>
          </div>
        `;
      });
      
      promptsList.innerHTML = html;
      
      // Add event listeners to buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          editPrompt(parseInt(this.getAttribute('data-index')));
        });
      });
      
      document.querySelectorAll('.use-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          usePrompt(parseInt(this.getAttribute('data-index')));
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          deletePrompt(parseInt(this.getAttribute('data-index')));
        });
      });
    });
  }
  
  // Edit a prompt
  function editPrompt(index) {
    chrome.storage.sync.get('customPrompts', function(data) {
      const prompts = data.customPrompts || [];
      
      if (index >= 0 && index < prompts.length) {
        const prompt = prompts[index];
        promptNameInput.value = prompt.name;
        promptTemplateInput.value = prompt.template;
      }
    });
  }
  
  // Use a prompt (store it and redirect to the result page)
  function usePrompt(index) {
    chrome.storage.sync.get(['customPrompts', 'selectedText'], function(data) {
      const prompts = data.customPrompts || [];
      
      if (index >= 0 && index < prompts.length) {
        const selectedPrompt = prompts[index];
        
        // Store the selected prompt
        chrome.storage.local.set({ 
          activePrompt: selectedPrompt
        }, function() {
          // Redirect to context menu capture page
          window.location.href = '../result/result.html';
        });
      }
    });
  }
  
  // Delete a prompt
  function deletePrompt(index) {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    chrome.storage.sync.get('customPrompts', function(data) {
      const prompts = data.customPrompts || [];
      
      if (index >= 0 && index < prompts.length) {
        prompts.splice(index, 1);
        
        chrome.storage.sync.set({ customPrompts: prompts }, function() {
          loadPrompts();
        });
      }
    });
  }
  
  // Helper function to escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // Add context menu items for each custom prompt
  chrome.storage.sync.get('customPrompts', function(data) {
    const prompts = data.customPrompts || [];
    
    // First, clear any existing custom prompt menu items
    chrome.runtime.sendMessage({ action: 'updateContextMenus', prompts: prompts });
  });
}); 