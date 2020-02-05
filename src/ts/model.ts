enum UrlType {
    User = 'user',
    Org = 'org',
    Repo = 'repo'
}

class UrlInfo {
    constructor(
        public type: UrlType,
        public info: UserOrgInfo | RepoInfo
    ) { }
}

class UserOrgInfo {
    public url: string;
    constructor(
        public name: string
    ) {
        this.url = `https://github.com/${name}`;
    }
}

class RepoInfo {
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

class Actor {
    public url: string;
    constructor(
        public name: string,
        public avatar: string
    ) {
        this.url = `https://github.com/${name}`;
    }
}

class Repo {
    public url: string;
    constructor(
        public name: string,
    ) {
        this.url = `https://github.com/${name}`;
    }
}

class GithubInfo {
    constructor(
        public type: string,
        public actor: Actor,
        public repo: Repo,
        public createTime: Date,
        public payload: Object
    ) { }
}
