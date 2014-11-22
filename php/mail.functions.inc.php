<?php
 
##### Mail functions #####
function sendLostPasswordEmail($username, $email, $newpassword) {
    global $domain;
    $message = "
Hello, $username

You have requested a password reset on http://www.$domain/,
 
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
 
function sendMail($to, $subject, $message, $from) {
 
 
    $from_header = "From: $from";
 
    if (mail($to, $subject, $message, $from_header)) {
        return true;
    } else {
        return false;
    }
    return false;
}
 
function sendActivationEmail($username, $password, $uid, $email, $actcode) {
    global $domain;
    $link = "http://www.$domain/#/activate?uid=$uid&actcode=$actcode";
    $message = "
Hello $username,

Thank you for registering on http://www.$domain/,
 
Please click the link below to activate your account.
 
$link
 
Regards,
Watty at $domain
";
 
    if (sendMail($email, "Please activate your $domain account.", $message, "no-reply@$domain")) {
        return true;
    } else {
        return false;
    }
}

function sendAccountInfo($username, $password, $email) {
    global $domain;
    $link = 'http://www.' . $domain;
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
