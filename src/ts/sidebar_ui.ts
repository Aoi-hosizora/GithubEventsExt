import moment from 'moment';
import { RepoInfo, HoverCard } from './model';

// ===================
// format info related
// ===================

/**
 * Format RepoInfo to <li> string.
 */
export function formatInfoToLi(item: RepoInfo): string {
    function userHovercard(id: number): string {
        return `
            data-hovercard-type="user"
            data-hovercard-url="/hovercards?user_id=${id}"
        `;
    }

    const body = formatInfoToBody(item);
    if (!body) {
        return "";
    }
    const createAtStr = moment(new Date(item.createdAt)).format('YYYY/MM/DD HH:mm:ss');
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
                    <span class="ah-content-header-time">${createAtStr}</span>
                    ${item.public ? '' : '<span class="ah-content-header-private" title="This is a private event">Private</span>'}
                </div>
            </div>

            <div class="ah-content-body">
                ${body}
            </div>
        </li>
    `;
}

/**
 * Format RepoInfo to tags that will put inside body <div>.
 */
function formatInfoToBody(data: RepoInfo): string {
    const pl = data.payload;
    const repoUrl = `http://github.com/${data.repo.name}`;
    const repoA = a(data.repo.name, repoUrl, HoverCard.Repo, `/${data.repo.name}/hovercard`);

    switch (data.type) {
        case 'PushEvent':
            const commitCnt = pl.size > 1 ? `${pl.size} commits` : '1 commit';
            let commits = '';
            pl.commits.forEach(item => {
                commits += `
                    <div class="ah-content-body-sub">
                        ${a(item.sha.substring(0, 7), `${repoUrl}/commit/${item.sha}`, HoverCard.Commit, `/${data.repo.name}/commit/${item.sha}/hovercard`)}
                        <span class="ah-content-body-commit-wiki" title="${item.message}">${item.message}</span>
                    </div>
                `;
            });
            return title(`Pushed ${commitCnt} to ${pl.ref.split('/')[2]} at ${repoA}`)
                + commits;
        case 'WatchEvent':
            return title(`Starred repository ${repoA}`);
        case 'CreateBranchEvent':
        case 'CreateTagEvent':
        case 'CreateEvent':
            if (pl.refType === 'branch') {
                data.type = 'CreateBranchEvent';
                return title(`Created branch ${a(pl.ref, `${repoUrl}/tree/${pl.ref}`)} at ${repoA}`);
            } else if (pl.refType === 'tag') {
                data.type = 'CreateTagEvent';
                return title(`Created tag ${a(pl.ref, `${repoUrl}/tree/${pl.ref}`)} at ${repoA}`);
            } else if (pl.refType === 'repository') {
                return title(`Created ${data.public ? '' : 'private'} repository ${repoA}`)
                    + subContent(pl.description);
            } else {
                return '';
            }
        case 'ForkEvent':
            return title(`Forked ${repoA} to ${a(pl.forkee.fullName, pl.forkee.htmlUrl, HoverCard.Repo, `/${pl.forkee.fullName}/hovercard`)}`);
        case 'DeleteEvent':
            return title(`Deleted ${pl.refType} ${pl.ref} at ${repoA}`);
        case 'PublicEvent':
            return title(`Made repository ${repoA} ${data.public ? 'public' : 'private'}`);
        case 'IssuesEvent':
            return title(`${pl.action} issue ${a(`#${pl.issue.number}`, pl.issue.htmlUrl, HoverCard.Issue, `/${data.repo.name}/issues/${pl.issue.number}/hovercard`)
                } at ${repoA}`)
                + subTitle(pl.issue.title)
                + subContent(pl.issue.body);
        case 'IssueCommentEvent':
            return title(`${pl.action} ${a('comment', pl.comment.htmlUrl)} on issue ${a(`#${pl.issue.number}`, pl.issue.htmlUrl, HoverCard.Issue, `/${data.repo.name}/issues/${pl.issue.number}/hovercard`)
                } at ${repoA}`)
                + subTitle(pl.issue.title)
                + subContent(pl.comment.body);
        case 'PullRequestEvent':
            return title(`${pl.action} pull request ${a(`#${pl.pullRequest.number}`, pl.pullRequest.htmlUrl, HoverCard.Pull, `/${data.repo.name}/pull/${pl.pullRequest.number}/hovercard`)
                } at ${repoA}`)
                + subTitle(pl.pullRequest.title)
                + subContent(pl.pullRequest.body);
        case 'PullRequestReviewEvent':
            return title(`${pl.action} a pull request review in pull request ${a(`#${pl.pullRequest.number}`, pl.pullRequest.htmlUrl, HoverCard.Pull, `/${data.repo.name}/pull/${pl.pullRequest.number}/hovercard`)
                } at ${repoA}`);
        case 'PullRequestReviewCommentEvent':
            return title(`${pl.action} pull request review ${a('comment', pl.comment.htmlUrl)} in pull request ${a(`#${pl.pullRequest.number}`, pl.pullRequest.htmlUrl, HoverCard.Pull, `/${data.repo.name}/pull/${pl.pullRequest.number}/hovercard`)
                } at ${repoA}`)
                + subTitle(pl.pullRequest.title)
                + subContent(pl.comment.body);
        case 'CommitCommentEvent':
            return title(`Created a ${a('comment', pl.comment.htmlUrl)} in commit ${a(`#${pl.comment.commitId.substring(0, 7)}`, `${repoUrl}/commit/${pl.comment.commitId}`, HoverCard.Commit, `/${data.repo.name}/commit/${pl.comment.commitId}/hovercard`)
                } at ${repoA}`)
                + subContent(pl.comment.body);
        case 'MemberEvent':
            return title(`${pl.action} member ${a(pl.member.login, pl.member.htmlUrl, HoverCard.User, `/hovercards?user_id=${pl.member.id}`)} to ${repoA}`);
        case 'ReleaseEvent':
            return title(`${pl.action} release ${a(pl.release.tagName, pl.release.htmlUrl)} at ${repoA}`)
                + subTitle(pl.release.name)
                + subContent(pl.release.body);
        case 'GollumEvent':
            const pageCnt = pl.pages.length > 1 ? `${pl.pages.length} wiki pages` : '1 wiki page';
            let pages = '';
            pl.pages.forEach(item => {
                pages += `
                    <div class="ah-content-body-sub">
                        ${item.action} ${a(item.sha.substring(0, 7), item.htmlUrl)}
                        <span class="ah-content-body-commit-wiki" title="${item.title}">${item.title}</span>
                    </div>
                `;
            });
            return title(`Update ${pageCnt} at ${repoA}`)
                + pages;
        default:
            return title(`Unknown event: ${data.type}`);
    }
}

// ================
// helper functions
// ================

function title(content: string): string {
    return `<span class="ah-content-body-title">${content.capital()}</span>`;
}

function a(content: string, href: string, hover?: HoverCard, hoverUrl?: string): string {
    if (!hover || !hoverUrl) {
        return `<a href="${href}" target="_blank">${content}</a>`;
    } else {
        return `
            <a href="${href}" target="_blank" data-hovercard-type="${hover.toString()}" data-hovercard-url="${hoverUrl}">
                ${content}
            </a>
        `;
    }
}

function escape(str: string): string {
    if (!str) {
        return ""
    }
    return str.replaceAll('<', '').replaceAll('>', '');
}

function subTitle(content: string) {
    content = escape(content);
    return `<div class="ah-content-body-sub ah-content-body-subtitle" title="${content}">${content}</div>`;
}

function subContent(content: string) {
    content = escape(content);
    return `<div class="ah-content-body-sub ah-content-body-subcontent" title="${content}">${content}</div>`;
}

// ===========
// svg related
// ===========

export function getSvgTag(type: string, rate: number = 1) {
    let svgClass: string = '';
    let svgPath: string = '';
    let svgHeight: number = 0;
    let svgWidth: number = 0;
    switch (type) {
        case 'PushEvent':
            svgClass = 'octicon-repo-push';
            svgPath = 'M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z';
            [svgHeight, svgWidth] = [16, 12];
            break;
        case 'CreateEvent':
            svgClass = 'octicon-repo';
            svgPath = 'M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z';
            [svgHeight, svgWidth] = [16, 12];
            break;
        case 'CreateBranchEvent':
            svgClass = 'octicon-git-branch';
            svgPath = 'M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z';
            [svgHeight, svgWidth] = [16, 10];
            break;
        case 'CreateTagEvent':
        case 'ReleaseEvent':
            svgClass = 'octicon-tag';
            svgPath = 'M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z';
            [svgHeight, svgWidth] = [16, 14];
            break;
        case 'WatchEvent':
            svgClass = 'octicon-star';
            svgPath = 'M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z';
            [svgHeight, svgWidth] = [16, 14];
            break;
        case 'MemberEvent':
            svgClass = 'octicon-organization';
            svgPath = 'M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z';
            [svgHeight, svgWidth] = [16, 16];
            break;
        case 'IssuesEvent':
            svgClass = 'octicon-issue-opened';
            svgPath = 'M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z';
            [svgHeight, svgWidth] = [16, 14];
            break;
        case 'IssueCommentEvent':
        case 'CommitCommentEvent':
            svgClass = 'octicon-comment';
            svgPath = 'M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z';
            [svgHeight, svgWidth] = [16, 16];
            break;
        case 'ForkEvent':
            svgClass = 'octicon-repo-forked';
            svgPath = 'M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z';
            [svgHeight, svgWidth] = [16, 10];
            break;
        case 'PullRequestEvent':
            svgClass = 'octicon-git-pull-request';
            svgPath = 'M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z';
            [svgHeight, svgWidth] = [16, 12];
            break;
        case 'PullRequestReviewEvent':
        case 'PullRequestReviewCommentEvent':
            svgClass = 'octicon-eye';
            svgPath = 'M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z';
            [svgHeight, svgWidth] = [16, 16];
            break;
        case 'DeleteEvent':
            svgClass = 'octicon-x';
            svgPath = 'M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z';
            [svgHeight, svgWidth] = [16, 12];
            break;
        case 'PublicEvent':
            svgClass = 'octicon-lock';
            svgPath = 'M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z';
            [svgHeight, svgWidth] = [16, 12];
            break;
        case 'GollumEvent':
            svgClass = 'octicon-book';
            svgPath = 'M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z';
            [svgHeight, svgWidth] = [16, 16];
            break;
    }
    if (!svgClass) {
        return '';
    }
    svgClass = `octicon ${svgClass}`;

    let width = svgWidth;
    let height = svgHeight;
    if (rate < 1) {
        width = Math.floor(width * rate);
        height = Math.floor(height * rate);
    }

    return `
        <svg class="${svgClass}" version="1.1" aria-hidden="true" width="${width}" height="${height}" viewBox="0 0 ${svgWidth} ${svgHeight}">
            <path class="octicon-path" fill-rule="evenodd" d="${svgPath}"></path>
        </svg>
    `;
}