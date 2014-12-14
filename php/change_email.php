<?php
 
require_once "header.php";
$response = changeEmail($_POST['id'], $_POST['email']);
if ($response->valid) {

  change_email_success();

} else {
   
   change_email_error($response->message);

}
 
?>
