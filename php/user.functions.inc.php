<?php
 
##### User Functions #####
function changeEmail($loginid, $email){
    global $seed;
    $response = (object) array();
    $response->valid = true;
    if (!valid_email($email)) {

        $response->valid = false;
        $response->message = 'Invalid email address';
        return $response;

    }
 
    // now we update the email in the database
    $query = sprintf("update login set email = '%s' where loginid = '%s'",
        mysql_real_escape_string($email), mysql_real_escape_string($loginid));
 
    if (mysql_query($query)) {
        return $response;
    } else {
        $response->valid = false;
        $response->message = 'Unable to change email';
        return $response;
    }
}

function changePassword($username, $currentpassword, $newpassword, $newpassword2){
    global $seed;
    $response = (object) array();
    $response->valid = true;
    if (!valid_username($username)) {

        $response->valid = false;
        $response->message = 'Invalid username';
        return $response;

    } else if (!user_exists($username)) {

        $response->valid = false;
        $response->message = 'User already exists';
        return $response; 

    }
    if (!valid_password($newpassword) ){

        $response->valid = false;
        $response->message = 'New password is invalid';
        return $response;

    } else if ($newpassword != $newpassword2){
        $response->valid = false;
        $response->message = 'Passwords don\'t match';
        return $response;
    }
 
    // we get the current password from the database
    $query = sprintf("SELECT password FROM login WHERE username = '%s' LIMIT 1",
        mysql_real_escape_string($username));
 
    $result = mysql_query($query);
    $row= mysql_fetch_row($result);
 
    // compare it with the password the user entered, if they don't match, we return false, he needs to enter the correct password.
    if ($row[0] != sha1($currentpassword.$seed)){
        $response->valid = false;
        $response->message = 'Incorrect password';
        return $response;
    }
 
    // now we update the password in the database
    $query = sprintf("update login set password = '%s' where username = '%s'",
        mysql_real_escape_string(sha1($newpassword.$seed)), mysql_real_escape_string($username));
 
    if (mysql_query($query)) {
        return $response;
    } else {
        $response->valid = false;
        $response->message = 'Unable to change password';
        return $response;
    }
}
 
function delete_account($loginid, $password){
    global $seed;
    $response = (object) array();
    $response->valid = true;
    if (!valid_password($password) ){

        $response->valid = false;
        $response->message = 'Password is invalid';
        return $response;

    }
 
    // we get the current password from the database
    $query = sprintf("SELECT password FROM login WHERE loginid = '%s' LIMIT 1",
        mysql_real_escape_string($loginid));
 
    $result = mysql_query($query);
    $row= mysql_fetch_row($result);
 
    // compare it with the password the user entered, if they don't match, we return false, he needs to enter the correct password.
    if ($row[0] != sha1($password.$seed)){
        $response->valid = false;
        $response->message = 'Incorrect password';
        return $response;
    }
 
    // now we update 'deleted' in the database
    $query = sprintf("update login set deleted = 1 where loginid = '%s'",
        mysql_real_escape_string(mysql_real_escape_string($loginid)));
 
    if (mysql_query($query)) {
    } else {
        $response->valid = false;
        $response->message = 'Unable to delete account';
        return $response;
    }

    // now we update 'deleted time' in the database
    $query = sprintf("update login set deleted_time = now() where loginid = '%s'",
        mysql_real_escape_string(mysql_real_escape_string($loginid)));
 
    if (mysql_query($query)) {
        return $response;
    }
}
 
function user_exists($username) {
    if (!valid_username($username)) {
        return false;
    }
 
    $query = sprintf("SELECT loginid FROM login WHERE username = '%s' LIMIT 1",
        mysql_real_escape_string($username));
 
    $result = mysql_query($query);
 
    if (mysql_num_rows($result) > 0) {
        return true;
    } else {
        return false;
    }
 
    return false;
}
function retailer_exists($username) {
    if (!valid_username($username)) {
        return false;
    }
 
    $query = sprintf("SELECT id FROM retailers WHERE username = '%s' LIMIT 1",
        mysql_real_escape_string($username));
 
    $result = mysql_query($query);
 
    if (mysql_num_rows($result) > 0) {
        return true;
    } else {
        return false;
    }
 
    return false;
}

 
function activateUser($uid, $actcode) {
 
    $query = sprintf("select activated from login where loginid = '%s' and actcode = '%s' and activated = 0  limit 1",
        mysql_real_escape_string($uid), mysql_real_escape_string($actcode));
 
    $result = mysql_query($query);
 
    if (mysql_num_rows($result) == 1) {
 
        $sql = sprintf("update login set activated = '1'  where loginid = '%s' and actcode = '%s'",
            mysql_real_escape_string($uid), mysql_real_escape_string($actcode));
 
        if (mysql_query($sql)) {
            return true;
        } else {
            return false;
        }
 
    } else {
 
        return false;
 
    } 
}
 
function registerNewUser($username, $password, $password2, $email) {

    global $seed;
    $response = (object) array();
    $response->valid = true;
 
    if (!valid_username($username)) {
        $response->valid = false;
        $response->message = 'Invalid username';
        return $response;
    } elseif (!valid_password($password)) {
        $response->valid = false;
        $response->message = 'Invalid password';
        return $response;
    } elseif (!valid_email($email)) {
        $response->valid = false;
        $response->message = 'Invalid email';
        return $response;
    } elseif ($password != $password2) {
        $response->valid = false;
        $response->message = 'Passwords do not match';
        return $response;
    } elseif (user_exists($username)) {
        $response->valid = false;
        $response->message = $username . ' has already been taken';
        return $response;
    }
 
 
    $code = generate_code(20);
    $sql = sprintf("insert into login (username,password,email,actcode,create_time,last_login) value ('%s','%s','%s','%s', now(), now())",
        mysql_real_escape_string($username), mysql_real_escape_string(sha1($password . $seed))
        , mysql_real_escape_string($email), mysql_real_escape_string($code));
 
 
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
 
        if (sendActivationEmail($username, $password, $id, $email, $code)) {
            return $response;
        } else {
            $response->valid = false;
            $response->message = 'Unable to send activation email';
            return $response;
        }
 
    } else {
        $response->valid = false;
        $response->message = 'Unable to register';
        return $response;
    }
}
 
function lostPassword($username, $email) {
 
    global $seed;
    $response = (object) array();
    $response->valid = true;

    if (!valid_username($username)) {
        $response->valid = false;
        $response->message = 'Invalid username';
        return $response;
    } elseif (!user_exists($username)) {
        $response->valid = false;
        $response->message = 'User ' . $username . 'doesn\'t exist';
        return $response;
    } else if (!valid_email($email)) {
        $response->valid = false;
        $response->message = 'Invalid email';
        return $response;
    }
 
    $query = sprintf("select loginid from login where username = '%s' and email = '%s' limit 1",
        $username, $email);
 
    $result = mysql_query($query);
 
    if (mysql_num_rows($result) != 1) {
        $response->valid = false;
        $response->message = 'Incorrect user or email address';
        return $response;
    }
 
 
    $newpass = generate_code(8);
 
    $query = sprintf("update login set password = '%s' where username = '%s'",
        mysql_real_escape_string(sha1($newpass.$seed)), mysql_real_escape_string($username));
 
    if (mysql_query($query)) {
 
        if (sendLostPasswordEmail($username, $email, $newpass)) {
            return $response;
        } else {
            $response->valid = false;
            $response->message = 'Unable to send lost password email';
            return $response;
        }
 
    } else {
        $response->valid = false;
        $response->message = 'Unable to reset password';
        return $response;
    } 
}
 
?>
