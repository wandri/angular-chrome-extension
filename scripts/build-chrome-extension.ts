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

// Build process
async function buildChromeExtension(): Promise<void> {
  try {
    await buildAngularApp();
    await buildBackgroundScript();
    console.info('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

buildChromeExtension();
