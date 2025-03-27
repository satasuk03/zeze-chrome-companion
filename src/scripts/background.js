// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Create the main menu item
  chrome.contextMenus.create({
    id: "aiCompanion",
    title: "Process with AI Companion",
    contexts: ["selection"]
  });
  
  // Load custom prompts and add them to the context menu
  loadCustomPromptsToMenu();
});

setTimeout(() => {
  // Create the main menu item
  chrome.contextMenus.create({
    id: "aiCompanion",
    title: "Process with AI Companion",
    contexts: ["selection"]
  });
  
  // Load custom prompts and add them to the context menu
  loadCustomPromptsToMenu();
}, 10000); // to make sure the custom prompts are always loaded

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "aiCompanion" && info.selectionText) {
    // Store the selected text temporarily
    chrome.storage.local.set({ 
      selectedText: info.selectionText,
      promptType: "default"
    }, () => {
      // Open a new page to display the result
      chrome.tabs.create({ 
        url: chrome.runtime.getURL('/src/pages/result/result.html')
      });
    });
  } else if (info.menuItemId.startsWith("customPrompt_") && info.selectionText) {
    // Extract the prompt index from the ID
    const promptIndex = parseInt(info.menuItemId.split("_")[1]);
    
    // Get the prompt and store it with the selected text
    chrome.storage.sync.get('customPrompts', function(data) {
      const prompts = data.customPrompts || [];
      
      if (promptIndex >= 0 && promptIndex < prompts.length) {
        const selectedPrompt = prompts[promptIndex];
        
        chrome.storage.local.set({ 
          selectedText: info.selectionText,
          activePrompt: selectedPrompt,
          promptType: "custom"
        }, () => {
          // Open a new page to display the result
          chrome.tabs.create({ 
            url: chrome.runtime.getURL('/src/pages/result/result.html')
          });
        });
      }
    });
  }
});

// Listen for messages to update context menus
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateContextMenus') {
    // Remove all custom prompt menu items
    chrome.contextMenus.removeAll(() => {
      // Recreate the main menu item
      chrome.contextMenus.create({
        id: "customPrompts",
        title: "Custom Prompts",
        contexts: ["selection"],
        parentId: "aiCompanion"
      });

      // Add the custom prompts to the menu
      const prompts = message.prompts || [];
      prompts.forEach((prompt, index) => {
        chrome.contextMenus.create({
          id: `customPrompt_${index}`,
          title: prompt.name,
          contexts: ["selection"]
        });
      });
    });
  }
});

// Function to load custom prompts to the context menu
function loadCustomPromptsToMenu() {
  chrome.storage.sync.get('customPrompts', function(data) {
    const prompts = data.customPrompts || [];

    chrome.contextMenus.removeAll(() => {
      // Recreate the main menu item
      chrome.contextMenus.create({
        id: "customPrompts",
        title: "Custom Prompts",
        contexts: ["selection"],
        parentId: "aiCompanion"
      });
      
      // Add the custom prompts to the menu
      prompts.forEach((prompt, index) => {
        chrome.contextMenus.create({
          id: `customPrompt_${index}`,
          title: prompt.name,
          contexts: ["selection"]
        });
      });
    });
  
  });
} 

