import { AxiosResponse } from 'axios';
import { Global } from './global';
import { GithubInfo, UrlInfo } from './model';
import { showMessage } from './ui_event';
import { fetchGithubEvents } from './util';

export function handleGithubEvent(info: UrlInfo, page: number = 1) {
    showMessage(false, 'Loading...');
    fetchGithubEvents(info, page).subscribe({
        next(resp: AxiosResponse<GithubInfo[]>) {
            const ul = $('#ahid-ul');
            resp.data.forEach(item => {
                const li = wrapGithubLi(item);
                if (li) {
                    ul.append(li);
                }
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

function wrapGithubLi(data: GithubInfo): string {
    return '';
}
