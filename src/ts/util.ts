
import axios from 'axios';
import $ from 'jquery';
import { Observable, Observer } from 'rxjs';

export function checkUrl(): UrlInfo | null {
    const preserveKeywords = [
        '', 'pulls', 'issues', 'marketplace', 'explore', 'notifications',
        'new', 'login', 'organizations', 'settings', 'dashboard',
        'search', 'orgs', 'apps', 'users', 'repos', 'stars', "account"
    ];

    // http://xxx.github.com/xxx#xxx?xxx
    const result = /(http|https):\/\/github\.com\/(.*)(#.*)?(\?.*)?/.exec(document.URL);
    if (!result) {
        return null;
    }
    const endpoint = result[1].split('/');
    if (endpoint.length === 0 || endpoint[0].indexOf('.') !== -1 || preserveKeywords.indexOf(endpoint[0]) !== -1) {
        return null;
    } else if (endpoint.length === 1) {
        const type = $('.org-header-wrapper').length > 0 ? UrlType.Org : UrlType.User;
        return new UrlInfo(type, new UserOrgInfo(endpoint[0]));
    } else {
        return new UrlInfo(UrlType.Repo, new RepoInfo(endpoint[1], endpoint[0]));
    }
}

/**
 * Current query page
 */
let currentPage = 1;

export function fetchEvents(info: UrlInfo, page: number = 1): Observer<any> {
    const url = `https://api.github.com/${info.type.toString()}s/${info.info.name}/events?page=${page}`;
    return Observable.create((obs: Observer<any>) => {
        axios.get(url).then(response => {
            obs.next(response.data);
            obs.complete();
        }).catch(error => {
            obs.error(error);
        });
    });
}

export function nextPageEvents(info: UrlInfo) {
    return fetchEvents(info, ++currentPage);
}