const STORAGE = chrome.storage.sync || chrome.storage.local;
const TOKEN_FLAG = 'ah-github-events-token';

chrome.browserAction.onClicked.addListener(_ => onBrowserActionClicked());

function onBrowserActionClicked() {
    STORAGE.get(TOKEN_FLAG, data => {
        const token: string = data[TOKEN_FLAG];
        if (!token) {
            if (confirm('Do you want to add a token to access the private repos?')) {
                addToken();
            } else {
                alert('You can click the extension icon to reopen this dialog.')
            }
        } else {
            removeToken(token);
        }
    });
}

function addToken() {
    let token = prompt('Please enter your Github token: \n(to get token, please visit https://github.com/settings/tokens)');
    if (token === null) return;
    if (token.trim().length == 0) {
        alert("You have entered an empty token.");
    } else {
        STORAGE.set({
            TOKEN_FLAG: token
        }, () => {
            alert("Your Github token has been set successfully, reload this page to see changes.");
        });
    }
}

function removeToken(token: string) {
    let ok = confirm(`You have already set your Github token (${token}), want to remove it?`);
    if (ok) {
        STORAGE.remove(TOKEN_FLAG, () => {
            alert("You have successfully removed Github token.");
        });
    }
}
