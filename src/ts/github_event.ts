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
            console.log(resp.data);
            const ul = $('#ahid-ul');
            resp.data.forEach(item => {
                const li = wrapGithubLi(item);
                if (!li) {
                    return;
                }
                if (ul.text().trim() !== '') {
                    ul.append('<hr style="margin: 8px 0;" />');
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
    return `
        <li>
            <div class="ah-avator-div">
                <div class="ah-content-avatar">
                    <a href="${item.actor.htmlUrl}" target="_blank"
                        style="text-decoration:none"
                        data-hovercard-type="user"
                        data-hovercard-url="/hovercards?user_id=${item.actor.id}" 
                        data-octo-click="hovercard-link-click"
                        data-octo-dimensions="link_type:self"
                    >
                        <img src="${item.actor.avatarUrl}" alt="" class="ah-avator-icon"/>
                    </a>
                    <span class="ah-avator-link">
                        <a 
                            href="${item.actor.htmlUrl}" target="_blank"
                            data-hovercard-type="user"
                            data-hovercard-url="/hovercards?user_id=${item.actor.id}" 
                            data-octo-click="hovercard-link-click"
                            data-octo-dimensions="link_type:self"
                        >
                            ${item.actor.login}
                        </a>
                    </span>
                    <span class="ah-avator-item-icon" title="${item.type}">
                        ${getSvgTag(item.type)}
                    </span>
                </div>

                <div class="ah-content-pt">
                    <span class="ah-content-cttime">${item.createdAt}</span>
                    ${item.isPublic ? '' : '<span class="ah-content-private labeltag">Private</span>'}
                </div>
            </div>
        </li>
    `;
}

function wrapGithubLi(data: GithubInfo): string {
    switch (data.type) {
        case 'PushEvent':
            return ``;
        case 'WatchEvent':
            break;
        case 'CreateEvent':
            break;
        case 'ForkEvent':
            break;
        case 'DeleteEvent':
            break;
        case 'PublicEvent':
            break;
        case 'IssuesEvent':
            break;
        case 'IssueCommentEvent':
            break;
        case 'PullRequestEvent':
            break;
        case 'PullRequestReviewCommentEvent':
            break;
        case 'CommitCommentEvent':
            break;
        case 'MemberEvent':
            break;
        case 'ReleaseEvent':
            break;
        case 'GollumEvent':
            break;
        default:
            break;
    }
    return '1';
}
