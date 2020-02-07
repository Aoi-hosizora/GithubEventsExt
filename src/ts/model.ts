export enum UrlType {
    User = 'user',
    Org = 'org',
    Repo = 'repo'
}

/**
 * document.URL parse result
 */
export class UrlInfo {
    public apiUrl: string;
    constructor(
        public type: UrlType,
        public info: UserOrgInfo | RepoInfo
    ) { 
        let endpoint: string;
        if (this.type === UrlType.Repo) {
            endpoint = `${(this.info as RepoInfo).user}/${(this.info as RepoInfo).name}`;
        } else {
            endpoint = (this.info as UserOrgInfo).name;
        }
        this.apiUrl = `https://api.github.com/${this.type.toString()}s/${endpoint}/events`;
    }
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

//////////////////////////////////////////////////////////////////////////////////

/**
 * github api parse result
 */
export class GithubInfo {
    constructor(
        public eventType: string,
        public actor: Actor,
        public repo: Repo,
        public createTime: Date,
        public payload: any
    ) { }
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
