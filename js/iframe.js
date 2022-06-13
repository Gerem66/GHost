// Page is in an iframe
window.onload = function (ev) {
    if (window.location === window.parent.location) {
        document.body.classList.add('active');
    }
}