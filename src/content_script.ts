import '@src/ts/extension';
import { Global, readStorageToGlobal } from '@src/ts/global';
import { adjustGithubUI, injectSidebar } from '@src/ts/main';
import { checkURL } from '@src/ts/util';

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

    // 3. adjust github ui
    adjustGithubUI();

    // 4. add sidebar to github 
    injectSidebar();
}
