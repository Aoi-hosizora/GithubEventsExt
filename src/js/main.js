document.addEventListener('DOMContentLoaded', () => {
    console.log("loading ext");

    injectJs();

    core();
})

function addCss() {
    var fontStyleTag = document.createElement("style");
    fontStyleTag.setAttribute('rel', 'stylesheet');
    // fontStyleTag.setAttribute('href', chrome.extension.getURL(''));
    fontStyleTag.setAttribute('href', "https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    document.head.appendChild(fontStyleTag);
}

function injectJs() {

    var divTag = document.createElement('div');
    divTag.className = 'content-toggle content-toggle-hide content-trans';
    divTag.id = 'id-toggle';
    divTag.innerHTML = `
    <svg width=10 height=14 viewBox="0 0 320 512">
        <path fill="#999999" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
    </svg>
    <span>Events</span>
    `;
    divTag.onload = () => this.parent.removeChild(this);

    var navTag = document.createElement('nav');
    navTag.className = 'content-nav content-trans';
    navTag.id = 'id-nav';
    navTag.innerHTML = `
    <div id="id-head">
        <a id="id-pin" href="javascript:void(0)">
            <!-- <i class="fa fa-thumb-tack"></i> -->
            <svg width=9 height=14 viewBox="0 0 384 512">
                <path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"></path>
            </svg>
        </a>
        <a id="id-popup" href="javascript:void(0)">
            <!-- <i class="fa fa-cog"></i> -->
            <svg width=14 height=14 viewBox="0 0 512 512">
                <path fill="#999" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
            </svg>
        </a>
        <div id="id-title">
            <span id="id-repo-icon"></span>
            <a id="id-title-user" class="content-a" href="javascript:void(0)">AoiHosizora</a> /
            <a id="id-title-repo" class="content-a" href="javascript:void(0)">Biji_Baibuti</a>
        </div>
        <div id="id-subtitle">
            <span>Test</span>
        </div>
    </div>

    <div id="id-tail">
        <div id="id-content"></div>

        <div id="id-foot">
            <div id="id-more-div">
                <a id="id-more-a" href="javascript:void(0)">More...</a>
            </div>
            <div id="id-loading-label">Loading...</div>
        </div>

        <div id="id-resize-handler"></div>
    </div>
    `;
    navTag.onload = () => this.parent.removeChild(this);
    document.body.append(divTag);
    document.body.append(navTag);
}

function core() {
    (() => {

        // url = "https://api.github.com/users/yoruko-km/events?page=";
        token = null;
        // url = "https://api.github.com/users/Aoi-hosizora/events?page=";
        url = "https://api.github.com/repos/angular/angular/events?page=";
    
        page = 1;
        isPin = true;
        firstFlag = true;
    
        // 容器
        var ulTag = document.createElement('ul');
        ulTag.id = "id-ul";
        ulTag.onload = () => this.parent.removeChild(ulTag);
        $('#id-content').append(ulTag);
    
        // Resize
        // bindResize();
    
        // Label
        showLoading(true);
    
        // pin
        setPin(isPin);
    
        // 展开
        if (isPin)
            closeNav(false);
        else {
            closeNav(true);
            setPin(isPin);
        }
    
        // title-icon
        $('#id-repo-icon').html(getSvgTag('CreateEvent', "#fff"));
    
        // 异步获取
        ajax(url, page, token, (events) => {
            addEvents(events);
            showLoading(false);
        }, () => {
            showLoading(false, true);
        });
    })();
    
    $('#id-toggle').click(() => {
        closeNav(false);
    });
    
    $('#id-pin').click(() => {
        isPin = !isPin;
        setPin(isPin);
        isShow = isPin;
    });
    
    $('#id-popup').click(() => {
        window.open('https://github.com/Aoi-hosizora/GithubEvents_ChromeExt');
    });
    
    (() => {
        isShow = false;
    
        $('#id-nav').mouseleave((e) => {
            isShow = isPin;
            // TODO
            if (!isPin && !isShow) {
                setTimeout(() => {
                    if (!isShow)
                        closeNav(true);
                }, 1000);
            }
        });
    
        $('#id-nav').mouseenter((e) => {
            isShow = true;
        });
    
        $('#id-toggle').mouseenter((e) => {
            closeNav(false);
        });
    
        $('#id-pin').mouseenter((e) => {
            $('#id-pin').children('svg').children('path').attr("fill", "#fff");
        });
    
        $('#id-pin').mouseleave((e) => {
            if (!isPin) 
                $('#id-pin').children('svg').children('path').attr("fill", "#999");
            else
                $('#id-pin').children('svg').children('path').attr("fill", "#fff");
        });   
        
        $('#id-popup').mousemove((e) => {
            $('#id-popup').children('svg').children('path').attr("fill", "#fff");
        });
    
        $('#id-popup').mouseleave((e) => {
            $('#id-popup').children('svg').children('path').attr("fill", "#999");
        });
    
    
    })();
    
    /**
     * More... 处理
     */
    $('#id-more-a').click(() => {
        showLoading(true);
    
        ajax(url, ++page, token, (events) => {
            addEvents(events);
            showLoading(false, false);
        }, () => {
            showLoading(false, true);
        });
    });
    
    /**
     * 显示 Loading / More
     * @param {*} isLoading 
     * @param {*} isError -> `Something error happened, try again...`
     */
    function showLoading(isLoading, isError = false) {
        if (isLoading) {
            $('#id-more-div').hide();
            $('#id-loading-label').show();
        } else {
            $('#id-more-a').text(
                isError ? "Something error happened, try again..." : "More..."
            )
            $('#id-loading-label').hide();
            $('#id-more-div').show();
        }
    }
    
    /**
     * 关闭 右侧栏
     * @param {*} closeFlag 
     */
    function closeNav(closeFlag) {
    
        var nav = $('.content-nav').first();
        var toggle = $('.content-toggle').first();
    
        if (closeFlag) {
            nav.removeClass('content-nav-open');
            toggle.removeClass('content-toggle-hide');
            // $('#id-nav').css("right", `calc(-${nav.width()}px - 10px)`);
        } else {
            toggle.addClass('content-toggle-hide');
            nav.addClass('content-nav-open');
            // $('#id-nav').css("right", `0`);
        }
    }
    
    /**
     * 设置 置顶
     * @param {*} isPin
     */
    function setPin(isPin) {
        $('header').removeClass('p-responsive');
        if (isPin) {
            $('#id-pin').children('svg').css("transform", "");
            $('#id-nav').addClass('content-nav-shadow');
            $('header').css("padding-right", $('#id-nav').width() + 15);
            $('#id-pin').children('svg').children('path').attr("fill", "#fff");
        } else {
            $('#id-pin').children('svg').css("transform", "rotate(45deg)");
            $('#id-nav').removeClass('content-nav-shadow');
            $('header').css("padding-right", "");
            $('#id-pin').children('svg').children('path').attr("fill", "#999");
        }
    }
    
    /**
     * 异步获取数据 回调
     */
    function ajax(url, page, token, cb, err) {
        $.ajax({
            type: 'GET',
            url: url + page,
            beforeSend: (xhr) => {
                if (token)
                    xhr.setRequestHeader("Authorization", "Token " + token);
            },
            success: (data) => {
                cb(data);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                // console.log(textStatus);
                err();
            }
        });
    }
    
    /**
     * !!! DOM 操作 
     */
    function addEvents(events) {
        if (!events) return;
        console.log(events);
        events.forEach(event => {
            var ret = parseApiJson(event);
            console.log(ret);
    
            var commitsTag = '',
                commentTag = '',
                issueTitleTag = '';
    
            if (ret.issue) {
                issueTitleTag = `
                <div class="content-issue-title">
                    <span>${ret.issue}</span>
                </div>
                `;
            }
    
            if (ret.commits) {
                ret.commits.forEach((commit) => {
                    commitsTag += `
                                <div class="commit-div">
                                    <a href="${commit['url']}" target="_blank" class="commit-sha">${commit['sha'].substring(0, 7)}</a>
                                    <span class="commit-title"> ${commit['commit']}</span>
                                </div>
                            `;
                })
            }
            if (ret.body)
                commentTag = `<div class="content-comment">${ret.body}</div>`;
    
            if (ret.mainTitle)
                ret.mainTitle = ret.mainTitle.replace(ret.mainTitle[0], ret.mainTitle[0].toUpperCase())
    
            var mt = ret.mainTitle.split(' ');
            var mr = mt[mt.length - 1];
            mt = mt.slice(0, mt.length - 1).join(' ');
    
            var titleSpanTag = `<span class="content-title">${mt} </span>`;
    
            if (ret.type == 'ForkEvent') {
                // Forked angular/angular to coulonxyz/angular
                mt = mt.split(' ');
                var forker = mt[1];
                titleSpanTag = `<span class="content-title">${mt[0]} <a href="${ret.forker_url}" target="_blank">${forker}</a> ${mt.slice(2, mt.length).join(' ')}</span>`;
            } else if (ret.type == "IssueCommentEvent") {
                // Created comment on issue #32258 "yarn setup not working in aio" in angular/angular
                mt = mt.split(' ');
                var issueId = mt[4];
                titleSpanTag = `<span class="content-title">${mt.splice(0, 4).join(' ')} <a href="${ret.comment_url}" target="_blank">${issueId}</a> ${mt.slice(1, mt.length).join(' ')}</span>`;
            } else if (ret.type == "IssuesEvent") {
                // Opened issue #32264 in angular/angular
                mt = mt.split(' ');
                var issueId = mt[2];
                titleSpanTag = `<span class="content-title">${mt.splice(0, 2).join(' ')} <a href="${ret.comment_url}" target="_blank">${issueId}</a> ${mt.slice(1, mt.length).join(' ')}</span>`;
            } else if (ret.type == "PullRequestEvent") {
                // Opened pull request #32267 "docs: fixed animations reference links to api" at angular/angular
                mt = mt.split(' ');
                var pullReqId = mt[3];
                titleSpanTag = `<span class="content-title">${mt.splice(0, 3).join(' ')} <a href="${ret.pullreq_url}" target="_blank">${pullReqId}</a> ${mt.slice(1, mt.length).join(' ')}</span>`;
            } else if (ret.type == "PullRequestReviewCommentEvent") {
                // Created pull request review comment in pull request #undefined at angular/angular
                mt = mt.split(' ');
                var pullReqId = mt[8];
                titleSpanTag = `<span class="content-title">${mt.splice(0, 8).join(' ')} <a href="${ret.pullreq_url}" target="_blank">${pullReqId}</a> ${mt.slice(1, mt.length).join(' ')}</span>`;
            }
    
            // 内容
            $('#id-ul').append(`
                        ${firstFlag == true ? '' : '<hr />'}
                        <li>
                            <div class="avator-div">
                                <img src="${ret.avatar_url}" alt="user-avatar" class="avator-icon"/>
                                <span class="avator-link"><a href="${ret.user_url}" target="_blank">${ret.user}</a></span>
                            
                                <span class="avator-item-icon">
                                    ${getSvgTag(ret.type)}
                                </span>
                            </div>
                            ${titleSpanTag}
                            <a href="${ret.url}" target="_blank" class="content-repo">${mr}</a>
                            ${commitsTag} 
                            ${issueTitleTag} ${commentTag} 
                        </li>
                    `);
    
            firstFlag = false;
        });
    }
    
    function getSvgTag(type, color = "") {
        let svgClass = '',
            svgPath = '';
        let svgHeight = 16,
            svgWidth = 12;
    
        switch (type) {
            case 'PushEvent':
                svgClass = "octicon-repo-push";
                svgPath = 'M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z';
                break;
            case 'CreateEvent':
                svgClass = "octicon-repo";
                svgPath = "M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z";
                break;
            case 'CreateBranchEvent':
                svgClass = "octicon-git-branch";
                svgWidth = 10;
                svgPath = "M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
                break;
            case 'WatchEvent':
                svgClass = "octicon-star";
                svgWidth = 14;
                svgPath = "M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z";
                break;
            case 'MemberEvent':
                svgClass = "octicon-organization";
                svgWidth = 16;
                svgPath = "M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z";
                break;
            case 'IssuesEvent':
                svgClass = "octicon-issue-opened";
                svgWidth = 14;
                svgPath = "M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z";
                break;
            case 'IssueCommentEvent':
                svgClass = "octicon-comment";
                svgWidth = 16;
                svgPath = "M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z";
                break;
            case 'ForkEvent':
                svgClass = "octicon-repo-forked";
                svgWidth = 10;
                svgPath = "M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
                break;
            case 'PullRequestEvent':
                svgClass = "octicon-git-pull-request";
                svgWidth = 12;
                svgPath = "M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
                break;
            case 'PullRequestReviewCommentEvent':
                svgClass = "octicon-eye";
                svgWidth = 16;
                svgPath = "M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z";
        }
        let svg = `
                    <svg class="octicon ${svgClass}" 
                        version="1.1" aria-hidden="true"
                        width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
                        
                        <path class="octicon-path" fill-rule="evenodd" d="${svgPath}" ${color ? `fill="${color}"` : ""}></path>
                    </svg>
                `
        return svg;
    }
    
    /**
     * 解析返回的 API 结果
     */
    function parseApiJson(event) {
    
        /*
            PushEvent                       octicon octicon-repo-push
            CreateEvent (repo)              octicon octicon-repo                -> CreateEvent
            CreateEvent (branch)            octicon octicon-git-branch          -> CreateBranchEvent
            WatchEvent                      octicon octicon-star
            MemberEvent                     octicon octicon-organization
            IssuesEvent                     octicon octicon-issue-opened
            IssueCommentEvent               octicon octicon-comment
            ForkEvent                       octicon octicon-repo-forked
            PullRequestEvent                octicon octicon-git-pull-request
            PullRequestReviewCommentEvent   octicon octicon-eye
        */
    
        let type = event['type'];
        let actor = event['actor']['login'];
        let repo = event['repo']['name'];
        let payload = event['payload'];
    
        let url = "https://" + event['repo']['url']
            .replace("https://api.", "").replace("http://api.", "")
            .replace("repos/", "");
        let user_url = "https://" + event['actor']['url']
            .replace("https://api.", "").replace("http://api.", "")
            .replace("users/", "");
        let avatar_url = event['actor']['avatar_url'];
    
        let comment_url = "";
        let forker_url = "";
        let pullreq_url = "";
    
        let mainTitle = '';
        let commits = [];
    
        // issue pullreq title
        let isprTitle = '';
        // issue pullreq body
        let isprBody = '';
    
        switch (type) {
            case 'PushEvent':
                mainTitle = `pushed ${payload['size']} 
                            ${(payload['size'] == 1) ? ' commit to ' : ' commits to '} 
                            ${payload['ref'].split('/')[2]} at ${repo}`;
                payload['commits'].forEach(commit => {
                    commits.push({
                        'sha': commit['sha'],
                        'commit': commit['message'],
                        'url': "https://" + commit['url']
                            .replace("https://api.", "").replace("http://api.", "")
                            .replace("commits/", "commit/").replace("repos/", "")
                    })
                });
                break;
            case 'WatchEvent':
                mainTitle = `starred repository ${repo}`;
                break;
            case 'CreateEvent':
                if (payload['ref_type'] == 'branch') {
                    type = "CreateBranchEvent"
                    mainTitle = `created branch ${payload['ref']} at ${repo}`;
                } else if (payload['ref_type'] == 'repository')
                    mainTitle = `created a ${event['public'] ? 'public' : 'private'} repository ${repo}`;
                break;
            case 'IssuesEvent':
                mainTitle = `${payload['action']} issue #${payload['issue']['number']} in ${repo}`;
                comment_url = payload['issue']['html_url'];
                isprTitle = payload['issue']['title'];
                isprBody = payload['issue']['body'];
                break;
            case 'IssueCommentEvent':
                mainTitle = `created comment on issue #${payload['issue']['number']} in ${repo}`;
                comment_url = payload['comment']['html_url'];
                isprTitle = payload['issue']['title'];
                isprBody = payload['comment']['body'];
                break;
            case 'ForkEvent':
                mainTitle = `forked ${repo} to ${payload['forkee']['full_name']}`;
                url = payload['forkee']['html_url'];
                forker_url = url;
                break;
            case 'PullRequestEvent':
                mainTitle = `${payload['action']} pull request #${payload['number']} at ${repo}`;
                pullreq_url = payload['pull_request']['html_url'];
                isprTitle = payload['pull_request']['title'];
                isprBody = payload['pull_request']['body'];
                break;
            case 'MemberEvent':
                mainTitle = `${payload['action']} member ${payload['member']['login']} to ${repo}`;
                break;
            case 'PullRequestReviewCommentEvent':
                mainTitle = `${payload['action']} pull request review comment in pull request #${payload['pull_request']['number']} at ${repo}`;
                pullreq_url = payload['comment']['html_url'];
                isprTitle = payload['pull_request']['title'];
                isprBody = payload['comment']['body'];
                break;
            default:
                return {
                    type: type,
                        title: "Unknown Event",
                        url: "https://github.com",
                        avatar_url: avatar_url,
                        user_url: user_url,
                }
        }
    
        isprBody = isprBody.replace(/<.*>/g, '');
        return {
            type: type,
            mainTitle: mainTitle,
            url: url,
            comment_url: comment_url,
            forker_url: forker_url,
            pullreq_url: pullreq_url,
            user: actor,
            user_url: user_url,
            avatar_url: avatar_url,
            commits: commits,
            issue: isprTitle,
            body: isprBody
        }
    }
    
    /**
     * 拖动修改大小
     */
    function bindResize() {
        var hnd = document.getElementById('id-resize-handler');
        var el = document.getElementById('id-nav');
    
        $('#id-resize-handler').css("left", `calc(100% - ${$('#id-nav').width()}px - 10px)`);
    
        var x = 0,
            w = 0;
    
        $(hnd).mousedown((e) => {
            x = e.clientX;
            w = el.offsetWidth;
    
            x += w
    
            // TODO
            hnd.setCapture ? (
                hnd.setCapture(),
                hnd.onmousemove = (ev) => {
                    // mouseMove(ev || event);
                    mouseMove(ev);
                },
                hnd.onmouseup = mouseUp
            ) : (
                $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
            );
            e.preventDefault();
        })
    
        function mouseMove(e) {
            el.style.width = x - e.clientX + 'px';
        }
    
        function mouseUp(e) {
            hnd.releaseCapture ? (
                hnd.releaseCapture(),
                hnd.onmousemove = hnd.onmouseup = null
            ) : (
                $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
            )
            $('#id-resize-handler').css("left", `calc(100% - ${$('#id-nav').width()}px - 10px)`);
        }
    }
}