<?php

##### Mail functions #####
function sendLostPasswordEmail($username, $email, $newpassword) {
	global $domain;
	$message = "
	Hello, $username

	You have requested a password reset on https://$domain/,

	Your new new temporary password is:

	$newpassword

	Please change your password in your account settings.

	Regards,
	Watty at $domain
	";

	if (sendMail($email, "Your $domain password has been reset.", $message, "no-reply@$domain", false)) {
		return true;
	} else {
		return false;
	}
}

function sendLostPasswordEmailRetailer($username, $email, $newpassword) {
	global $domain;
	$message = "
	Hello, $username

	You have requested a password reset on https://$domain/#!/retailers,

	Your new new temporary password is:

	$newpassword

	Please change your password in your account settings.

	Regards,
	Watty at $domain
	";

	if (sendMail($email, "Your $domain password has been reset.", $message, "no-reply@$domain", false)) {
		return true;
	} else {
		return false;
	}
}

function sendMail($to, $subject, $message, $from, $format) {

	$header = "From: $from";

	if(isset($format) && $format === 'html') {
		$header .= "\r\nMIME-Version: 1.0\r\n";
		$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	}

	if (mail($to, $subject, $message, $header)) {
		return true;
	} else {
		return false;
	}
}

function sendActivationEmail($username, $password, $uid, $email, $actcode) {
	global $domain;
	$link = "https://$domain/#!/activate?uid=$uid&actcode=$actcode";
	$message = "
	Hello $username,

	Thank you for registering on https://$domain/,

	Please click the link below to activate your account.

	$link

	Regards,
	Watty at $domain
	";

	if (sendMail($email, "Please activate your $domain account.", $message, "spencer@kitepaint.com", false)) {
		return true;
	} else {
		return false;
	}
}

function sendRetailerActivation($id, $name, $email, $actcode) {
	global $domain;
	$link = "https://$domain/retailers/#!/activate?id=$id&actcode=$actcode";
	$message = "
	Hello,

	Thank you for signing up as a retailer on KitePaint!

	Your account has been created and is ready for you to set up. Click on the link below to begin receiving designs directly from KitePaint.

	$link

	Regards,
	Watty at $domain
	";

	if (sendMail($email, "Please set up your KitePaint retailer account", $message, "spencer@kitepaint.com", false)) {
		return true;
	} else {
		return false;
	}
}

function sendAccountInfo($username, $password, $email) {
	global $domain;
	$link = 'https://' . $domain;
	$message = "
	Hello $username,

	An account has been created for you. Here are your account details:

	Username: $username
	Temporary Password: $password

	Please login at the link below to change your password.

	$link

	Regards,
	Watty at $domain";

	if (sendMail($email, "Your $domain account has been created", $message, "no-reply@$domain", false)) {
		return true;
	} else {
		return false;
	}
}

function sendLostRetailerUsername($username, $email) {
	global $domain;
	$message = "
	Hello, $username

	You have requested your username on https://$domain/#!/retailers.

	Your username is:

	$username

	Regards
	Watty at $domain
	";

	if(sendMail($email, "Your $domain username", $message, "no-reply@$domain", false)) {
		return true;
	} else {
		return false;
	}
}

?>
