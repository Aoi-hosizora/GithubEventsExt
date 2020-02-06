export enum UrlType {
    User = 'user',
    Org = 'org',
    Repo = 'repo'
}

export class UrlInfo {
    constructor(
        public type: UrlType,
        public info: UserOrgInfo | RepoInfo
    ) { }
}

export class UserOrgInfo {
    public url: string;
    constructor(
        public name: string
    ) {
        this.url = `https://github.com/${name}`;
    }
}

export class RepoInfo {
    public url: string;
    public userUrl: string;
    constructor(
        public name: string,
        public user: string
    ) {
        this.url = `https://github.com/${user}/${name}`;
        this.userUrl = `https://github.com/${user}`;
    }
}

export class Actor {
    public url: string;
    constructor(
        public name: string,
        public avatar: string
    ) {
        this.url = `https://github.com/${name}`;
    }
}

export class Repo {
    public url: string;
    constructor(
        public name: string
    ) {
        this.url = `https://github.com/${name}`;
    }
}

export class GithubInfo {
    constructor(
        public eventType: string,
        public actor: Actor,
        public repo: Repo,
        public createTime: Date,
        public payload: object
    ) { }
}
