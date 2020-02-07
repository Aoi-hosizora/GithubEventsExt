import { AxiosResponse } from 'axios';
import $ from 'jquery';
import { Global } from './global';
import { GithubInfo, UrlInfo } from './model';
import { getSvgTag, showMessage } from './ui_event';
import { fetchGithubEvents } from './util';

export function handleGithubEvent(info: UrlInfo, page: number = 1) {
    showMessage(false, 'Loading...');
    fetchGithubEvents(info, page).subscribe({
        next(resp: AxiosResponse<GithubInfo[]>) {
            showMessage(false, '');
            // console.log(resp);
            const ul = $('#ahid-ul');
            resp.data.forEach(item => {
                const li = wrapGithubLi(item);
                if (!li) {
                    return;
                }
                if (ul.text().trim() !== '') {
                    ul.append('<hr class="ah-hr" />');
                }
                ul.append(catAppend(item));
            });
        },
        error(e) {
            if (page === 1) {
                showMessage(true, e);
            }
        }
    });
}

export function nextGithubEvent(info: UrlInfo) {
    handleGithubEvent(info, ++Global.page);
}

function catAppend(item: GithubInfo): string {
    function userHovercard(id: number): string {
        return `
            data-hovercard-type="user"
            data-hovercard-url="/hovercards?user_id=${id}" 
            data-octo-click="hovercard-link-click"
            data-octo-dimensions="link_type:self"
        `;
    }
    return `
        <li>
            <div class="ah-content-header">
                <div class="ah-content-header-user">
                    <a href="https://github.com/${item.actor.login}" target="_blank" style="text-decoration:none" ${userHovercard(item.actor.id)}>
                        <img class="ah-content-header-icon ah-content-header-avatar" src="${item.actor.avatarUrl}" alt="" />
                    </a>
                    <span class="ah-content-header-link">
                        <a href="https://github.com/${item.actor.login}" target="_blank" ${userHovercard(item.actor.id)}>${item.actor.login}</a>
                    </span>
                    <span class="ah-content-header-icon ah-content-header-event" title="${item.type}">${getSvgTag(item.type)}</span>
                </div>
                <div class="ah-content-header-info">
                    <span class="ah-content-header-time">${new Date(item.createdAt).toLocaleString()}</span>
                    ${item.public ? '' : '<span class="ah-content-header-private ah-labeltag" title="This is a private event">Private</span>'}
                </div>
            </div>
            <div class="ah-content-body">${wrapGithubLi(item)}</div>
        </li>
    `;
}

function wrapGithubLi(data: GithubInfo): string {
    const pl = data.payload;
    const repoUrl = `http://github.com/${data.repo.name}`;
    const repoA = `
        <a href="${repoUrl}" target="_blank" class="ah-content-repo" data-hovercard-type="repository" data-hovercard-url="${data.repo.name}/hovercard">
        ${data.repo.name}</a>
    `;

    switch (data.type) {
        case 'PushEvent':
            const commitCnt = pl.size > 1 ? `${pl.size} commits` : '1 commit';
            let commits = '';
            pl.commits.forEach(item => {
                commits += `
                    <div class="ah-commit-div ah-sub-content">
                        <a href="${repoUrl}/commit/${item.sha}" target="_blank" class="ah-commit-sha" data-hovercard-type="commit" data-hovercard-url="/${data.repo.name}/commit/${item.sha}/hovercard">
                        ${item.sha.substring(0, 7)}</a>
                        <span class="ah-commit-title" title="${item.message}">${item.message}</span>
                    </div>
                `;
            });
            return `
                <span class="ah-content-body-title">Pushed ${commitCnt} to ${pl.ref.split('/')[2]} at ${repoA}</span>
                ${commits}
            `;
        case 'WatchEvent':
            return `<span class="ah-content-body-title">Starred repository ${repoA}</span>`;
        case 'CreateBranchEvent':
        case 'CreateTagEvent':
        case 'CreateEvent':
            if (pl.refType === 'branch') {
                data.type = 'CreateBranchEvent';
                return `<span class="ah-content-body-title">Created branch <a href="${repoUrl}/tree/${pl.ref}" target="_blank">${pl.ref}</a> at ${repoA}</span>`;
            } else if (pl.refType === 'tag') {
                data.type = 'CreateTagEvent';
                return `<span class="ah-content-body-title">Created tag <a href="${repoUrl}/tree/${pl.ref}" target="_blank">${pl.ref}</a> at ${repoA}</span>`;
            } else if (pl.refType === 'repository') {
                return `
                    <span class="ah-content-body-title">Created ${data.public ? '' : 'private'} repository ${repoA}</span>
                    <div class="ah-ipr-body ah-sub-content" title="${pl.description}">${pl.description}</div>
                `;
            } else {
                return '';
            }
        case 'ForkEvent':
            const forkerCard = `
                <a href="${pl.forkee.htmlUrl}" target="_blank" class="ah-content-repo" data-hovercard-type="repository" data-hovercard-url="/${pl.forkee.fullName}/hovercard">
                    ${pl.forkee.fullName}
                </a>
            `;
            return `
                <span class="ah-content-body-title">Forked ${repoA} to ${forkerCard}</span>
            `;
        case 'DeleteEvent':
            return `<span class="ah-content-body-title">Deleted ${pl.refType} ${pl.ref} at ${repoA}</span>`;
        case 'PublicEvent':
            return `<span class="ah-content-body-title">Made repository ${repoA} ${data.public ? 'public' : 'private'}</span>`;
        case 'IssuesEvent':
            const issueCard = `
                <a href="${pl.issue.htmlUrl}" target="_blank" data-hovercard-type="issue" data-hovercard-url="/${data.repo.name}/issues/${pl.issue.number}/hovercard">
                #${pl.issue.number}</a>
            `;
            return `
                <span class="ah-content-body-title">${pl.action} issue ${issueCard} at ${repoA}</span>
                <div class="ah-ipr-title ah-sub-content" title="${pl.issue.title}">${pl.issue.title}</div>
                <div class="ah-ipr-body ah-sub-content" title="${pl.issue.body}">${pl.issue.body}</div>
            `;
        case 'IssueCommentEvent':
            const issueCommentCard = `
                <a href="${pl.issue.htmlUrl}" target="_blank" data-hovercard-type="issue" data-hovercard-url="/${data.repo.name}/issues/${pl.issue.number}/hovercard">
                #${pl.issue.number}</a>
            `;
            return `
                <span class="ah-content-body-title">${pl.action} <a href="${pl.comment.htmlUrl}" target="_blank">comment</a> on issue ${issueCommentCard} at ${repoA}</span>
                <div class="ah-ipr-title ah-sub-content" title="${pl.issue.title}">${pl.issue.title}</div>
                <div class="ah-ipr-body ah-sub-content" title="${pl.comment.body}">${pl.comment.body}</div>
            `;
        case 'PullRequestEvent':
            const pullReqCard = `
                <a href="${pl.pullRequest.htmlUrl}" target="_blank" data-hovercard-type="pull_request" data-hovercard-url="/${data.repo.name}/pull/${pl.pullRequest.number}/hovercard">
                #${pl.pullRequest.number}</a>
            `;
            return `
                <span class="ah-content-body-title">${pl.action} pull request ${pullReqCard} at ${repoA}</span>
                <div class="ah-ipr-title ah-sub-content" title="${pl.pullRequest.title}">${pl.pullRequest.title}</div>
                <div class="ah-ipr-body ah-sub-content" title="${pl.pullRequest.body}">${pl.pullRequest.body}</div>
            `;
        case 'PullRequestReviewCommentEvent':
            const pullReqCommentCard = `
                <a href="${pl.pullRequest.htmlUrl}" target="_blank" data-hovercard-type="pull_request" data-hovercard-url="/${data.repo.name}/pull/${pl.pullRequest.number}/hovercard">
                #${pl.pullRequest.number}</a>
            `;
            return `
                <span class="ah-content-body-title">${pl.action} pull request review <a href="${pl.comment.htmlUrl}" target="_blank">comment</a> in pull request ${pullReqCommentCard} at ${repoA}</span>
                <div class="ah-ipr-title ah-sub-content" title="${pl.pullRequest.title}">${pl.pullRequest.title}</div>
                <div class="ah-ipr-body ah-sub-content" title="${pl.comment.body}">${pl.comment.body}</div>
            `;
        case 'CommitCommentEvent':
            const commitCommentCard = `
                <a href="${repoUrl}/commit/${pl.comment.commitId}" target="_blank" class="ah-commit-sha" data-hovercard-type="commit" data-hovercard-url="/${data.repo.name}/commit/${pl.comment.commitId}/hovercard">
                #${pl.comment.commitId.substring(0, 7)}</a>
            `;
            return `
                <span class="ah-content-body-title">Created a <a href="${pl.comment.htmlUrl}" target="_blank">comment</a> at commit ${commitCommentCard} in ${repoA}</span>
                <div class="ah-ipr-body ah-sub-content" title="${pl.comment.body}">${pl.comment.body}</div>
            `;
        case 'MemberEvent':
            const memberCard = `
                <a href="${pl.member.htmlUrl}" target="_blank" data-hovercard-type="user" data-hovercard-url="/hovercards?user_id=${pl.member.id}">
                ${pl.member.login}</a>
            `;
            return `<span class="ah-content-body-title">${pl.action} member ${memberCard} to ${repoA}</span>`;
        case 'ReleaseEvent':
            return `
                <span class="ah-content-body-title">${pl.action} release <a href="${pl.release.htmlUrl}" target="_blank">${pl.release.tagName}</a> at ${repoA}</span>
                <div class="ah-ipr-title ah-sub-content" title="${pl.release.name}">${pl.release.name}</div>
                <div class="ah-ipr-body ah-sub-content" title="${pl.release.body}">${pl.release.body}</div>
            `;
        case 'GollumEvent':
            const pageCnt = pl.pages.length > 1 ? `${pl.pages.length} wiki pages` : '1 wiki page';
            let pages = '';
            pl.pages.forEach(item => {
                pages += `
                    <div class="ah-commit-div ah-sub-content">
                        ${item.action} <a href="${item.htmlUrl}" target="_blank">${item.sha.substring(0, 7)}</a>
                        <span class="ah-commit-title" title="${item.title}">${item.title}</span>
                    </div>
                `;
            });
            return `
                <span class="ah-content-body-title">Update ${pageCnt} at ${repoA}</span>
                ${pages}
            `;
        default:
            return `<span class="ah-content-body-title">Unknwon event: ${data.type}</span>`;
    }
}
