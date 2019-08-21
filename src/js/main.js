document.addEventListener('DOMContentLoaded', function() {
    console.log("loading ext");
    injectJs();
})

/**
 * 注入 Js 代码, 修改 DOM
 */
function injectJs() {
    // TODO 判断 where == user / repo
    var eventTag = document.createElement('div');
    eventTag.className = 'my-github-events';
    eventTag.innerHTML = `
    <h1>Test</h1>
    `;
    eventTag.onload = () => this.parent.removeChild(this);
    document.body.appendChild(eventTag);

    // 修改完 DOM 开始获取数据
    getEvents();
}

/**
 * 根据位置处理 url, 委托获取数据
 * @param {*} where `user` `repo`
 * @param {*} cb `callback`
 */
function getEvents(where, cb) {
    storage.get(TOKEN_FLAG, function (storedData) {
        const token = storedData[TOKEN_FLAG];
        let url;
        if (where == 'user') url = "https://api.github.com/users/Aoi-hosizora/events";
        else if (where == 'repo') url = "https://api.github.com/repos/Aoi-hosizora/Biji_Baibuti/events";
        else url = "";
        
        api(url, token, cb);
    });
}

/**
 * 调用 Github API 获取数据
 * @param {*} url `api.github.com/{users|repos}/xxx/events`
 * @param {*} token `str` `null`
 * @param {*} cb `callback`
 */
function api(url, token, cb) {
    if (url === '') {
        // error
    }
    else {
        $.ajax({
            type: 'GET',
            url: url,
            beforeSend: (xhr) => {
                if (token) 
                    xhr.setRequestHeader("Authorization", "Token: " + token);
            },
            success: (data) => {
                // TODO handle data
                cb();
            }
        });
    }
}