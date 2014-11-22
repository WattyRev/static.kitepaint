<?php
 
require_once "header.php";

$response = lostPassword($_POST['username'], $_POST['email']);
if ($response->valid){

	lost_password_success();

} else {

	lost_password_error($response->message);

}

?>
