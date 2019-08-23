/**
 * 注册事件处理
 */
function regEvent() {

    _regClick();
    _regMouse();
    _regRefresh();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 点击事件
 */
function _regClick() {

    // More 处理
    $('#id-more-a').click(() => {
        showLoading(true);

        ajax(url, ++page, token, (events) => {
            addEvents(events);
            showLoading(false, false);
        }, () => {
            showLoading(false, true);
        });
    });

    // 展开
    $('#id-toggle').click(() => {
        closeNav(false);
    });

    // 置顶
    $('#id-pin').click(() => {
        isPin = !isPin;
        setPin(isPin);
        isShow = isPin;
    });

    // 反馈
    $('#id-feedback').click(() => {
        // TODO
        window.open(feedback_url)
    });
}

/**
 * 鼠标事件
 */
function _regMouse() {
    isShow = false;

    // 移出
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

    // 移入
    $('#id-nav').mouseenter((e) => {
        isShow = true;
    });

    // 移入
    $('#id-toggle').mouseenter((e) => {
        closeNav(false);
    });

    ////////////////////////////////////////

    // 置顶高亮
    $('#id-pin').mouseenter((e) => {
        $('#id-pin').children('svg').children('path').attr("fill", "#fff");
    });

    $('#id-pin').mouseleave((e) => {
        if (!isPin)
            $('#id-pin').children('svg').children('path').attr("fill", "#999");
        else
            $('#id-pin').children('svg').children('path').attr("fill", "#fff");
    });

    // 反馈高亮
    $('#id-feedback').mousemove((e) => {
        $('#id-feedback').children('svg').children('path').attr("fill", "#fff");
    });

    $('#id-feedback').mouseleave((e) => {
        $('#id-feedback').children('svg').children('path').attr("fill", "#999");
    });
}

/**
 * 布局刷新事件
 */
function _regRefresh() {
    
    window.onresize = () => {
        refreshPadding();
    };

    document.onloadend = () => {
        refreshPadding();
    }
}