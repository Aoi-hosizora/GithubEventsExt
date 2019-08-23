/**
 * 注册事件处理
 */
function regEvent() {

    $('#id-toggle').click(() => {
        closeNav(false);
    });

    $('#id-pin').click(() => {
        isPin = !isPin;
        setPin(isPin);
        isShow = isPin;
    });

    $('#id-popup').click(() => {
        // TODO
        window.open('https://github.com/Aoi-hosizora/GithubEvents_ChromeExt');
    });

    window.onresize = () => {
        refreshPadding();
    };

    document.onloadend = () => {
        refreshPadding();
    }

    (() => {
        isShow = false;

        $('#id-nav').mouseleave((e) => {
            isShow = isPin;
            // TODO
            if (!isPin && !isShow) {
                setTimeout(() => {
                    if (!isShow)
                        closeNav(true);
                }, 1000);
            }
        });

        $('#id-nav').mouseenter((e) => {
            isShow = true;
        });

        $('#id-toggle').mouseenter((e) => {
            closeNav(false);
        });

        $('#id-pin').mouseenter((e) => {
            $('#id-pin').children('svg').children('path').attr("fill", "#fff");
        });

        $('#id-pin').mouseleave((e) => {
            if (!isPin)
                $('#id-pin').children('svg').children('path').attr("fill", "#999");
            else
                $('#id-pin').children('svg').children('path').attr("fill", "#fff");
        });

        $('#id-popup').mousemove((e) => {
            $('#id-popup').children('svg').children('path').attr("fill", "#fff");
        });

        $('#id-popup').mouseleave((e) => {
            $('#id-popup').children('svg').children('path').attr("fill", "#999");
        });


    })();

    /**
     * More... 处理
     */
    $('#id-more-a').click(() => {
        showLoading(true);

        ajax(url, ++page, token, (events) => {
            addEvents(events);
            showLoading(false, false);
        }, () => {
            showLoading(false, true);
        });
    });

}