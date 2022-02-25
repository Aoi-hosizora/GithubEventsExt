import '@src/ts/extensions';
import { Global, readStorageToGlobal } from '@src/ts/global';
import { adjustGitHubUI, injectSidebar } from '@src/ts/main';
import { checkURL } from '@src/ts/utils';

document.addEventListener('DOMContentLoaded', () => {
    onLoaded();
});

/**
 * Main function.
 */
async function onLoaded() {
    // 1. check url first
    const info = checkURL();
    if (!info) {
        return;
    }
    Global.urlInfo = info;

    // 2. load settings from storage
    await readStorageToGlobal();

    // 3. adjust GitHub UI
    adjustGitHubUI();

    // 4. inject sidebar to GitHub
    injectSidebar();
}
