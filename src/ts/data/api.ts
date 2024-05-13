import { StorageFlag } from "@src/ts/data/storage";

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