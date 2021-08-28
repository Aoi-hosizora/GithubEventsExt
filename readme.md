# GithubEventsExt

+ A chrome extension that let browser show GitHub activity events.
+ For TamperMonkey version, please visit [Aoi-hosizora/GithubEvents_TamperMonkey](https://github.com/Aoi-hosizora/GithubEvents_TamperMonkey).

### Functions

+ [x] Show repo, user and org events in human readable format.
+ [x] Support for private repo events.
+ [x] Add some menu items to profile menu.

### Run

1. Build the project.

```bash
git clone git@github.com:Aoi-hosizora/GithubEventsExt.git
cd GithubEventsExt

npm install
npm run build # or npm run watch
```

2. Add to chrome extension.

+ Open Chrome Extension setting in `chrome://extensions/`
+ Click `Load unpacked` button and select the generated `/dist` folder

![how-to-run](./assets/how-to-run.jpg)

![ext-setting](./assets/ext-setting.jpg)

### Supported events

+ For all supported event type, please visit [github_event.ts](./ts/github_event.ts) ( `wrapGithubLi()` function )
+ If there is an unknown event (see the icon's hover tip), please open an issue to contact me.

![HoverIcon](./assets/HoverIcon.jpg)

### Screenshot

![mainExt](./assets/mainExt.jpg)
![tokenSetting](./assets/tokenSetting.jpg)

### References

+ [activity events types](https://developer.github.com/v3/activity/events/types/)
+ [chrome-plugin-demo](https://github.com/sxei/chrome-plugin-demo)
+ [github-repo-size](https://github.com/harshjv/github-repo-size)
+ [chrome拡張をTypeScriptで開発するときのWebpackの設定](https://qiita.com/okumurakengo/items/1a4404c20b0bf10f2c68)
+ [JQueryUI resizable](https://jqueryui.com/resizable/)
