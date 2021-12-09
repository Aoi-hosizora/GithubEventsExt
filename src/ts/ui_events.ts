import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { Global, setStorage, StorageFlag } from './global';
import { RepoInfo } from './model';
import { formatInfoToLi } from './sidebar_ui';
import { requestGithubEvents } from './util';

// ===============
// request related
// ===============

/**
 * Start loading the specific page of github events !!!
 */
export async function loadGithubEvents() {
    showMessage('Loading...');
    var infos: RepoInfo[];
    try {
        infos = await requestGithubEvents(Global.urlInfo, Global.token, Global.page);
    } catch (ex) {
        if (Global.page === 1) {
            showMessage(ex as string, true);
        }
        return;
    }

    showMessage('');
    const ul = $('#ahid-ul');
    infos.forEach(info => {
        const li = formatInfoToLi(info);
        if (!li) {
            return;
        }
        if (ul.text().trim()) {
            ul.append('<hr class="ah-hr" />');
        }
        const content = li
            .replaceAll('\n', '')
            .replaceAll('  ', ' ')
            .replaceAll(' </a>', '</a>') // <a "xxx"> xxx </a>
            .replaceAll('"> ', '">');
        ul.append(content);
    });
}

/**
 * Start loading next page of github events.
 */
async function loadNextGithubEvents() {
    ++Global.page;
    await loadGithubEvents();
}

/**
 * Show normal message in (#ahid-message) or error message in (#ahid-more).
 */
function showMessage(message: string, isError: boolean = false) {
    const hideClass = 'ah-hint-hide';
    const disableClass = 'ah-a-disabled';

    const ulTag = $('#ahid-ul');
    const messageTag = $('#ahid-message');
    const moreTag = $('#ahid-more');
    const retryTag = $('#ahid-retry');

    if (isError) {
        moreTag.addClass(hideClass);
        retryTag.removeClass(hideClass);
        ulTag.addClass(hideClass);
        messageTag.removeClass(hideClass);

        messageTag.text(message!!);
    } else {
        moreTag.removeClass(hideClass);
        retryTag.addClass(hideClass);
        ulTag.removeClass(hideClass);
        messageTag.addClass(hideClass);

        if (message && message !== '') {
            moreTag.text(message);
            moreTag.addClass(disableClass);
        } else {
            moreTag.text('More...');
            moreTag.removeClass(disableClass);
        }
    }
}

// =================
// ui events related
// =================

/**
 * Register sidebar's UI events !!!
 */
export function registerUIEvents() {
    registerToggleEvents();
    registerButtonsEvents();
    registerResizeEvent();

    setNavStatus(Global.pinned);
    SetPinState(Global.pinned);
}

function registerToggleEvents() {
    $('#ahid-nav').mouseenter(() => {
        Global.isHovering = true;
    });
    $('#ahid-nav').mouseleave(() => {
        Global.isHovering = false;
        if (!Global.pinned) {
            setTimeout(() => {
                if (!Global.pinned && !Global.isHovering)
                    setNavStatus(false);
            }, 1000);
        }
    });

    $('#ahid-toggle').mouseenter(() => {
        setNavStatus(true);
    });
    $('#ahid-toggle').click(() => {
        setNavStatus(true);
    });
}

function registerButtonsEvents() {
    $('#ahid-pin').click(() => {
        SetPinState(!Global.pinned);
    });

    $('#ahid-feedback').click(() => {
        window.open(Global.feedbackURL);
    });

    $('#ahid-refresh').click(() => {
        adjustMain(false);
        $('#ahid-ul').html('');
        Global.page = 1;
        loadGithubEvents();
    });

    $('#ahid-more').click(() => {
        loadNextGithubEvents();
    });

    $('#ahid-retry').click(() => {
        $('#ahid-ul').html('');
        Global.page = 1;
        loadGithubEvents();
    });
}

function setNavStatus(flag: boolean) {
    const nav = $('#ahid-nav');
    const toggle = $('#ahid-toggle');
    nav.css('width', `${Global.width}px`);

    if (flag) {
        toggle.addClass('ah-hide');
        nav.addClass('ah-open');
        nav.css('right', '');
        bindResize(true);
    } else {
        toggle.removeClass('ah-hide');
        nav.removeClass('ah-open');
        nav.css('right', `-${Global.width}px`);
        bindResize(false);
    }
}

function SetPinState(flag: boolean) {
    if (flag) {
        $('#ahid-nav').addClass('ah-shadow');
        $('#ahid-pin').addClass('ah-pined');
    } else {
        $('#ahid-nav').removeClass('ah-shadow');
        $('#ahid-pin').removeClass('ah-pined');
    }

    Global.pinned = flag;
    setStorage(StorageFlag.PINNED, Global.pinned);
    adjustMain(false);
}

/**
 * pin & load & resize
 * @param useElWidth true only el.resize
 */
function adjustMain(useElWidth: boolean) {
    const nav = $('#ahid-nav');
    if (nav.css('left') !== '') {
        nav.css('left', '');
    }

    if (Global.pinned) {
        let to: number = Global.width;
        if (useElWidth) {
            to = nav.width()!!;
        }
        $('body').css('margin-right', `${to}px`);
    } else {
        $('body').css('margin-right', '');
    }
}

function bindResize(flag: boolean) {
    $(() => {
        const el = $('#ahid-nav');
        if (flag) {
            el.resizable({
                disabled: false,
                handles: 'w',
                minWidth: parseInt(el.css('min-width'), 10),
                maxWidth: parseInt(el.css('max-width'), 10)
            });
        } else {
            el.resizable({
                disabled: true
            });
        }
    });
}

function registerResizeEvent() {
    const el = $('#ahid-nav');
    const hdr = $('.ui-resizable-handle');
    const event = () => {
        if (Global.width !== el.width()!!) {
            Global.width = el.width()!!;
            setStorage(StorageFlag.WIDTH, Global.width);
        }
        adjustMain(false);
    };
    hdr.mouseup(event);
    el.mouseup(event);
    el.resize(() => { adjustMain(true); });
}
