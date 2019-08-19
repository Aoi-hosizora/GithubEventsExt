document.addEventListener('DOMContentLoaded', function() {
    console.log("loading ext");
    injectJs();
})

/**
 * 注入 Js 代码，修改 DOM
 */
function injectJs() {
    var eventTag = document.createElement('div');
    eventTag.className = 'my-github-events';
    eventTag.innerHTML = `
    <h1>Test</h1>
    `;
    eventTag.onload = () => this.parent.removeChild(this);
    document.body.appendChild(eventTag);
}