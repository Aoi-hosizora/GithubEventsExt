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
    $('#ahid-more-a').click(() => {
        showLoading(true);

        ajax(url, ++page, token, (events) => {
            addEvents(events);
            showLoading(false, false);
        }, () => {
            showLoading(false, true);
        });
    });

    // 展开
    $('#ahid-toggle').click(() => {
        closeNav(false);
    });

    // 置顶
    $('#ahid-pin').click(() => {
        isPin = !isPin;
        setPin(isPin);
        isShow = isPin;
    });

    // 反馈
    $('#ahid-feedback').click(() => {
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
    $('#ahid-nav').mouseleave((e) => {
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
    $('#ahid-nav').mouseenter((e) => {
        isShow = true;
    });

    // 移入
    $('#ahid-toggle').mouseenter((e) => {
        closeNav(false);
    });

    ////////////////////////////////////////

    // 置顶高亮
    $('#ahid-pin').mouseenter((e) => {
        $('#ahid-pin').children('svg').children('path').attr("fill", "#fff");
    });

    $('#ahid-pin').mouseleave((e) => {
        if (!isPin)
            $('#ahid-pin').children('svg').children('path').attr("fill", "#999");
        else
            $('#ahid-pin').children('svg').children('path').attr("fill", "#fff");
    });

    // 反馈高亮
    $('#ahid-feedback').mousemove((e) => {
        $('#ahid-feedback').children('svg').children('path').attr("fill", "#fff");
    });

    $('#ahid-feedback').mouseleave((e) => {
        $('#ahid-feedback').children('svg').children('path').attr("fill", "#999");
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