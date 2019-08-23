/**
 * DOM 操作
 * @param {*} events 
 */
function addEvents(events) {

    if (!events) return;
    console.log(events);

    events.forEach(event => {
        var ret = parseApiJson(event);
        // console.log(ret);

        var commitsTag = '',
            isprTitleTag = '',
            isprCommentTag = '';

        /////////////////////////////////////////////////////////////////////////////////////////
        // 预处理数据
        /////////////////////////////////////////////////////////////////////////////////////////

        // Git commit
        if (ret.commits) {
            ret.commits.forEach((commit) => {
                commitsTag += `
                            <div class="ah-commit-div">
                                <a href="${commit['url']}" target="_blank" class="ah-commit-sha">${commit['sha'].substring(0, 7)}</a>
                                <span class="ah-commit-title"> ${commit['commit']}</span>
                            </div>
                        `;
            })
        }

        // Issue PullReq 标题
        if (ret.issue) {
            isprTitleTag = `
            <div class="ah-issue-title">
                <span>${ret.issue}</span>
            </div>
            `;
        }

        // Issue PullReq 评论
        if (ret.body)
            isprCommentTag = `<div class="ah-content-comment">${ret.body}</div>`;

        /////////////////////////////////////////////////////////////////////////////////////////
        // 拆分主标题
        /////////////////////////////////////////////////////////////////////////////////////////

        // 拆分临时数据
        var mt = [], // title 其他部分
            mr = ''; // repo 部分

        var titleSpanTag = ''; // 最终标签

        // 首字母大写
        if (ret.mainTitle)
            ret.mainTitle = ret.mainTitle.replace(ret.mainTitle[0], ret.mainTitle[0].toUpperCase())

        // 拆分
        mt = ret.mainTitle.split(' ');
        mr = mt[mt.length - 1];

        switch (ret.type) {
            case 'ForkEvent':
                // Forked angular/angular to coulonxyz/angular
                var forker = mt[1];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt[0]} 
                        <a href="${ret.forker_url}" target="_blank">${forker}</a> 
                        ${mt.slice(2, mt.length).join(' ')}
                    </span>
                `;
                break;
            case 'IssueCommentEvent':
                // Created comment on issue #32258 "yarn setup not working in aio" in angular/angular
                var issueId = mt[4];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 4).join(' ')} 
                        <a href="${ret.comment_url}" target="_blank">${issueId}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
            case 'IssuesEvent':
                // Opened issue #32264 in angular/angular
                var issueId = mt[2];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 2).join(' ')} 
                        <a href="${ret.comment_url}" target="_blank">${issueId}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
            case 'PullRequestEvent':
                // Opened pull request #32267 "docs: fixed animations reference links to api" at angular/angular
                var pullReqId = mt[3];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 3).join(' ')} 
                        <a href="${ret.pullreq_url}" target="_blank">${pullReqId}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
            case 'PullRequestReviewCommentEvent':
                // Created pull request review comment in pull request #undefined at angular/angular
                var pullReqId = mt[8];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 8).join(' ')} 
                        <a href="${ret.pullreq_url}" target="_blank">${pullReqId}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
            case 'CommitCommentEvent':
                // Created a comment at commit #904a201 in angular/angular
                var pullReqId = mt[5];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 5).join(' ')} 
                        <a href="${ret.comment_url}" target="_blank">${pullReqId}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
                case 'CreateBranchEvent':
                // Created branch add-license-1 at Aoi-hosizora/NNS_Android Aoi-hosizora/NNS_Android
                var branch = mt[2];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 2).join(' ')} 
                        <a href="${ret.branchtag_url}" target="_blank">${branch}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
                case 'CreateTagEvent':
                // Created tag 1.1 at Aoi-hosizora/NNS_Android Aoi-hosizora/NNS_Android
                var tag = mt[2];
                titleSpanTag = `
                    <span class="ah-content-title">
                        ${mt.splice(0, 2).join(' ')} 
                        <a href="${ret.branchtag_url}" target="_blank">${tag}</a> 
                        ${mt.slice(1, mt.length).join(' ')}
                    </span>
                `;
                break;
            default:
                titleSpanTag = `<span class="ah-content-title">${mt.join(' ')} </span>`;
        }

        /////////////////////////////////////////////////////////////////////////////////////////
        // 插入内容
        /////////////////////////////////////////////////////////////////////////////////////////

        $('#ahid-ul').append(`
                    ${firstFlag == true ? '' : '<hr style="margin: 8px 0;"/>'}
                    <li>
                        <div class="ah-avator-div">

                            <img src="${ret.avatar_url}" alt="" class="ah-avator-icon"/>
                            <span class="ah-avator-link"><a href="${ret.user_url}" target="_blank">${ret.user}</a></span>
                        
                            <span class="ah-avator-item-icon" title="${ret.type}">
                                ${getSvgTag(ret.type)}
                            </span>
                            <span class="ah-content-cttime">Create at ${ret.createTime}</span>
                            
                        </div>
                        ${titleSpanTag}
                        <a href="${ret.url}" target="_blank" class="ah-content-repo">${mr}</a>
                        ${commitsTag} 
                        ${isprTitleTag} ${isprCommentTag} 
                    </li>
                `);

        firstFlag = false;
    });
}

/**
 * 解析返回的 API 结果
 * @param {*} event 
 */
function parseApiJson(event) {

    /*
        PushEvent                       octicon octicon-repo-push
        CreateEvent (repo)              octicon octicon-repo                -> CreateEvent
        CreateEvent (branch)            octicon octicon-git-branch          -> CreateBranchEvent
        CreateEvent (tag)               octicon octicon-tag                 -> CreateTagEvent
        WatchEvent                      octicon octicon-star
        MemberEvent                     octicon octicon-organization
        IssuesEvent                     octicon octicon-issue-opened
        IssueCommentEvent               octicon octicon-comment
        ForkEvent                       octicon octicon-repo-forked
        PullRequestEvent                octicon octicon-git-pull-request
        PullRequestReviewCommentEvent   octicon octicon-eye
        CommitCommentEvent              octicon octicon-comment
    */

    let type = event['type'];
    let actor = event['actor']['login'];
    let repo = event['repo']['name'];
    let payload = event['payload'];
    let createTime = UTC2Local(event['created_at']);

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
    let branchtag_url = '';

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
                branchtag_url = `${url}/tree/${payload['ref']}`;
            } else if (payload['ref_type'] == 'tag') {
                type = "CreateTagEvent"
                mainTitle = `created tag ${payload['ref']} at ${repo}`;
                branchtag_url = `${url}/tree/${payload['ref']}`;
            } else if (payload['ref_type'] == 'repository') {
                mainTitle = `created a ${event['public'] ? 'public' : 'private'} repository ${repo}`;
            }
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
        case 'CommitCommentEvent':
            mainTitle = `created a comment at commit #${payload['comment']['commit_id'].substring(0, 7)} in ${repo}`;
            comment_url = payload['comment']['html_url'];
            isprBody = payload['comment']['body'];
            break;
        default:
            ret = {
                type: type,
                mainTitle: "Unknown Event",
                url: "https://github.com",
                avatar_url: avatar_url,
                user: actor,
                user_url: user_url,
                createTime: createTime
            }
            return ret;
    }

    isprBody = isprBody.replace(/<.*>/g, '');
    return {
        type: type,
        mainTitle: mainTitle,
        url: url,
        comment_url: comment_url,
        forker_url: forker_url,
        pullreq_url: pullreq_url,
        branchtag_url: branchtag_url,
        user: actor,
        user_url: user_url,
        avatar_url: avatar_url,
        commits: commits,
        issue: isprTitle,
        body: isprBody,
        createTime: createTime
    }
}

/**
 * 异步获取数据 回调
 * @param {*} url `xxx?page=`
 * @param {*} page 
 * @param {*} token 
 * @param {*} cb `(data) => {}`
 * @param {*} err  `() => {}`
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
            console.log(textStatus);

            err();
        }
    });
}

/**
 * UTC -> Local Time
 * @param {*} utc 
 */
function UTC2Local(utc) {
    if (!utc) return '';

    // 
    var date2 = new Date(utc);

    var year = date2.getFullYear();
    var mon = formatFunc(date2.getMonth() + 1);
    var day = formatFunc(date2.getDate());
    var hour = formatFunc(date2.getHours());
    var min = formatFunc(date2.getMinutes());
    var dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;

    return dateStr;

    /**
     * 格式化数字
     * @param {*} num 
     */
    function formatFunc(num) {
        return num > 9 ? num : '0' + num
    }
}