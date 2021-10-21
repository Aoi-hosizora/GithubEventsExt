import { UrlInfo } from './model';

export class Global {
    public static token: string = '';
    public static isPin: boolean = false;
    public static width: number;
    public static isHovering: boolean = false;
    public static feedbackUrl: string = 'https://github.com/Aoi-hosizora/GithubEventsExt/issues';

    public static page: number = 1;
    public static info: UrlInfo;
}

export const STORAGE = chrome.storage.sync || chrome.storage.local;
export enum StorageFlag {
    Token = 'ah-token',
    Pin = 'ah-is-pin',
    Width = 'ah-width'
}

export function setStorage(flag: StorageFlag, value: any, callback?: () => void) {
    const obj: { [key: string]: any } = {};
    obj[flag.toString()] = value;
    STORAGE.set(obj, callback);
}

export function readStorage(callback: () => void) {
    STORAGE.get(objs => {
        Global.token = objs[StorageFlag.Token.toString()];
        Global.isPin = objs[StorageFlag.Pin.toString()];
        Global.width = objs[StorageFlag.Width.toString()];
        callback();
    });
}

export function getStorage(flag: StorageFlag, callback: (item: any) => void) {
    STORAGE.get(flag.toString(), items => callback(items[flag.toString()]));
}

export function removeStorage(flag: StorageFlag, callback?: () => void) {
    STORAGE.remove(flag.toString(), callback);
}
