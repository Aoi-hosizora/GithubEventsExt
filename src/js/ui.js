/**
 * 获得 Event SVG
 * @param {*} type 
 * @param {*} color #fff
 * @param {*} rate 1
 * @param {*} className
 */
function getSvgTag(type, color = "", rate = 1, className = "") {
    let svgClass = '',
        svgPath = '';
    let svgHeight = 16,
        svgWidth = 12;

    switch (type) {
        case 'PushEvent':
            svgClass = "octicon-repo-push";
            svgPath = 'M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z';
            break;
        case 'CreateEvent':
            svgClass = "octicon-repo";
            svgPath = "M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z";
            break;
        case 'CreateBranchEvent':
            svgClass = "octicon-git-branch";
            svgWidth = 10;
            svgPath = "M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
            break;
        case 'CreateTagEvent':
        case 'ReleaseEvent':
            svgClass = "octicon-tag";
            svgWidth = 14;
            svgPath = "M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z";
            break;
        case 'WatchEvent':
            svgClass = "octicon-star";
            svgWidth = 14;
            svgPath = "M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z";
            break;
        case 'MemberEvent':
            svgClass = "octicon-organization";
            svgWidth = 16;
            svgPath = "M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z";
            break;
        case 'IssuesEvent':
            svgClass = "octicon-issue-opened";
            svgWidth = 14;
            svgPath = "M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z";
            break;
        case 'IssueCommentEvent':
        case 'CommitCommentEvent':
            svgClass = "octicon-comment";
            svgWidth = 16;
            svgPath = "M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z";
            break;
        case 'ForkEvent':
            svgClass = "octicon-repo-forked";
            svgWidth = 10;
            svgPath = "M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
            break;
        case 'PullRequestEvent':
            svgClass = "octicon-git-pull-request";
            svgPath = "M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z";
            break;
        case 'PullRequestReviewCommentEvent':
            svgClass = "octicon-eye";
            svgWidth = 16;
            svgPath = "M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z";
            break;
        case 'DeleteEvent':
            svgClass = "octicon-x";
            svgPath = "M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z";
            break;
        case 'PublicEvent':
            svgClass = "octicon-lock";
            svgPath = "M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z";
            break;
        case 'GollumEvent': 
            svgClass = "octicon-book";
            svgWidth = 16;
            svgPath = "M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z";
            break;

            //////////////////////////////////////////////////////
            // Not For Event

        case 'People': // For #ahid-user-icon
            svgClass = "octicon-perple";
            svgPath = "M12 14.002a.998.998 0 0 1-.998.998H1.001A1 1 0 0 1 0 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z";
            break;

        case 'Graph': // For #ahid-event-icon
            svgClass = "octicon-graph";
            svgWidth = 16;
            svgPath = "M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z";
            break;
    }

    let width = svgWidth,
        height = svgHeight;

    if (rate < 1) {
        width = Math.floor(width * rate);
        height = Math.floor(height * rate);
    }

    if (className)
        svgClass = className;
    else
        svgClass = `octicon ${svgClass}`;

    let svg = `
                <svg class="${svgClass}" 
                    version="1.1" aria-hidden="true"
                    width="${width}" height="${height}" viewBox="0 0 ${svgWidth} ${svgHeight}">
                    
                    <path class="octicon-path" fill-rule="evenodd" d="${svgPath}" ${color ? `fill="${color}"` : ""}></path>
                </svg>
            `
    return svg;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 显示 Loading / More
 * @param {*} isLoading 
 * @param {*} isError -> `Something error happened, try again...`
 */
function showLoading(isLoading, isError = false) {
    if (isLoading) {
        $('#ahid-more-div').hide();
        $('#ahid-loading-label').show();
    } else {
        $('#ahid-more-a').text(
            isError ? "Something error happened, try again..." : "More..."
        )
        $('#ahid-loading-label').hide();
        $('#ahid-more-div').show();
    }
}

/**
 * 关闭 右侧栏
 * @param {*} closeFlag 
 */
function closeNav(closeFlag) {
    $('#ahid-nav').width(gwidth);
    refreshPadding();

    var nav = $('.ah-content-nav').first();
    var toggle = $('.ah-content-toggle').first();

    if (closeFlag) {
        $('#ahid-nav').css("right", `-${gwidth}px`);
        nav.removeClass('ah-content-nav-open');
        toggle.removeClass('ah-content-toggle-hide');
        $('#ahid-resize-handler').hide();
    } else {
        $('#ahid-nav').css("right", `0`);
        toggle.addClass('ah-content-toggle-hide');
        nav.addClass('ah-content-nav-open');
        $('#ahid-resize-handler').show();
    }
}

/**
 * 设置 置顶
 * @param {*} isPin
 */
function setPin(isPin) {
    if (isPin) {
        $('#ahid-pin').children('svg').css("transform", "");
        $('#ahid-nav').addClass('ah-content-nav-shadow');
        $('#ahid-pin').children('svg').children('path').attr("fill", "#fff");
    } else {
        $('#ahid-pin').children('svg').css("transform", "rotate(45deg)");
        $('#ahid-nav').removeClass('ah-content-nav-shadow');
        $('#ahid-pin').children('svg').children('path').attr("fill", "#999");
    }
    refreshPadding();
}

/**
 * 刷新页面显示
 */
function refreshPadding() {
    // $('header').removeClass('p-responsive');
    $('html').css("margin-right", isPin ? gwidth : 0);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 拖动修改大小
 * 代码待改
 */
function bindResize() {
    var hnd = document.getElementById('ahid-resize-handler');
    var el = document.getElementById('ahid-nav');
    var jel = $('#ahid-nav');

    $('#ahid-resize-handler').css("left", `calc(100% - ${gwidth - 2}px)`);

    var x = 0,
        w = 0;

    $(hnd).mousedown((e) => {
        x = e.clientX;
        w = el.offsetWidth;

        x += w

        // TODO
        hnd.setCapture ? (
            hnd.setCapture(),
            hnd.onmousemove = (ev) => {
                // mouseMove(ev || event);
                mouseMove(ev);
            },
            hnd.onmouseup = mouseUp
        ) : (
            $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
        );
        e.preventDefault();
    })

    function mouseMove(e) {
        jel.width(x - e.clientX + 'px');
        refreshPadding();
        gwidth = jel.width();
    }

    function mouseUp(e) {
        hnd.releaseCapture ? (
            hnd.releaseCapture(),
            hnd.onmousemove = hnd.onmouseup = null
        ) : (
            $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
        )
        mouseMove(e);
        $('#ahid-resize-handler').css("left", `calc(100% - ${$('#ahid-nav').width()}px)`);

        setStorage('gwidth', gwidth);
    }
}