<?php
    // Start output buffering to prevent early output
    ob_start();

    // Error handling function
    function handleDownloadError($message) {
        error_log($message);
        header('HTTP/1.1 404 Not Found');
        header('Location: ./error.html');
        exit();
    }

    // Validate input
    if (!isset($_GET['id']) || strlen($_GET['id']) != 8) {
        handleDownloadError("Invalid download ID");
    }

    $dir = $_GET['id'];
    $uploadDir = "upload/$dir/";

    // Check if upload directory exists
    if (!is_dir($uploadDir)) {
        handleDownloadError("Upload directory does not exist: $uploadDir");
    }

    // Download
    if (isset($_REQUEST['password'])) {
        $f = "GHost_$dir.zip";
        $file = $uploadDir . $f;
        $linkFile = $uploadDir . "GHost_$dir.link";

        // Verify password if link file exists
        if (file_exists($linkFile)) {
            $hash = file_get_contents($linkFile);
            $pwd = $_REQUEST['password'];
            
            if ($hash != '' && !password_verify($pwd, $hash)) {
                header("Location: ./$dir");
                exit();
            }
        }

        // Check file existence and readability
        if (!file_exists($file)) {
            handleDownloadError("File not found: $file");
        }

        if (!is_readable($file)) {
            handleDownloadError("File not readable: $file");
        }

        // Get file details
        $filetype = mime_content_type($file);
        $filename = basename($file);
        $filesize = filesize($file);

        // Clear any previous output
        ob_clean();

        // Send download headers
        header("Cache-Control: no-cache, must-revalidate");
        header("Content-Type: " . $filetype);
        header("Content-Length: " . $filesize);
        header("Content-Disposition: attachment; filename=\"$filename\"");
        
        // Output file
        readfile($file);
        exit();
    }
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Ghost</title>
        <meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Gérémy LECAPLAIN">
        <meta name="copyright" content="Gérémy LECAPLAIN" />
		<meta name="description" content="Service hébergement">
        <meta name="robots" content="noindex">
        <meta name="googlebot" content="noindex">
        
		<!-- Icons       --><link rel="icon" href="images/logo/sad-ghost.png">
        <!-- Style       --><link rel="stylesheet" href="css/style-download.css">
        <!-- Style anim  --><link rel="stylesheet" href="css/style-anim.css">
        <!-- Iframe mode --><script type="text/javascript" src="js/iframe.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
    <body>
        <form class="card" action="" method="POST">
            <header onclick="window.open('./', '_blank');">
                <p>
                    <i class="fas fa-cloud-upload-alt" aria-hidden="true"></i>
                    <span class="up">G</span>
                    <span class="load">Host</span>
                </p>
            </header>
            <div class="body hidden" id="main">
                <p>This repository is protected by a <b>password</b></p>
                <input id="password" name="password" type="password" placeholder="Password"></input>
                <button id="bt-unlock" class="active" type="button">Unlock</button>
            </div>
            <div id="content-upload">
                <div class="divider">
                    <span><AR>FILES</AR></span>
                </div>
                <div id="list-files">
                    <!--   template   -->
                </div>
                <button id="bt-download" type="submit">Download all files</button>
            </div>
        </form>

        <div id="popup">
            <img id="popup-img" src="" alt="" />
            <!--video id="popup-video" controls><source src="" type="video/mp4"></video-->
        </div>

        <script type="text/javascript" src="js/requests.js"></script>
        <script type="text/javascript" src="js/download.js"></script>
           
    </body>
</html>
