import $ from 'jquery';
import template from '../html/template.html';
import "./extension";
import { RepoInfo, UrlInfo, UrlType, UserOrgInfo } from './model';
import { checkUrl } from './util';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Start");
    onLoaded();
    console.log("Finish");
});

function onLoaded() {
    const info = checkUrl();
    if (info === null) {
        return;
    }

    adjustGithubUI(info);
    mainInject(info);
    loadEvent();
}

function adjustGithubUI(info: UrlInfo) {
    // modify github shadow head bar zindex
    const ghShadowHeads = $('.gh-header-shadow');
    if (ghShadowHeads && ghShadowHeads.length > 0) {
        ghShadowHeads[0].style.zIndex = '89';
    }

    // inject menu
    const ghYourGistTag = $('.dropdown-menu.dropdown-menu-sw .dropdown-item[data-ga-click$="your gists"]');
    if (ghYourGistTag) {
        $('<a>', {
            role: 'menuitem',
            class: 'dropdown-item',
            href: `/${info.info.name}?tab=followers`,
            text: 'Your followers',
            'data-ga-click': 'Header, go to followers, text:your followers'
        }).insertBefore(ghYourGistTag);
        $('<a>', {
            role: 'menuitem',
            class: 'dropdown-item',
            href: `/${info.info.name}?tab=followings`,
            text: 'Your followings',
            'data-ga-click': 'Header, go to followings, text:your followings'
        }).insertBefore(ghYourGistTag);
    }
}

function mainInject(info: UrlInfo) {

    let renderedTemplate = template
        .replaceAll(/<!--(.|[\r\n])+?-->/, '')
        .replaceAll('${urlType}', info.type.toString());

    const reUser = /\$\{if isUser\}((.|[\r\n])+?)\$\{endif\}/m;
    const reRepo = /\$\{if isRepo\}((.|[\r\n])+?)\$\{endif\}/m;
    if (info.type === UrlType.Repo) {
        const repoInfo = info.info as RepoInfo;
        renderedTemplate = renderedTemplate
            .replaceAll(reUser, '')
            .replaceAll(reRepo, reRepo.exec(renderedTemplate)!![1])
            .replaceAll('${repoInfo.userUrl}', repoInfo.userUrl)
            .replaceAll('${repoInfo.user}', repoInfo.user)
            .replaceAll('${repoInfo.url}', repoInfo.url)
            .replaceAll('${repoInfo.name}', repoInfo.name);
    } else {
        const userOrgInfo = info.info as UserOrgInfo;
        renderedTemplate = renderedTemplate
            .replace(reRepo, '')
            .replace(reUser, reUser.exec(renderedTemplate)!![1])
            .replaceAll('${userOrgInfo.url}', userOrgInfo.url)
            .replaceAll('${userOrgInfo.name}', userOrgInfo.name);
    }

    $('body').append(renderedTemplate);
}

function loadEvent() { }
