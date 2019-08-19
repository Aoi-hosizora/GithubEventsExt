const storage = chrome.storage.sync || chrome.storage.local;
const TOKEN_FLAG = 'my-github-events-token';

chrome.browserAction.onClicked.addListener((tab) => {
    browserAction_Click()
});

function browserAction_Click() {
    storage.get(TOKEN_FLAG, (storedData) => {
        const userKnows = storedData[TOKEN_FLAG];
        if (!userKnows) {
            if (confirm('Do you want to add a token to access the user private repos?'))
                addToken();
            else
                alert('You can click extension icon to set a token.')
        }
        else 
            removeToken();
    });
}

function addToken() {
    var token = prompt('Please enter your Github token: \n(to get token, please visit https://github.com/settings/tokens)');
    if (token === null) return;
    if (token) {
        const obj = {}
        obj[TOKEN_FLAG] = token
        storage.set(obj, () => {
            alert("Your Github token has been set successfully. Reload the Github page to see changes.");
        })
    }
    else
        alert("You have entered an empty token.");
}

function removeToken() {
    storage.get(TOKEN_FLAG, function (storedData) {
        const oldToken = storedData[TOKEN_FLAG];
        if (oldToken) {
            // TODO to remove confirm token
            if (confirm("You have already set your Github token (" + storedData[TOKEN_FLAG] + "). Do you want to remove it?")) {
                storage.remove(TOKEN_FLAG, () => {
                    alert("You have successfully removed Github token. Click extension icon again to set a new token.");
                });
            }
        }
    });
}