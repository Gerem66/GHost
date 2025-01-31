let el_contentMain = document.getElementById('main');
let el_contentUpload = document.getElementById('content-upload');
let el_listFiles = document.getElementById('list-files');
let bt_download = document.getElementById('bt-download');
let in_password = document.getElementById('password');
let bt_unlock = document.getElementById('bt-unlock');
let el_popup = document.getElementById('popup');
let el_popupImage = document.getElementById('popup-img');
let el_popupVideo = document.getElementById('popup-video');

function ShowFiles(data) {
    el_listFiles.innerHTML = data;
    el_contentMain.classList.add('hidden');
    el_contentUpload.classList.add('hasFiles');
    bt_download.classList.add('active');
    in_password.classList.add('active');

    let previews_image = document.getElementsByClassName('preview-image');
    for (let i = 0; i < previews_image.length; i++) {
        let preview = previews_image[i];
        let src = preview.dataset.value;

        preview.addEventListener('click', () => {
            var x = 0, y = 0;
            var scale = 0.8;

            function ApplyTransform() {
                el_popupImage.style.transform = 'scale3d(' + scale + ',' + scale + ', 1) translate3d(' + x + 'px, ' + y + 'px, 0)';
            }

            ApplyTransform();
            el_popupImage.src = 'upload/' + dir + '/' + src;
            el_popupImage.onload = () => el_popup.classList.add('active');
            el_popup.onmousemove = (ev) => {
                // Move image
                if (scale > 1) {
                    x = -(ev.clientX - screen.width/2) / 2;
                    y = -(ev.clientY - screen.height/2) / 2;
                    ApplyTransform();
                }
            }
            el_popup.onwheel = (ev) => {
                let scroll = ev.deltaY > 0 ? -1 : 1;
                let newSize = scale + scroll / 10;
                newSize = Math.min(3, newSize);
                newSize = Math.max(0, newSize);
                scale = newSize;
                if (scale <= 1 && (x != 0 || y != 0)) {
                    x = 0;
                    y = 0;
                }
                ApplyTransform();
                if (newSize < 0.1) ClosePopup();
            }
        });
    }

    let previews_video = document.getElementsByClassName('preview-video');
    for (let i = 0; i < previews_video.length; i++) {
        let preview = previews_video[i];
        let src = preview.dataset.value;

        preview.addEventListener('click', () => {
            el_popupVideo.getElementsByTagName('source')[0].src = 'upload/' + dir + '/' + src;
            el_popup.classList.add('active');
        });
    }
}

function HideFiles() {
    el_listFiles.innerHTML = '';
    el_contentMain.classList.remove('hidden');
    el_contentUpload.classList.remove('hasFiles');
    bt_download.classList.remove('active');
    in_password.classList.remove('active');
}

function CheckPassword() {
    var form_data = new FormData();
    form_data.append('dir', dir);
    form_data.append('pwd', in_password.value);
    form_data.append('check', '1');

    UploadRequest('php/check_password.php', form_data, (data) => {
        if (data != '') ShowFiles(data);
        else HideFiles();
        loading = false;
        bt_unlock.disabled = false;
    });
}

function ClosePopup() {
    el_popup.onmousemove = null;
    el_popup.onwheel = null;
    el_popup.classList.remove('active');
}

function Button_Click() {
    if (!loading) {
        loading = true;
        bt_unlock.disabled = true;
        CheckPassword();
    }
}

function Password_Keypress(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        event.preventDefault();
        bt_unlock.click();
    }
}

var dir = window.location.pathname.split('/')[2];
var loading = false;
el_contentMain.classList.add('hidden');

bt_unlock.addEventListener('click', Button_Click);
in_password.addEventListener('keypress', Password_Keypress);
el_popup.addEventListener('click', ClosePopup);

CheckPassword();