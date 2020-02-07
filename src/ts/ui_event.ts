import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { handleGithubEvent, nextGithubEvent } from './github_event';
import { Global, setStorage, StorageFlag } from './global';

export function registerEvent() {
    _regToggle();
    _regClick();
    _regResizeEvent();

    navStatus(Global.isPin);
    setPin(Global.isPin);
}

export function showMessage(isError: boolean, message?: string) {
    const classFlag = 'ah-hint-hide';
    const ulTag = $('#ahid-ul');
    const messageTag = $('#ahid-message');
    const moreTag = $('#ahid-more');
    const retryTag = $('#ahid-retry');

    if (message || message === '') {
        ulTag.addClass(classFlag);
        messageTag.removeClass(classFlag);
        messageTag.text(message);
    } else {
        ulTag.removeClass(classFlag);
        messageTag.addClass(classFlag);
        messageTag.text('');
    }

    if (isError) {
        moreTag.addClass(classFlag);
        retryTag.removeClass(classFlag);
    } else {
        moreTag.removeClass(classFlag);
        retryTag.addClass(classFlag);
    }
}

function _regToggle() {
    $('#ahid-nav').mouseenter(() => {
        Global.isHovering = true;
    });
    $('#ahid-nav').mouseleave(() => {
        Global.isHovering = false;
        if (!Global.isPin) {
            setTimeout(() => {
                if (!Global.isPin && !Global.isHovering)
                    navStatus(false);
            }, 1000);
        }
    });

    $('#ahid-toggle').mouseenter(() => {
        navStatus(true);
    });
    $('#ahid-toggle').click(() => {
        navStatus(true);
    });
}

function _regClick() {
    $('#ahid-pin').click(() => {
        setPin(!Global.isPin);
    });

    $('#ahid-feedback').click(() => {
        window.open(Global.feedbackUrl);
    });

    $('#ahid-refresh').click(() => {
        adjustMain(false);
        $('#ahid-ul').html('');
        Global.page = 1;
        handleGithubEvent(Global.info);
    });

    $('#ahid-more').click(() => {
        nextGithubEvent(Global.info);
    });

    $('#ahid-retry').click(() => {
        $('#ahid-ul').html('');
        Global.page = 1;
        handleGithubEvent(Global.info);
    });
}

function navStatus(flag: boolean) {
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

function setPin(flag: boolean) {
    if (flag) {
        $('#ahid-nav').addClass('ah-shadow');
        $('#ahid-pin').addClass('ah-pined');
    } else {
        $('#ahid-nav').removeClass('ah-shadow');
        $('#ahid-pin').removeClass('ah-pined');
    }

    Global.isPin = flag;
    setStorage(StorageFlag.Pin, Global.isPin);
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
    if (Global.isPin) {
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

function _regResizeEvent() {
    const el = $('#ahid-nav');
    const hdr = $('.ui-resizable-handle');
    const event = () => {
        if (Global.width !== el.width()!!) {
            Global.width = el.width()!!;
            setStorage(StorageFlag.Width, Global.width);
        }
        adjustMain(false);
    };
    hdr.mouseup(event);
    el.mouseup(event);
    el.resize(() => { adjustMain(true); });
}
