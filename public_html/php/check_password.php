<?php

    function startsWith($string, $startString) {
        $len = strlen($startString);
        return substr($string, 0, $len) === $startString;
    }

    function endsWith($string, $endString) {
        $len = strlen($endString);
        return ($len == 0) || (substr($string, -$len) === $endString);
    }

    if (!(isset($_POST['dir']) && strlen($_POST['dir']) == 8) || !isset($_POST['pwd']) || !(isset($_POST['check']) && $_POST['check'] == '1')) {
        die('Wrong call');
        exit();
    }

    $dir = $_POST['dir'];
    $pwd = $_POST['pwd'];
    $hash = file_get_contents("../upload/$dir/GHost_$dir.link");
    if ($hash != '' && !password_verify($pwd, $hash)) {
        if ($pwd != '') sleep(3);
        return;
    }
    $files = scandir("../upload/$dir/");
    $content = '';
    $icons = [  'default' => 'file',
                'zip' => 'file-archive',
                'pdf' => 'file-pdf',
                'txt' => 'file-alt',
                // Images
                'png'  => 'file-image',
                'jpg'  => 'file-image',
                'jpeg' => 'file-image',
                // Video
                'avi'  => 'file-video',
                'mov'  => 'file-video',
                'mp4'  => 'file-video',
                'wmv'  => 'file-video',
                'flv'  => 'file-video',
                'mkv'  => 'file-video',
                'webm' => 'file-video',
                // Song
                'mp3' => 'file-audio',
                'wav' => 'file-audio',
                'ogg' => 'file-audio',
                'raw' => 'file-audio',
                // Microsoft Office Files
                'doc'  => 'file-word',
                'docx' => 'file-word',
                'dotx' => 'file-word',
                'dot'  => 'file-word',
                'pptx' => 'file-powerpoint',
                'pptm' => 'file-powerpoint',
                'ppt'  => 'file-powerpoint',
                'potx' => 'file-powerpoint',
                'ppsx' => 'file-powerpoint',
                'ppsm' => 'file-powerpoint',
                'pps'  => 'file-powerpoint',
                'xlsx' => 'file-excel',
                'xlsm' => 'file-excel',
                'xlsb' => 'file-excel',
                'xltx' => 'file-excel',
                'xltm' => 'file-excel',
                'xls'  => 'file-excel',
                'xlt'  => 'file-excel',
                'xlam' => 'file-excel',
                'xla'  => 'file-excel',
                'ods'  => 'file-excel',
                // Code
                'c'    => 'file-code',
                'cpp'  => 'file-code',
                'h'    => 'file-code',
                'cs'   => 'file-code',
                'js'   => 'file-code',
                'php'  => 'file-code',
                'py'   => 'file-code',
                'ads'  => 'file-code',
                'adb'  => 'file-code',
                'htm'  => 'file-code',
                'html' => 'file-code',
                'xml'  => 'file-code' ];
    foreach ($files as $file) {
        if ($file != '.' && $file != '..' && $file != "GHost_$dir.zip" && $file != "GHost_$dir.link") {
            // Set icon
            $exploded = explode('.', $file);
            $ext = end($exploded);
            $icon = $icons['default'];
            if ($icons[$ext] != '')
                $icon = $icons[$ext];

            // Images : redirect
            $link = '';
            $mime = mime_content_type("../upload/$dir/$file");
            if (startsWith($mime, "image/")) $link = " href='#' class='preview-image' data-value='$file'";
            else if (startsWith($mime, "video/")/* || endsWith($file, '.mp4')*/) $link = " href='#' class='preview-video' data-value='$file'";
            else if (startsWith($mime, "audio/")/* || endsWith($file, '.mp3')*/) $link = " href='#' class='preview-video' data-value='$file'";
            $content .= "<div class='file'>
                            <div class='download-name'>
                                <span title='$file'>$file</span>
                            </div>
                            <a$link>
                                <i class='fas fa-$icon download fa-lg'></i>
                            </a>
                        </div>";
        }
    }
    echo "$content";

?>