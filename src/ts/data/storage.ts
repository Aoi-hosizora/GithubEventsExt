import { URLInfo } from '@src/ts/data/model';

// ==============
// global related
// ==============

export class Global {
    // Basic settings from storage
    public static token: string = '';
    public static pinned: boolean = false;
    public static width: number = 250; // $min-width: 165px

    // Menu switchers from storage
    public static showFollowMenuItem: boolean = true;
    public static centerFollowText: boolean = true;
    public static showJoinedTime: boolean = true;
    public static showUserPrivateCounter: boolean = true;
    public static showRepoActionCounter: boolean = true;
    public static showRepoAndContentsSize: boolean = true;
    public static useBlankTarget: boolean = true;

    // Some global runtime variables
    public static urlInfo: URLInfo;
    public static page: number = 1;
    public static isHovering: boolean = false;
    public static contentsSizeCache: Map<string, number> | undefined;
    public static contentsSizeCachedRef: string = '';
    public static contentsSizeTruncated: boolean = false;

    // Constants
    public static readonly FEEDBACK_URL: string = 'https://github.com/Aoi-hosizora/GithubEventsExt/issues';
}

export enum StorageFlag {
    TOKEN = 'ah-token',
    PINNED = 'ah-pinned',
    WIDTH = 'ah-width',

    SHOW_FOLLOW_MENU_ITEM = 'ah-show-follow-menu-item',
    CENTER_FOLLOW_TEXT = 'ah-center-follow-text',
    SHOW_JOINED_TIME = 'ah-show-joined-time',
    SHOW_USER_PRIVATE_COUNTER = 'ah-show-user-private-counter',
    SHOW_REPO_ACTION_COUNTER = 'ah-show-repo-action-counter',
    SHOW_REPO_AND_CONTENTS_SIZE = 'ah-show-repo-contents-size',
    USE_BLANK_TARGET = 'ah-use-blank-target',
}

export async function readStorageToGlobal(): Promise<void> {
    Global.token = await getStorage<string>(StorageFlag.TOKEN, '', { alsoInit: false });
    Global.pinned = await getStorage<boolean>(StorageFlag.PINNED, false, { alsoInit: true });
    Global.width = await getStorage<number>(StorageFlag.WIDTH, 250, { alsoInit: true });

    Global.showFollowMenuItem = await getStorage<boolean>(StorageFlag.SHOW_FOLLOW_MENU_ITEM, true, { alsoInit: true });
    Global.centerFollowText = await getStorage<boolean>(StorageFlag.CENTER_FOLLOW_TEXT, true, { alsoInit: true });
    Global.showJoinedTime = await getStorage<boolean>(StorageFlag.SHOW_JOINED_TIME, true, { alsoInit: true });
    Global.showUserPrivateCounter = await getStorage<boolean>(StorageFlag.SHOW_USER_PRIVATE_COUNTER, true, { alsoInit: true });
    Global.showRepoActionCounter = await getStorage<boolean>(StorageFlag.SHOW_REPO_ACTION_COUNTER, true, { alsoInit: true });
    Global.showRepoAndContentsSize = await getStorage<boolean>(StorageFlag.SHOW_REPO_AND_CONTENTS_SIZE, true, { alsoInit: true });
    Global.useBlankTarget = await getStorage<boolean>(StorageFlag.USE_BLANK_TARGET, true, { alsoInit: true });
}

// ===============
// storage related
// ===============

const STORAGE = chrome.storage.sync || chrome.storage.local;

export async function setStorage(flag: StorageFlag, value: string | number | boolean): Promise<void> {
    return new Promise((resolve, _) => {
        const obj = { [flag.toString()]: value };
        STORAGE.set(obj, () => resolve());
    });
}

export async function getStorage<T extends string | number | boolean>(flag: StorageFlag, defaultValue: T, etc: { alsoInit?: boolean } = {}): Promise<T> {
    return new Promise((resolve, _) => {
        STORAGE.get(flag.toString(), items => {
            var value = items[flag.toString()];
            if (value === undefined || value === null || typeof value !== typeof defaultValue) {
                if (etc.alsoInit) {
                    const obj = { [flag.toString()]: defaultValue };
                    STORAGE.set(obj, () => resolve(defaultValue));
                } else {
                    resolve(defaultValue);
                }
            } else {
                resolve(value as T);
            }
        });
    });

}

export async function removeStorage(flag: StorageFlag): Promise<void> {
    return new Promise((resolve, _) => {
        STORAGE.remove(flag.toString(), () => resolve());
    });
}

// =============
// token related
// =============

export async function askToSetupToken() {
    const token = await getStorage<string>(StorageFlag.TOKEN, ''); // do not query from Global
    if (!token) {
        if (confirm('Do you want to setup a GitHub token to access the private repos and user information?')) {
            await addToken();
        }
    } else {
        await removeToken(token);
    }
}

async function addToken() {
    const msg = 'Please enter your GitHub personal access token: \n' +
        '(Token should be defined in repo scope and have read:user permission. You can visit https://github.com/settings/token to generate token.)';
    var token = prompt(msg);
    if (token === null) {
        return;
    }
    token = token.trim();
    if (!token) {
        alert('Oops! You have entered an empty token.');
    } else {
        await setStorage(StorageFlag.TOKEN, token); // do not update Global
        alert('Done! Your GitHub token has been set successfully, reload this page to see changes.');
    }
}

async function removeToken(token: string) {
    const ok = confirm(`You have already set a GitHub token (${token}), do you want to remove it?`);
    if (ok) {
        await removeStorage(StorageFlag.TOKEN); // do not update Global
        alert('You have removed GitHub token successfully.');
    }
}
