function UploadRequest(url, data, callback) {
    let params = {
        method: 'POST',
        body: data
    };
    fetch(url, params)
        .then(res => {
            if (res.status != 200) {
                console.error('Invalid request');
                return;
            }
            return res.text();
        })
        .then(data => {
            if (typeof(callback) !== 'undefined')
                callback(data);
        })
        .catch(err => {
            console.error(err);
        });
}

function UploadRequestProgress(url, data, callback, callback_progress, retry = 3) {
    function OnLoad(ev) {
        if (typeof(callback) !== 'undefined')
            callback();
    }
    function OnProgress(ev) {
        let done = ev.position || ev.loaded, total = ev.totalSize || ev.total;
        pourcentage = Math.min(99, Math.floor(done/total*1000)/10);
        if (typeof(callback_progress) !== 'undefined')
            callback_progress(pourcentage);
    }
    function OnError(ev) {
        console.error(ev);

        // Retry / error page
        if (retry > 0) UploadRequestProgress(url, data, callback, callback_progress, retry - 1);
        else window.location.href = './error.html';
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', OnLoad, false);
    xhr.upload.addEventListener('progress', OnProgress, false);
    xhr.addEventListener('error', OnError, false);
    xhr.addEventListener('abort', OnError, false);

    xhr.open('POST', url, true);
    xhr.send(data);
}
/*
function UploadRequestProgress(url, data, callback, callback_progress) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('progress', function(e) {
        if (typeof(callback) !== 'undefined')
            callback();
    }, false);

    if (xhr.upload) {
        xhr.upload.onprogress = function(e) {
            let done = e.position || e.loaded, total = e.totalSize || e.total;
            pourcentage = Math.min(99, Math.floor(done/total*1000)/10);
            if (typeof(callback_progress) !== 'undefined')
                callback_progress(pourcentage);
        };
    }

    xhr.onerror = function(err) {
        console.error(err);
    }

    xhr.open('POST', url, true);
    xhr.send(data);
}*/