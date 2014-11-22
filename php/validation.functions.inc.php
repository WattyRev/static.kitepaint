<?php
 
#### Validation functions ####

//email addresses must have one @ symbol
function valid_email($email) {
 
    // First, we check that there's one @ symbol, and that the lengths are right
    if (!preg_match("/^[^@]{1,64}@[^@]{1,255}$/", $email))
    {
        // Email invalid because wrong number of characters in one section, or wrong number of @ symbols.
        return false;
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return true;
    } else {
        return false;
    }
}
 
//usernames are 3-30 characters, and contain a-z, A-Z, 0-9
function valid_username($username, $minlength = 3, $maxlength = 30) {
 
    $username = trim($username);
 
    if (empty($username))
    {
        return false; // it was empty
    }
    if (strlen($username) > $maxlength)
    {
        return false; // to long
    }
    if (strlen($username) < $minlength)
    {
 
        return false; //toshort
    }
 
    $result = preg_match("/^[A-Za-z0-9_\-]+$/", $username); //only A-Z, a-z and 0-9 are allowed
 
    if ($result)
    {
        return true; // ok no invalid chars
    } else
    {
        return false; //invalid chars found
    }
 
    return false;
 
}

//passwords are 6 - 15 characters, and contain a-z, A-Z, 0-9, and/or @, *, #
function valid_password($pass, $minlength = 6, $maxlength = 15) {
    $pass = trim($pass);
 
    if (empty($pass))
    {
        return false;
    }
 
    if (strlen($pass) < $minlength)
    {
        return false;
    }
 
    if (strlen($pass) > $maxlength)
    {
        return false;
    }
 
    $result = preg_match("/[A-Za-z0-9@*#.]/", $pass);
 
    if ($result)
    {
        return true;
    } else
    {
        return false;
    }
 
    return false;
 
}
 
?>
