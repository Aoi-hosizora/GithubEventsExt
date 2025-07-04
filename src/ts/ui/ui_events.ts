import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { askToSetupToken, Global, StorageFlag } from '@src/ts/data/global';
import { EventInfo } from '@src/ts/data/model';
import { formatInfoToLiTag } from '@src/ts/ui/sidebar/li_tag';
import { requestGitHubEvents, checkURL } from '@src/ts/utils/utils';
import { injectSidebar } from '@src/ts/main';
import { getStorage, setStorage } from '@src/ts/data/storage';
import { adjustMenuLayout } from '@src/ts/ui/github/global_ui';

// ===============
// request related
// ===============

/**
 * Start loading the specific page of GitHub events !!!
 */
export async function loadGitHubEvents() {
    const ulTag = $('#ahid-list');
    if (Global.page === 1) {
        Global.total = 0;
        ulTag.html('');
    }

    // loading
    switchDisplayMode({ isLoading: true, isError: false });
    var infos: EventInfo[];
    try {
        Global.lastTotal = 0;
        infos = await requestGitHubEvents(Global.urlInfo.eventAPI, Global.page, Global.token);
        Global.lastTotal = infos.length;
        Global.total += infos.length;
    } catch (ex) {
        if (Global.page === 1) {
            switchDisplayMode({ isLoading: false, isError: true, errorMessage: ex as string });
        }
        return;
    } finally {
        updatePageHint();
    }
    if (Global.page === 1 && infos.length == 0) {
        switchDisplayMode({ isLoading: false, isError: true, errorMessage: "Nothing found." });
        return;
    }

    // data got
    switchDisplayMode({ isLoading: false, isError: false });
    infos.forEach(info => {
        const li = formatInfoToLiTag(info);
        if (!li) {
            return;
        }
        if (ulTag[0].children.length) {
            ulTag.append('<hr class="ah-hr" />');
        }
        ulTag.append(li);
    });
    if (!Global.useBlankTarget) {
        $('nav#ahid-nav a[target="_blank"]').removeAttr('target');
    }
}

/**
 * Start loading next page of GitHub events.
 */
async function loadNextGitHubEvents() {
    if (Global.lastTotal > 0) {
        // only when last query result is not empty, go to the next page.
        ++Global.page;
    }
    await loadGitHubEvents();
}

/**
 * Switch display mode, such as "Loading..." or "Mode..." or "Something error".
 */
function switchDisplayMode(arg: { isLoading: boolean, isError: boolean, errorMessage?: string }) {
    const messageTag = $('#ahid-message'), ulTag = $('#ahid-list'),
        moreTag = $('#ahid-more'), loadingTag = $('#ahid-loading'), retryTag = $('#ahid-retry');

    const hide = (tag: JQuery<HTMLElement>) => tag.addClass('ah-body-hide');
    const show = (tag: JQuery<HTMLElement>) => tag.removeClass('ah-body-hide');
    if (arg.isLoading) {
        hide(messageTag);
        hide(moreTag);
        hide(retryTag);
        show(ulTag);
        show(loadingTag);
    } else if (arg.isError) {
        hide(ulTag);
        hide(moreTag);
        hide(loadingTag);
        messageTag.text(arg.errorMessage ?? 'Something error.');
        show(messageTag);
        show(retryTag);
    } else {
        hide(messageTag);
        hide(loadingTag);
        hide(retryTag);
        show(ulTag);
        show(moreTag);
    }
}

/**
 * Update pagination button tooltip.
 */
function updatePageHint() {
    const moreTag = $('#ahid-more'), retryTag = $('#ahid-retry');
    const hint = `Current page: ${Global.page}, event count: ${Global.total}`;
    moreTag.attr('title', hint);
    retryTag.attr('title', hint);
}

// =================
// UI events related
// =================

/**
 * Register sidebar's UI events !!!
 */
export function registerUIEvents(extraRefreshHandler?: () => void) {
    // toggle and nav (sidebar) events
    $('#ahid-toggle').on('mouseenter', () => showSidebar(true));
    $('#ahid-toggle').on('click', () => showSidebar(true));
    $('#ahid-nav').on('mouseenter', () => Global.isHovering = true);
    $('#ahid-nav').on('mouseleave', () => {
        Global.isHovering = false;
        if (!Global.pinned) {
            setTimeout(() => (!Global.pinned && !Global.isHovering) ? showSidebar(false) : null, 1000);
        }
    });

    // buttons events
    $('#ahid-pin').on('click', () => pinSidebar(!Global.pinned));
    $('#ahid-refresh').on('click', () => refreshSidebar(extraRefreshHandler));
    $('#ahid-more').on('click', () => loadNextGitHubEvents());
    $('#ahid-retry').on('click', () => { Global.page = 1; loadGitHubEvents(); });

    // process menu items' UI and event
    $('#ahid-setup-token').on('click', () => setTimeout(() => askToSetupToken(), 30));
    processMenuSwitchers();

    // resize events
    registerResizeEvent();

    // set sidebar status
    showSidebar(Global.pinned);
    pinSidebar(Global.pinned);
}

/**
 * Show the sidebar needShow flag is true, otherwise hide the sidebar.
 */
function showSidebar(needShow: boolean) {
    const navTag = $('#ahid-nav');
    const toggleTag = $('#ahid-toggle');
    navTag.css('width', `${Global.width}px`);
    if (needShow) {
        toggleTag.addClass('ah-toggle-hide');
        navTag.addClass('ah-nav-open');
        navTag.css('right', '');
        enableResizing(true);
    } else {
        toggleTag.removeClass('ah-toggle-hide');
        navTag.removeClass('ah-nav-open');
        navTag.css('right', `-${Global.width}px`);
        enableResizing(false);
    }
}

/**
 * Pin the sidebar needPin flag is true, otherwise hide the sidebar.
 */
function pinSidebar(needPin: boolean) {
    const navTag = $('#ahid-nav');
    const pinTag = $('#ahid-pin');
    if (needPin) {
        navTag.addClass('ah-shadow');
        pinTag.addClass('ah-pined');
        pinTag.attr('title', 'To unpin');
    } else {
        navTag.removeClass('ah-shadow');
        pinTag.removeClass('ah-pined');
        pinTag.attr('title', 'To pin');
    }
    Global.pinned = needPin;
    setStorage(StorageFlag.PINNED, Global.pinned); // also update Global
    adjustBodyLayout();
}

/**
 * Refresh layout and content of sidebar.
 */
function refreshSidebar(extraRefreshHandler?: () => void) {
    // refresh sidebar layout
    adjustBodyLayout();

    // call extra handler
    extraRefreshHandler?.();

    // check page url
    var oldUrlInfo = Global.urlInfo;
    const urlInfo = checkURL();
    if (urlInfo) {
        Global.urlInfo = urlInfo;
    }

    // re-inject sidebar, or reload events
    if (!Global.urlInfo.equals(oldUrlInfo)) {
        injectSidebar();
    } else {
        Global.page = 1;
        loadGitHubEvents();
    }
}

/**
 * Update the UI of menu switcher items, and register its click events.
 */
function processMenuSwitchers() {
    async function updateUIAndRegisterEvent(el: JQuery<HTMLElement>, flag: StorageFlag) {
        if (!el.hasClass('ah-checkable')) {
            return; // unreachable
        }
        // update ui
        if (await getStorage<boolean>(flag, true)) { // do not query from Global
            el.addClass('ah-enabled');
        } else {
            el.removeClass('ah-enabled');
        }
        // register event
        el.on('click', () => setTimeout(async () => {
            if (await getStorage<boolean>(flag, true)) { // do not query from Global
                await setStorage(flag, false); // do not update Global
                el.removeClass('ah-enabled');
            } else {
                await setStorage(flag, true); // do not update Global
                el.addClass('ah-enabled');
            }
            if (!Global.hideAttentionToast) {
                showHeaderToast("Setting changed, refresh the page to apply the change!", 3000);
            }
        }, 30));
    }

    updateUIAndRegisterEvent($('#ahid-setup-follow-menu'), StorageFlag.SHOW_FOLLOW_MENU_ITEM);
    updateUIAndRegisterEvent($('#ahid-setup-blank-target'), StorageFlag.USE_BLANK_TARGET);
    updateUIAndRegisterEvent($('#ahid-setup-old-icon'), StorageFlag.USE_OLD_ICON);
    updateUIAndRegisterEvent($('#ahid-show-full-event-datetime'), StorageFlag.SHOW_FULL_EVENT_DATETIME);
    updateUIAndRegisterEvent($('#ahid-show-full-event-tooltip'), StorageFlag.SHOW_FULL_EVENT_TOOLTIP);
    //
    updateUIAndRegisterEvent($('#ahid-setup-center-follow'), StorageFlag.CENTER_FOLLOW_TEXT);
    updateUIAndRegisterEvent($('#ahid-setup-joined-time'), StorageFlag.SHOW_JOINED_TIME);
    updateUIAndRegisterEvent($('#ahid-setup-user-counter'), StorageFlag.SHOW_USER_PRIVATE_COUNTER);
    updateUIAndRegisterEvent($('#ahid-setup-org-joined-time'), StorageFlag.SHOW_ORG_JOINED_TIME);
    updateUIAndRegisterEvent($('#ahid-setup-org-counter'), StorageFlag.SHOW_ORG_PRIVATE_COUNTER);
    //
    updateUIAndRegisterEvent($('#ahid-setup-repo-counter'), StorageFlag.SHOW_REPO_ACTION_COUNTER);
    updateUIAndRegisterEvent($('#ahid-setup-repo-size'), StorageFlag.SHOW_REPO_AND_CONTENTS_SIZE);
    //
    updateUIAndRegisterEvent($('#ahid-setup-hide-toast'), StorageFlag.HIDE_ATTENTION_TOAST);
}

/**
 * Show header toast with given content and show duration.
 */
function showHeaderToast(content: string, duration: number) {
    hideHeaderToast();
    const toast = $(`
        <div id="ahid-header-toast" class="ah-animated">
            ${content}
            <div id="ahid-header-toast-x" class="ah-unselectable">
                x
            </div>
        </div>
    `);
    toast.css('opacity', 0.0);

    const header = $('header#ahid-header');
    if (header.length) {
        toast.insertBefore(header);

        setTimeout(() => {
            toast.css('opacity', 0.85);
            const div = $('div#ahid-header-toast');
            const x = $('div#ahid-header-toast-x');
            if (div.length) {
                div.on('click', () => hideHeaderToast());
            }
            if (x.length) {
                x.on('click', () => hideHeaderToast());
            }
            setTimeout(() => hideHeaderToast(), duration);
        }, 30);
    }
}

/**
 * Hide header toast if shown.
 */
function hideHeaderToast() {
    const toast = $('div#ahid-header-toast');
    if (toast.length) {
        toast.css('opacity', 0.0);
        setTimeout(() => toast[0].remove(), 300);
    }
}

// =========================
// resize and adjust related
// =========================

/**
 * Adjust body's layout (margin-right), used when pin/refresh button is clicked or user is resizing.
 */
export function adjustBodyLayout(resizing: boolean = false) {
    const navTag = $('#ahid-nav');
    navTag.css('left', '');
    if (Global.pinned) {
        const to = resizing ? navTag.width()! : Global.width;
        $('body').css('margin-right', `${to}px`);
    } else {
        $('body').css('margin-right', '');
    }
    adjustMenuLayout(); // for menu margin-right
}

/**
 * Reset body's layout (margin-right), used when open a no-sidebar page.
 */
export function resetBodyLayout() {
    $('body').css('margin-right', '');
}

/**
 * Register resize event.
 */
function registerResizeEvent() {
    const navTag = $('#ahid-nav');
    const hdlTag = $('.ui-resizable-handle');
    const event = () => {
        if (Global.width !== navTag.width()!) {
            Global.width = navTag.width()!;
            setStorage(StorageFlag.WIDTH, Global.width); // also update Global
        }
        adjustBodyLayout(false);
    };

    navTag.on('resize', () => adjustBodyLayout(true));
    navTag.on('mouseup', event);
    hdlTag.on('mouseup', event);
}

/**
 * Enable resizing if flag set to true, otherwise disable resizing.
 */
function enableResizing(enable: boolean) {
    $(() => {
        const navTag = $('#ahid-nav');
        if (enable) {
            navTag.resizable({
                disabled: false,
                handles: 'w',
                minWidth: parseInt(navTag.css('min-width'), 10),
                maxWidth: parseInt(navTag.css('max-width'), 10)
            });
        } else {
            navTag.resizable({
                disabled: true
            });
        }
    });
}
