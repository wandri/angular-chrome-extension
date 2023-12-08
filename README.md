# Angular Chrome Extension

Creating a **Chrome extension** using **Angular** and SCSS involves several steps. Here's a detailed tutorial to guide you through the process:

Our example is focused on a side panel extension. 

## Configuration

1. Create the file [`manifest.json`](https://github.com/wandri/angular-chrome-extension/src/manifest.json) in `./src`

```json
{
  "manifest_version": 3,
  "name": "<NAME>",
  "short_name": "<SHORT NAME>",
  "version": "0.0.0",
  "description": "<DESCRIPTION>",
  "permissions": [
    "sidePanel"
  ],
  "content_security_policy": { // OPTIONAL if login with Auth0
    "extension_pages": "script-src 'self'; object-src 'self'; frame-src https://<AUTH_NAME>.auth0.com;"
  },
  "background": {
    "service_worker": "background.js"
  },
  "side_panel": {
    "default_path": "index.html"
  },
  "action": {
    "default_title": "<TITLE>"
  },
  "icons": { // OPTIONAL
    "16": "assets/icon/icon16.png",
    "32": "assets/icon/icon32.png",
    "48": "assets/icon/icon48.png",
    "128": "assets/icon/icon128.png"
  },
  "key": "<Extension Key>" // OPTIONAL
}
```

2. Create the file [`background.ts`](https://github.com/wandri/angular-chrome-extension/src/background.ts) in `./src` 

```ts
chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.sidePanel
    .setOptions({ tabId, path: 'index.html', enabled: true })
    .catch(console.error);
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);
```

Install the typing for chrome

`npm i --save-dev @types/chrome`

Add `chrome` in `tsconfig.app.json`

```
  "compilerOptions": {
    ...
    "types": [
      "chrome"
    ]
  },
```

3. Update `angular.json` with the following

```json
{
   ...
  "targets": {
    "build": {
      ...
      "options": {
        ...
        "assets": [
          ...
          "apps/chrome-extension/src/manifest.json"
        ],
        "optimization": {
          "scripts": true,
          "styles": {
            "minify": true,
            "inlineCritical": false
          },
          "fonts": false
        }
      },
      "configurations": {
        "production": {
          ...
          ...
          "outputHashing": "none"
        },
```

- `outputHashing` is set to `none` to let the file names as they are.

4. Create the file `build-chrome-extension.ts` in `./scripts` to build the package

```ts
const esbuild = require('esbuild');
const {exec} = require('child_process');

// Function to buildChromeExtension the Angular app
async function buildAngularApp(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('ng build', (error: string, stderr: string) => {
      if (error) {
        console.error(`Angular build error: ${error}`);
        return reject(error);
      }
      console.error(stderr);
      resolve();
    });
  });
}

async function buildBackgroundScript(): Promise<void> {
  return esbuild.build({
    entryPoints: ['src/background.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/angular-chrome-extension/browser/'
  });
}
```

5. Update `package.json` to include the build script

```json
{
  ...
  "scripts": {
    ...
    "chrome-extension:build": "npx ts-node scripts/build-chrome-extension.ts"
  }
}
```

## Test the extension

1. Run `npm run chrome-extension:build` to build the package

2. Load your unpacked folder `/dist/.../browser/`

<img src="https://github.com/wandri/angular-chrome-extension/blob/master/images/unpacked.png" height="200">

<img src="https://github.com/wandri/angular-chrome-extension/blob/master/images/loaded-package.png" height="200">

3. Test your extension

<img src="https://github.com/wandri/angular-chrome-extension/blob/master/images/run-extension.png" height="200">

<img src="https://github.com/wandri/angular-chrome-extension/blob/master/images/example.png">
