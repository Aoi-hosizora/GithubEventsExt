# GithubEventsExt

+ Let chrome show github users and repos activity events
+ Use [Github API V3](https://developer.github.com/v3/) to build this extension
+ TamperMonkey version see [Aoi-hosizora/GithubEvents_TamperMonkey](https://github.com/Aoi-hosizora/GithubEvents_TamperMonkey)

### Functions

+ [x] Show Repo Events
+ [x] Show User Events
+ [x] Show different title and url of different events
+ [x] Set token to access user private repos
+ [x] Error reminder
+ [ ] Faster resize
+ [ ] ...

### Run

```bash
git clone git@github.com:Aoi-hosizora/GithubEventsExt.git
cd GithubEventsExt/
npm install
npm run build # or npm run watch
```

+ Open Chrome Extension setting [chrome://extensions/](chrome://extensions/)
+ Click `Load unpacked` and open with the generated `/dist` folder

![how-to-run](./assets/how-to-run.jpg)

![ext-setting](./assets/ext-setting.jpg)

### Events

+ Support Event: see [github_event.ts](https://github.com/Aoi-hosizora/GithubEventsExt/blob/master/src/ts/github_event.ts) ( `wrapGithubLi()` )
+ If there is an unknown event, please open an issue.

![HoverIcon](./assets/HoverIcon.jpg)

### Tips

+ Svg path data all in [ui_event.ts](https://github.com/Aoi-hosizora/GithubEventsExt/blob/master/src/ts/ui_event.ts) ( `getSvgTag()` )
+ All elements class names start with `.ah-`
+ All elements id names start with `#ahid-`

### Screenshot

![mainExt](./assets/mainExt.jpg)
![tokenSetting](./assets/tokenSetting.jpg)

### References

+ [activity events types](https://developer.github.com/v3/activity/events/types/)
+ [chrome-plugin-demo](https://github.com/sxei/chrome-plugin-demo)
+ [github-repo-size](https://github.com/harshjv/github-repo-size)
+ [chrome拡張をTypeScriptで開発するときのWebpackの設定](https://qiita.com/okumurakengo/items/1a4404c20b0bf10f2c68)
+ [JQueryUI resizable](https://jqueryui.com/resizable/)
