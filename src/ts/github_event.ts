import { Global } from './global';
import { UrlInfo } from './model';
import { fetchGithubEvents } from './util';

export function handleGithubEvent(info: UrlInfo, page: number = 1) {
    fetchGithubEvents(info, page).subscribe({
        next(x) {
            
        },
        error(e) {

        },
        complete() {

        }
    });
}

export function nextGithubEvent(info: UrlInfo) {
    handleGithubEvent(info, ++Global.page);
}
