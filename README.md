# ZAI Companion

A powerful Chrome extension that brings advanced Large Language Models (LLMs) directly to your browser, allowing you to process selected text from any webpage with AI-powered insights.

![ZAI Companion Logo](logo.png)

## Features

### Contextual Text Processing
- **Right-Click Access**: Select any text on any webpage, right-click, and choose "Process with ZAI Companion" to analyze it.
- **Instant Results**: View AI-generated responses in a clean, dedicated results page without leaving your browser.

### Multiple AI Models
- **Various LLM Options**: Choose from a range of state-of-the-art language models with different capabilities:
  - Models optimized for depth and complexity
  - Models balanced for performance and speed
  - Faster models for quick responses
  - Latest cutting-edge models with enhanced reasoning

### Customizable Experience
- **Custom Prompts**: Create, save, and manage personalized prompt templates for frequently used operations.
- **Template Placeholders**: Use the `{{data}}` placeholder in your templates to automatically insert selected text.
- **Organized Prompts**: Access all your custom prompts directly from the right-click context menu.

### User-Friendly Interface
- **Clean, Modern Design**: Enjoy a beautiful and intuitive user interface for all interactions.
- **Copy Functionality**: One-click copying of AI responses to clipboard.
- **Loading Indicators**: Clear visual feedback during API processing.
- **Error Handling**: Helpful error messages if something goes wrong.

### Privacy and Security
- **Local Storage**: Your API key is securely stored in your browser's local storage and never shared.
- **Direct API Access**: Communication happens directly between your browser and the AI provider's API.

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension directory
5. The ZAI Companion extension should now appear in your extensions list

## Setup

1. Click on the ZAI Companion icon in your Chrome extensions toolbar
2. Click "Settings" to open the options page
3. Enter your API key
4. Select your preferred LLM model from the dropdown
5. Click "Save Settings"

## Usage

### Basic Usage
1. Select text on any webpage
2. Right-click and choose "Process with ZAI Companion" from the context menu
3. View the AI-generated response in a new tab
4. Copy the response to your clipboard with the "Copy" button

### Using Custom Prompts
1. Click on the ZAI Companion icon in your toolbar
2. Select "Custom Prompts"
3. Create a new prompt template with a name and template text
4. Use `{{data}}` as a placeholder for your selected text
5. Save the prompt
6. When selecting text, you can now choose your custom prompt from the "Custom Prompts" submenu

## Use Cases

- **Research**: Quickly summarize long articles or research papers
- **Content Creation**: Generate ideas or polish existing content
- **Learning**: Get explanations for complex concepts or technical text
- **Translation**: Process text in different languages
- **Code Understanding**: Analyze and explain code snippets
- **Data Analysis**: Extract insights from structured or unstructured data

## Requirements
- Chrome browser (or Chromium-based browser)
- API key for supported LLM services
- Internet connection for API communication

## Privacy Notice
This extension stores your API key locally in your browser's storage. The key is never sent to our servers and is only used to authenticate API requests directly from your browser to the LLM provider.

## License
[MIT License](LICENSE)

## Support
For issues, feature requests, or questions, please open an issue in this repository. 