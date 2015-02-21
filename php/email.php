<?php
require_once "header.php"; 

$response = (object) array(
    'sent' => true,
    'message' => ''
);

//variables must exist
if (!$_POST['email']) {
	$response->sent = false;
	$response->message = 'Please add your email address.';
	echo json_encode($response);
	return;
}
if (!$_POST['name']) {
	$response->sent = false;
	$response->message = 'Please add your name.';
	echo json_encode($response);
	return;
}
if (!$_POST['subject']) {
	$response->sent = false;
	$response->message = 'Please add a subject.';
	echo json_encode($response);
	return;
}
if (!$_POST['comments']) {
	$response->sent = false;
	$response->message = 'Please add your comments.';
	echo json_encode($response);
	return;
}
if (!$_POST['to']) {
	$response->sent = false;
	$response->message = 'Please add the to email address.';
	echo json_encode($response);
	return;
}

//emails must be valid
if (!valid_email($_POST['email'])) {
	$response->sent = false;
	$response->message = 'Please enter a valid email address.';
	echo json_encode($response);
	return;
}
if (!valid_email($_POST['to'])) {
	$response->sent = false;
	$response->message = 'Please enter a valid to email address.';
	echo json_encode($response);
	return;
}

$message = $_POST['comments'];
$subject = '[KitePaint] ' . $_POST['subject'];

if (sendMail($_POST['to'], $subject, $message, $_POST['email'], $_POST['format'])) {
	echo json_encode($response);
	return;
} else {
	$response->sent = false;
	$response->message = 'We were unable to send your message. Try again later.';
	echo json_encode($response);
	return;
}