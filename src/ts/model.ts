export enum UrlType {
    User = 'user',
    Org = 'org',
    Repo = 'repo'
}

/**
 * document.URL parse result
 */
export class UrlInfo {
    public authorUrl: string;
    public repoUrl: string;
    public apiUrl: string;
    constructor(
        public type: UrlType,
        public author: string,
        public repo: string = ''
    ) {
        this.authorUrl = `https://github.com/${author}`;
        this.repoUrl = `https://github.com/${author}/${repo}/${name}`;

        let endpoint: string;
        if (this.type === UrlType.Repo) {
            endpoint = `${author}/${repo}`;
        } else {
            endpoint = author;
        }
        this.apiUrl = `https://api.github.com/${this.type.toString()}s/${endpoint}/events`;
    }
}

/**
 * github api parse result
 */
export class GithubInfo {
    constructor(
        public type: string,
        public actor: Actor,
        public repo: Repo,
        public isPublic: boolean,
        public createdAt: Date,
        public payload: Payload
    ) { }
}

export class Actor {
    public htmlUrl: string;
    constructor(
        public id: number,
        public login: string,
        public avatarUrl: string
    ) {
        this.htmlUrl = `https://github.com/${name}`;
    }
}

export class Repo {
    public htmlUrl: string;
    constructor(
        public id: number,
        public name: string
    ) {
        this.htmlUrl = `https://github.com/${name}`;
    }
}

export class Payload {
    constructor(
        public size: number,
        public commits: Commit[],
        public ref: string,
        public refType: string,
        public description: string,
        public action: string,
        public member: User,
        public issue: Issue,
        public comment: Comment,
        public forkee: Forkee,
        public pullRequest: PullRequest,
        public release: Release,
        public pages: Page[]
    ) { }
}

export class Commit {
    constructor(
        public sha: string,
        public message: string
    ) { }
}

export class User {
    constructor(
        public id: number,
        public login: string,
        public htmlUrl: string
    ) { }
}

export class Issue {
    constructor(
        public id: string,
        public title: string,
        public body: string,
        public htmlUrl: string
    ) { }
}

export class Comment {
    constructor(
        public id: number,
        public body: string,
        public commitId: string,
        public htmlUrl: string
    ) { }
}

export class Forkee {
    constructor(
        public id: number,
        public fullName: string,
        public owner: User,
        public htmlUrl: string
    ) { }
}

export class PullRequest {
    constructor(
        public id: number,
        public title: string,
        public desciption: string,
        public htmlUrl: string
    ) { }
}

export class Release {
    constructor(
        public id: number,
        public tagName: string,
        public name: string,
        public body: string,
        public htmlUrl: string
    ) { }
}

export class Page {
    constructor(
        public action: string,
        public title: string,
        public htmlUrl: string
    ) { }
}
