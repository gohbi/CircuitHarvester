<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1z1KMVubb-8YHuVy5mqf4YL9lATmSMVFK

## Try the Demo

Want to try Circuit Harvester without setting up an API key? Use the standalone demo file:

1. Open `demo.html` in any modern web browser
2. Click "Load Demo Analysis" to see the app in action
3. Explore the pre-analyzed Arduino UNO board with component annotations, project ideas, and shopping list features

The demo uses pre-computed analysis data so you can experience the full UI without an API key.

> **Note:** The demo requires an internet connection to load React and TailwindCSS from CDN.

## Run Locally (Full Version)

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
