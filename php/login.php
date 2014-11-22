<?php
if (isset($_POST['update_login'])) {
	if (!isset($_POST['username']) || !isset($_POST['user_id']) || !isset($_POST['actcode'])) {
		echo 'not logged in';
		return;
	}
	$response = updateLogin($_POST['username'], $_POST['user_id'], $_POST['actcode']);

	if ($response->valid) {
		return_user();
	} else {
		bad_login($response->message);
	}
	return;
}

if (!isset($_POST['username']) || !isset($_POST['password'])) {
	echo 'no data';
	return;
}
// retrieve the username and password sent from login form & check the login.
$response = checkLogin($_POST['username'], $_POST['password']);

if ($response->valid) {
    return_user();
} else {
    bad_login($response->message);
}
?>
