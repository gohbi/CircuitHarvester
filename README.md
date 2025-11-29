<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1z1KMVubb-8YHuVy5mqf4YL9lATmSMVFK

## Try the Demo

Want to try Circuit Harvester without setting up an API key? Use the standalone demo file:

1. Open `demo.html` in any modern web browser
2. Click "Scan Board" or "Upload Image" to see the app in action
3. Explore the pre-analyzed Arduino UNO board with component annotations, project ideas, and shopping list features

The demo uses pre-computed analysis data so you can experience the full UI without an API key.

> **Note:** The demo requires an internet connection to load React and TailwindCSS from CDN.

## Embed the Demo on Your Portfolio

The `demo.html` file is completely self-contained and can be embedded on any website. Here are three ways to display the interactive demo on your portfolio:

### Option 1: Host with GitHub Pages (Recommended)

The easiest way to embed the demo on your portfolio is to enable GitHub Pages and use an iframe:

1. Go to your repository Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Choose the `main` branch and `/ (root)` folder
4. Click Save

Once deployed, embed the demo in your portfolio using an iframe:

```html
<iframe 
  src="https://YOUR-USERNAME.github.io/CircuitHarvester/demo.html" 
  width="100%" 
  height="800" 
  style="border: none; border-radius: 12px;"
  title="Circuit Harvester Demo"
></iframe>
```

### Option 2: Direct Link

Simply link to the hosted demo from your portfolio:

```html
<a href="https://YOUR-USERNAME.github.io/CircuitHarvester/demo.html" target="_blank">
  Try Circuit Harvester Demo →
</a>
```

### Option 3: Copy the HTML File

Since `demo.html` is self-contained (all code is inline, dependencies load from CDN), you can:

1. Copy `demo.html` to your portfolio project
2. Rename it (e.g., `circuit-harvester.html`)
3. Link to it from your portfolio navigation

The file works standalone - no other files from this repository are needed.

## Run Locally (Full Version)

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
