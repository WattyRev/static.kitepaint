<?php
 
##### Mail functions #####
function sendLostPasswordEmail($username, $email, $newpassword) {
	global $domain;
	$message = "
Hello, $username

You have requested a password reset on http://$domain/,
 
Your new new temporary password is:

$newpassword 
 
Regards,
Watty at $domain
";
 
	if (sendMail($email, "Your $domain password has been reset.", $message, "no-reply@$domain")) {
		return true;
	} else {
		return false;
	}
 
 
}
 
function sendMail($to, $subject, $message, $from, $format) {
 
 
	$header = "From: $from";

	foreach($attachments as $attachment) {
		$message .= '\r\n<img src="' . $attachment . '" />'; 
	}
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
	$link = "http://$domain/#/activate?uid=$uid&actcode=$actcode";
	$message = "
Hello $username,

Thank you for registering on http://$domain/,
 
Please click the link below to activate your account.
 
$link
 
Regards,
Watty at $domain
";
 
	if (sendMail($email, "Please activate your $domain account.", $message, "spencer@wattydev.com")) {
		return true;
	} else {
		return false;
	}
}

function sendAccountInfo($username, $password, $email) {
	global $domain;
	$link = 'http://' . $domain;
	$message = "
Hello $username,

An account has been created for you. Here are your account details:

Username: $username
Temporary Password: $password

Please login at the link below to change your password.

$link

Regards,
Watty at $domain";

	if (sendMail($email, "Your $domain account has been created", $message, "no-reply@$domain")) {
		return true;
	} else {
		return false;
	}

}
 
?>
