document.addEventListener('DOMContentLoaded', () => {
    console.log("loading ext");

    injectJs();

    init();
    core();
})

function addCss() {
    var fontStyleTag = document.createElement("style");
    fontStyleTag.setAttribute('rel', 'stylesheet');
    // fontStyleTag.setAttribute('href', chrome.extension.getURL(''));
    fontStyleTag.setAttribute('href', "https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    document.head.appendChild(fontStyleTag);
}

function injectJs() {

    var divTag = document.createElement('div');
    divTag.className = 'content-toggle content-toggle-hide content-trans';
    divTag.id = 'id-toggle';
    divTag.innerHTML = `
    <svg width=10 height=14 viewBox="0 0 320 512">
        <path fill="#999999" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
    </svg>
    <span>Events</span>
    `;
    divTag.onload = () => this.parent.removeChild(this);

    var navTag = document.createElement('nav');
    navTag.className = 'content-nav content-trans';
    navTag.id = 'id-nav';
    navTag.innerHTML = `
    <div id="id-head">
        <a id="id-pin" href="javascript:void(0)">
            <svg width=9 height=14 viewBox="0 0 384 512">
                <path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"></path>
            </svg>
        </a>
        <a id="id-popup" href="javascript:void(0)">
            <svg width=14 height=14 viewBox="0 0 512 512">
                <path fill="#999" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
            </svg>
        </a>
        <div id="id-title">
            <span id="id-repo-icon"></span>
            <a id="id-title-user" class="content-a" href="javascript:void(0">Aoi-Hosizora</a> /
            <a id="id-title-repo" class="content-a" href="javascript:void(0)">Biji_Baibuti</a>
        </div>
        <div id="id-subtitle">
            <span>Events</span>
        </div>
    </div>

    <div id="id-tail">
        <div id="id-content"></div>

        <div id="id-foot">
            <div id="id-more-div">
                <a id="id-more-a" href="javascript:void(0)">More...</a>
            </div>
            <div id="id-loading-label">Loading...</div>
        </div>

        <div id="id-resize-handler"></div>
    </div>
    `;
    navTag.onload = () => this.parent.removeChild(this);
    document.body.append(divTag);
    document.body.append(navTag);
}

function init() {

        // url = "https://api.github.com/users/yoruko-km/events?page=";
        token = null;
        // url = "https://api.github.com/users/Aoi-hosizora/events?page=";
        url = "https://api.github.com/repos/angular/angular/events?page=";

        page = 1;
        isPin = true;
        firstFlag = true;
        gwidth = 280;

        // 容器
        var ulTag = document.createElement('ul');
        ulTag.id = "id-ul";
        ulTag.onload = () => this.parent.removeChild(ulTag);
        $('#id-content').append(ulTag);


        // Label
        showLoading(true);

        // pin
        setPin(isPin);

        // 展开
        if (isPin)
            closeNav(false);
        else {
            closeNav(true);
            setPin(isPin);
        }

        // Resize
        bindResize();
        refreshPadding();

        // title-icon
        $('#id-repo-icon').html(getSvgTag('CreateEvent', "#fff"));

        // 异步获取
        ajax(url, page, token, (events) => {
            addEvents(events);
            showLoading(false);
        }, () => {
            showLoading(false, true);
        });
}

function core() {
    regEvent();
}