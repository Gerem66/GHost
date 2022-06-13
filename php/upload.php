<?php

    function startsWith($string, $startString) {
        $len = strlen($startString);
        return substr($string, 0, $len) === $startString;
    }

    // Upload file
    if (isset($_POST["dir"]) && $_FILES["file"]["name"] != '')
    {
        sleep(2);
        $dir = $_POST["dir"];
        $name = $_FILES["file"]["name"];
        mkdir("../upload/$dir");
        $location = "../upload/$dir/$name";
        move_uploaded_file($_FILES["file"]["tmp_name"], $location);
    }

    // Make Zip FIle
    if (isset($_POST['dir']) && isset($_POST['zip']) && $_POST['zip'] == '1')
    {
        $dir = $_POST["dir"];
        $files = scandir("../upload/$dir/");
        $zip_name = "../upload/$dir/GHost_$dir.zip";
        $zip_exists = file_exists($zip_name);
        if (!$zip_exists) {
            $zip = new ZipArchive;
            if ($zip->open($zip_name, ZipArchive::CREATE) === TRUE) {
                // Put into ZIP
                foreach ($files as $file)
                if ($file != '.' && $file != '..')
                $zip->addFile("../upload/$dir/$file", "GHost_$dir/$file");
                $zip->close();

                // Empty files except images
                foreach ($files as $file) {
                    if ($file != '.' && $file != '..' && $file != "GHost_$dir.zip") {
                        $mime = mime_content_type("../upload/$dir/$file");
                        if (!startsWith($mime, "image/")) {
                            $f = fopen("../upload/$dir/$file", 'r+');
                            ftruncate($f, 0);
                            fclose($f);
                        }
                    }
                }
            }
        }
    }

    // Generate Link
    if (isset($_POST['dir']) && isset($_POST['generate']) && $_POST['generate'] == '1' && isset($_POST['password']))
    {
        $dir = $_POST["dir"];
        $temp_file = "../upload/$dir/GHost_$dir.link";
        if (!file_exists($temp_file))
            file_put_contents($temp_file, isset($_POST['password']) ? password_hash($_POST['password'],  PASSWORD_BCRYPT) : '');
        
        // Add Password to Zip file

        /*if (isset($_POST['password']) && $_POST['password'] != '')
        {
            $zip_dir  = "../upload/$dir/";
            $zip_name = "../upload/$dir/GHost_$dir.zip";
            $zip = new ZipArchive;
            $zip->open($zip_name);
            foreach (scandir($zip_dir) as $file) {
                if ($file != '.' && $file != '..' && $file != "GHost_$dir.zip" && $file != "GHost_$dir.link") {
                    $zip->setEncryptionName("GHost_$dir/$file", ZipArchive::EM_AES_256, $_POST['password']);
                }
            }
            $zip->close();
        }*/
    }

?>