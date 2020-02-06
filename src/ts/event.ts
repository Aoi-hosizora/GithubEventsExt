import $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';
import { Global, setStorage, StorageFlag } from './global';

export function registerEvent() {
    _regToggle();
    _regClick();

    setPin(Global.isPin);
    if (Global.isPin === false) {
        navStatus(false);
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
                if (!Global.isHovering)
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

    if (flag) {
        nav.addClass('ah-open');
        toggle.addClass('ah-hide');
        nav.css('right', `0`);
        bindResize(true);
    } else {
        nav.removeClass('ah-open');
        toggle.removeClass('ah-hide');
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
}

function bindResize(flag: boolean) {
    const el = $('#ahid-nav');
    if (flag) {
        el.resizable({
            handles: 'w'
        });
    } else {
        el.resizable({
            disabled: true
        });
    }
    el.mouseup(_ => {
        Global.width = el.width()!!;
        setStorage(StorageFlag.Width, Global.width);
    });
}
