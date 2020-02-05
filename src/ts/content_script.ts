import $ from 'jquery';
import { checkUrl } from './util'

document.addEventListener('DOMContentLoaded', () => {
    onLoaded();
});

function onLoaded() {
    let info = checkUrl();
    if (info === null) {
        return;
    }

    adjustGithubUI(info);
    mainInject(info);
}

function adjustGithubUI(info: UrlInfo) {
    // modify github shadow head bar zindex
    let ghShadowHeads = $('.gh-header-shadow');
    if (ghShadowHeads && ghShadowHeads.length > 0) {
        ghShadowHeads[0].style.zIndex = '89';
    }

    // inject menu
    let ghPopupMenu = $('.dropdown-menu.dropdown-menu-sw');
    if (ghPopupMenu) {
        $('<a>', {
            role: 'menuitem',
            class: 'dropdown-item',
            href: `/${info.info.name}?tab=followers`,
            text: 'Your followers'
        }).appendTo(ghPopupMenu);
        $('<a>', {
            role: 'menuitem',
            class: 'dropdown-item',
            href: `/${info.info.name}?tab=followings`,
            text: 'Your followings'
        }).appendTo(ghPopupMenu);
    }
}

function mainInject(info: UrlInfo) {
    let body = $('body');

    // div toggle
    $('<div>', {
        class: 'ah-content-toggle ah-content-toggle-hide ah-content-trans',
        id: 'ahid-toggle',
        text: `
        <svg width=10 height=14 viewBox="0 0 320 512">
            <path fill="#999999" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
        </svg>
        <span>Events</span>
        `
    }).appendTo(body);

    // nav content
    let mainNavTag = $('<nav>', {
        class: 'ah-content-nav ah-content-trans',
        id: 'ahid-nav'
    });
    body.append(mainNavTag);

    // ah-head
    let headTitle: string;
    switch (info.type) {
        case UrlType.User:
        case UrlType.Org:
            let userOrgInfo = info.info as UserOrgInfo;
            headTitle = `
                <span id="ahid-user-icon" class="ah-title-icon"></span>
                <a id="ahid-title-user" class="ah-title-head-a" href="${userOrgInfo.url}" target="_blank" title="${userOrgInfo.name}">${userOrgInfo.name}</a>
            `;
            break;
        case UrlType.Repo:
            let repoInfo = info.info as RepoInfo;
            headTitle = `
                <span id="ahid-repo-icon" class="ah-title-icon"></span>
                <a id="ahid-title-user" class="ah-title-head-a" href="${repoInfo.userUrl}" target="_blank" title="${repoInfo.user}">${repoInfo.user}</a> /
                <a id="ahid-title-repo" class="ah-title-head-a" href="${repoInfo.url}" target="_blank" title="${repoInfo.name}">${repoInfo.name}</a>
            `;
            break;
    }

    $('<div>', {
        id: 'ahid-head',
        text: `
        <a id="ahid-pin" href="javascript:void(0)" title="Pin">
            <svg width=9 height=14 viewBox="0 0 384 512">
                <path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"></path>
            </svg>
        </a>
        <a id="ahid-feedback" href="javascript:void(0)" title="Feedback">
            <svg width=14 height=14 viewBox="0 0 24 24">
                <path fill="#999" d="M20,2L4,2c-1.1,0 -1.99,0.9 -1.99,2L2,22l4,-4h14c1.1,0 2,-0.9 2,-2L22,4c0,-1.1 -0.9,-2 -2,-2zM13,14h-2v-2h2v2zM13,10h-2L11,6h2v4z"></path>
            </svg>
        </a>
        <a id="ahid-refresh" href="javascript:void(0)" title="Refresh">
            <svg width=14 height=14 viewBox="0 0 24 24">
                <path fill="#999" d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4 -3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4l-2.35,2.35z"></path>
            </svg>
        </a>
        <div id="ahid-title"> ${headTitle} </div>
        <div id="ahid-subtitle">
            <span id="ahid-event-icon" class="ah-title-icon"></span>
            <a id="ahid-event-url" href="#" target="_blank">
                <span>${info.type.toString()} events</span>
            </a>
        </div>
        `
    }).appendTo(mainNavTag);

    // ah-tail
    $('<div>', {
        id: 'ahid-tail',
        text: `
            <div id="ahid-content"
                data-repository-hovercards-enabled
                data-issue-and-pr-hovercards-enabled
                data-commit-hovercards-enabled> </div>

            <div id="ahid-foot">
                <div id="ahid-more-div">
                    <a id="ahid-more-a" href="javascript:void(0)">More...</a>
                </div>
                <div id="ahid-loading-label">Loading...</div>
            </div>

            <div id="ahid-resize-handler"></div>
        `
    }).appendTo(mainNavTag);

}
