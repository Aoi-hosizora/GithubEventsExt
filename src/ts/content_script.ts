import $ from 'jquery';
import template from '../html/template.html';
import { checkUrl } from './util';

document.addEventListener('DOMContentLoaded', () => {
    onLoaded();
});

function onLoaded() {
    const info = checkUrl();
    if (info === null) {
        return;
    }

    adjustGithubUI(info);
    mainInject(info);
}

function adjustGithubUI(info: UrlInfo) {
    // modify github shadow head bar zindex
    const ghShadowHeads = $('.gh-header-shadow');
    if (ghShadowHeads && ghShadowHeads.length > 0) {
        ghShadowHeads[0].style.zIndex = '89';
    }

    // inject menu
    const ghPopupMenu = $('.dropdown-menu.dropdown-menu-sw');
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
    let renderedTemplate = template
        .replace('${urlType}', info.type.toString());

    const reUser = /\$\{if isUser\}(.+?)\$\{endif\}/g;
    const reRepo = /\$\{if isRepo\}(.+?)\$\{endif\}/g;
    if (info.type === UrlType.Repo) {
        const repoInfo = info.info as RepoInfo;
        renderedTemplate = renderedTemplate
            .replace(reUser, '').replace(reRepo, RegExp.$1)
            .replace('${repoInfo.userUrl}', repoInfo.userUrl)
            .replace('${repoInfo.user}', repoInfo.user)
            .replace('${repoInfo.url}', repoInfo.url)
            .replace('${repoInfo.name}', repoInfo.name);
    } else {
        const userOrgInfo = info.info as UserOrgInfo;
        renderedTemplate = renderedTemplate
            .replace(reRepo, '').replace(reUser, RegExp.$1)
            .replace('${userOrgInfo.url}', userOrgInfo.url)
            .replace('${userOrgInfo.name}', userOrgInfo.name);
    }

    $('body').append(renderedTemplate);
}
