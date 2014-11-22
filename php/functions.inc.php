<?php
 
require_once("mail.functions.inc.php");
require_once("user.functions.inc.php");
require_once("display.functions.inc.php");
require_once("login.functions.inc.php");
require_once("validation.functions.inc.php");
 
 
function generate_code($length = 10) {
 
    if ($length <= 0) {
        return false;
    }
 
    $code = "";
    $chars = "abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    srand((double)microtime() * 1000000);
    for ($i = 0; $i < $length; $i++) {
        $code = $code . substr($chars, rand() % strlen($chars), 1);
    }
    return $code;
 
}
 
?>