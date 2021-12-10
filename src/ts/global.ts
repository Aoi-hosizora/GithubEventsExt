import { URLInfo } from './model';

export class Global {
    // Settings from storage
    public static token: string = '';
    public static pinned: boolean = false;
    public static width: number;

    // Some global runtime variables
    public static urlInfo: URLInfo;
    public static page: number = 1;
    public static isHovering: boolean = false;

    // Constants
    public static readonly FEEDBACK_URL: string = 'https://github.com/Aoi-hosizora/GithubEventsExt/issues';
}

const STORAGE = chrome.storage.sync || chrome.storage.local;

export enum StorageFlag {
    TOKEN = 'ah-token',
    PINNED = 'ah-pinned',
    WIDTH = 'ah-width'
}

export async function setStorage(flag: StorageFlag, value: any): Promise<void> {
    return new Promise((resolve, _) => {
        const obj = { [flag.toString()]: value };
        STORAGE.set(obj, () => resolve());
    });
}

export async function getStorage(flag: StorageFlag): Promise<any> {
    return new Promise((resolve, _) => {
        STORAGE.get(flag.toString(), items => {
            var value = items[flag.toString()];
            resolve(value);
        });
    });

}

export async function removeStorage(flag: StorageFlag): Promise<void> {
    return new Promise((resolve, _) => {
        STORAGE.remove(flag.toString(), () => resolve());
    });
}

export async function readStorageToGlobal(): Promise<void> {
    return new Promise((resolve, _) => {
        STORAGE.get(items => {
            Global.token = items[StorageFlag.TOKEN.toString()];
            Global.pinned = items[StorageFlag.PINNED.toString()];
            Global.width = items[StorageFlag.WIDTH.toString()];
            resolve();
        });
    });
}
