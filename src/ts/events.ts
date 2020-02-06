import $ from 'jquery';
import { Global, setStorage, StorageFlag } from './global';

export function registerEvent() {
    _regClick();
    _regMouse();

    navStatus(true);
}

function _regClick() {
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

    $('#ahid-toggle').click(() => {
        // closeNav(false);
    });

    $('#ahid-pin').click(() => {
        // isPin = !isPin;
        // setStorage('pin', isPin);
        // setPin(isPin);
        // isShow = isPin;
    });

    $('#ahid-feedback').click(() => {
        // window.open(feedback_url);
    });

    $('#ahid-refresh').click(() => {
        // $('#ahid-ul').html('');
        // refreshPadding();
        // page = 1;
        // firstFlag = true;
        // showLoading(true);
        // getDataAjax();
    });
}

function _regMouse() {
    $('#ahid-nav').mouseenter(_ => {
        Global.isHovering = true;
    });

    $('#ahid-nav').mouseleave(_ => {
        Global.isHovering = false;
        if (!Global.isPin) {
            setTimeout(() => {
                if (!Global.isHovering) {
                    navStatus(false);
                }
            }, 1000);
        }
    });

    $('#ahid-toggle').mouseenter(_ => {
        navStatus(true);
    });

    ////////////////////////////////////////

    // pin
    $('#ahid-pin').mouseenter(_ => {
        $('#ahid-pin').children('svg').children('path').attr("fill", "#fff");
    });

    $('#ahid-pin').mouseleave(_ => {
        if (!Global.isPin)
            $('#ahid-pin').children('svg').children('path').attr("fill", "#999");
        else
            $('#ahid-pin').children('svg').children('path').attr("fill", "#fff");
    });

    // feedback
    $('#ahid-feedback').mousemove(_ => {
        $('#ahid-feedback').children('svg').children('path').attr("fill", "#fff");
    });

    $('#ahid-feedback').mouseleave(_ => {
        $('#ahid-feedback').children('svg').children('path').attr("fill", "#999");
    });

    // refresh
    $('#ahid-refresh').mousemove(_ => {
        $('#ahid-refresh').children('svg').children('path').attr("fill", "#fff");
    });

    $('#ahid-refresh').mouseleave(_ => {
        $('#ahid-refresh').children('svg').children('path').attr("fill", "#999");
    });
}

function refreshPadding() {
    $('html').css("margin-right", Global.isPin ? Global.width : 0);
}

function navStatus(isShow: boolean) {
    const nav = $('#ahid-nav');
    const toggle = $('#ahid-toggle');
    const resize = $('#ahid-resize-handler');

    if (isShow) {
        nav.css("right", `0`);
        nav.addClass('ah-content-nav-open');
        toggle.addClass('ah-content-toggle-hide');
        resize.show();
    } else {
        nav.css("right", `-${Global.width}px`);
        toggle.removeClass('ah-content-toggle-hide');
        nav.removeClass('ah-content-nav-open');
        resize.hide();
    }
}

function bindResize() {
    const hnd = $('#ahid-resize-handler');
    const el = document.getElementById('ahid-nav')!!;
    const jel = $('#ahid-nav');

    $('#ahid-resize-handler').css("left", `calc(100% - ${Global.width - 2}px)`);

    let x = 0;
    let w = 0;

    hnd.mousedown(e => {
        x = e.clientX;
        w = el.offsetWidth;
        x += w;


        hnd.setCapture ? (
            hnd.setCapture(),
            hnd.mousemove(mouseMove),
            hnd.mouseup(mouseUp)
        ) : (
                $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
            );
        e.preventDefault();
    });

    function mouseMove(e: JQuery.MouseMoveEvent) {
        jel.width(x - e.clientX + 'px');
        refreshPadding();
        Global.width = jel.width()!!;
    }

    function mouseUp(e: JQuery.MouseUpEvent) {
        hnd.releaseCapture ? (
            hnd.releaseCapture(),
            hnd.mousemove(false),
            hnd.mouseup(false)
        ) : (
                $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
            );
        $('#ahid-resize-handler').css("left", `calc(100% - ${$('#ahid-nav').width()}px)`);
        setStorage(StorageFlag.Width, Global.width);
    }
}