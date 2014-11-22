<?php
 
require_once "header.php";
$response = changePassword($_POST['username'], $_POST['oldpassword'], $_POST['password'],
    $_POST['password2']);
if ($response->valid) {

  change_password_success();

} else {
   
   change_password_error($response->message);

}
 
?>
