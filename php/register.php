<?php
 
require_once "header.php";

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$password2 = isset($_POST['password2']) ? $_POST['password2'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';

$response = registerNewUser($username, $password, $password2, $email);
if ($response->valid){

	register_success();

}else {

	register_error($response->message);

}
?>