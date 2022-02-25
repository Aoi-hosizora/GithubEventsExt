import { askToSetupToken } from './global';

chrome.browserAction.onClicked.addListener(async _ => {
    await askToSetupToken();
});
