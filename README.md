<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1O8Yb9qW4beejlIe_svT51Ct4So3qPhTp

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment on GitHub Pages

This project is configured with a relative Vite `base` path so it can run from a GitHub Pages subdirectory. Build and publish the static site from the `dist` folder:

1. Run `npm run build` to generate the production bundle with relative asset URLs.
2. Upload the contents of the `dist` directory to the root of your GitHub Pages branch (for example, `gh-pages`).
3. Ensure Pages is configured to serve from that branch. The app will load correctly from `https://<username>.github.io/<repository>/`.
