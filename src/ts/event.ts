import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { Global, setStorage, StorageFlag } from './global';

export function registerEvent() {
    _regToggle();
    _regClick();
    _regResizeEvent();

    navStatus(Global.isPin);
    setPin(Global.isPin);
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
        // $('#ahid-ul').html('');
        // refreshPadding();
        // page = 1;
        // firstFlag = true;
        // showLoading(true);
        // getDataAjax();
    });

    $('#ahid-more-a').click(() => {
        // $('#ahid-nothing').html("");
        // showLoading(true);
        // ajax(url, ++page, token, (events) => {
        //     addEvents(events);
        //     checkNothing();
        //     showLoading(false, false);
        // }, () => {
        //     showLoading(false, true);
        // });
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
                minWidth: 150,
                maxWidth: 500
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
