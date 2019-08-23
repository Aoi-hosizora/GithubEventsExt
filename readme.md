# GithubEvents_ChromeExt
+ Let browser show github users and repos activity events
+ Use [Github API V3](https://developer.github.com/v3/) to build this extension

### Environment
+ `Chrome 76.0.3809.100`

### Functions
+ [x] Show Repo Events
+ [x] Show User Events
+ [x] Show different title and url of different events
+ [ ] Error reminder
+ [ ] ...

### How to run
+ git clone the whole repo
+ Open Chrome Extension setting [chrome://extensions/](chrome://extensions/)
+ Click `Load unpacked` to open the repo folder
+ (too poor to be a chrome developer)

![how-to-run](./assets/how-to-run.jpg)

![ext-setting](./assets/ext-setting.jpg)

### Events
+ Support Event: 
    + `PushEvent` `CreateEvent` `WatchEvent` `IssuesEvent` `IssueCommentEvent` `ForkEvent` `PullRequestEvent`
    + `MemberEvent` `PullRequestReviewCommentEvent` `CommitCommentEvent` `ReleaseEvent` `DeleteEvent` `PublicEvent`
+ If there is an unknown event, please open an issue.
+ (Event type will be shown when the cursor is hovering over the event icon)

![HoverIcon](./assets/HoverIcon.jpg)

### Tips
+ All element classNames start with `.ah-`
+ All element ids start with `#ahid-`

### Screenshot
![mainExt](./assets/mainExt.jpg)

### Problems
+ Resize is too slow
+ Could not distinguish user event and org event
+ ...

### References
+ [activity events types](https://developer.github.com/v3/activity/events/types/)
+ [chrome-plugin-demo](https://github.com/sxei/chrome-plugin-demo)
+ [github-repo-size](https://github.com/harshjv/github-repo-size)