import './extension';
import { Global, readStorageToGlobal } from './global';
import { adjustGithubUI, injectSidebar } from './main';
import { checkURL } from './util';

document.addEventListener('DOMContentLoaded', () => {
    onLoaded();
});

/**
 * Main function.
 */
async function onLoaded() {
    // check url first
    const info = checkURL();
    if (!info) {
        return;
    }
    Global.urlInfo = info;

    // load settings from chrome storage
    await readStorageToGlobal();

    // adjust github ui
    adjustGithubUI();

    // add sidebar to github 
    injectSidebar();
}
