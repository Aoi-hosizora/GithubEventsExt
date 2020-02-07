
import axios, { AxiosResponse } from 'axios';
import $ from 'jquery';
import { from, Observable } from 'rxjs';
import { Global } from './global';
import { GithubInfo, UrlInfo, UrlType } from './model';

export function checkUrl(): UrlInfo | null {
    const preserveKeywords = [
        '', 'pulls', 'issues', 'marketplace', 'explore', 'notifications',
        'new', 'login', 'organizations', 'settings', 'dashboard',
        'search', 'orgs', 'apps', 'users', 'repos', 'stars', 'account'
    ];

    // http://xxx.github.com/xxx#xxx?xxx
    const result = /(http|https):\/\/github\.com\/(.*)(#.*)?(\?.*)?/.exec(document.URL);
    if (!result) {
        return null;
    }
    const endpoint = result[2].split('/');
    if (endpoint.length === 0 || endpoint[0].indexOf('.') !== -1 || preserveKeywords.indexOf(endpoint[0]) !== -1) {
        return null;
    } else if (endpoint.length === 1) {
        if ($('.org-header-wrapper').length > 0) {
            return new UrlInfo(UrlType.Org, endpoint[0]);
        } else {
            return new UrlInfo(UrlType.User, endpoint[0]);
        }
    } else {
        return new UrlInfo(UrlType.Repo, endpoint[0], endpoint[1]);
    }
}

export function fetchGithubEvents(info: UrlInfo, page: number = 1): Observable<AxiosResponse<GithubInfo[]>> {
    const url = `${info.apiUrl}?page=${page}`;
    const headers: any = Global.token ? { 'Authorization': `Token ${Global.token}` } : {};
    const promise = axios.request<GithubInfo[]>({
        method: 'get',
        url,
        headers
    });
    return from(promise);
}
