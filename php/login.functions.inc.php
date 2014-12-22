<?php
 
#### Login Functions #####
 
function checkLogin($u, $p){

    global $seed; // global because $seed is declared in the header.php file


    $response = (object) array();
    $response->valid = true;
 
    if (!valid_username($u) || !valid_password($p) || !user_exists($u))
    {
        $response->valid = false;
        $response->message = 'Invalid username or password';
        return $response;
    }
 
    //Now let us look for the user in the database.
    $query = sprintf("
        SELECT loginid
        FROM login
        WHERE
        username = '%s' AND password = '%s'
        AND disabled = 0 AND activated = 1
        LIMIT 1;", mysql_real_escape_string($u), mysql_real_escape_string(sha1($p . $seed)));
    $result = mysql_query($query);
    // If the database returns a 0 as result we know the login information is incorrect.
    // If the database returns a 1 as result we know  the login was correct and we proceed.
    // If the database returns a result > 1 there are multple users
    // with the same username and password, so the login will fail.
    if (mysql_num_rows($result) != 1)
    {
        $response->valid = false;
        $response->message = 'Invalid username or password';
        return $response;
    } else {

        //Check to see if the user has been deleted
        $query = sprintf("
            SELECT deleted
            FROM login
            WHERE
            username = '%s' AND password = '%s'
            AND disabled = 0 AND activated = 1
            LIMIT 1;", mysql_real_escape_string($u), mysql_real_escape_string(sha1($p . $seed)));
        $deleted_result = mysql_query($query);
        $deleted_row = mysql_fetch_array($deleted_result);
        $deleted = $deleted_row['deleted'];

        if ($deleted === "1") {
            $response->valid = false;
            $response->message = 'Invalid username or password';
            return $response;
        }

        // Login was successfull
        $row = mysql_fetch_array($result);
        
        $loginid = $row['loginid'];

        $query = sprintf("
            SELECT actcode
            FROM login
            WHERE
            loginid = '%s'
            LIMIT 1;", mysql_real_escape_string($loginid));

        $result = mysql_query($query);
        $row = mysql_fetch_array($result);

        $actcode = $row['actcode'];

        $query = sprintf("
            SELECT email
            FROM login
            WHERE
            loginid = '%s'
            LIMIT 1;", mysql_real_escape_string($loginid));

        $result = mysql_query($query);
        $row = mysql_fetch_array($result);

        $email = $row['email'];
        
        $query = sprintf("
            SELECT favorites
            FROM login
            WHERE
            loginid = '%s'
            LIMIT 1;", mysql_real_escape_string($loginid));

        $result = mysql_query($query);
        $row = mysql_fetch_array($result);

        $favorites = $row['favorites'];

        //update last login time
        $query = sprintf("update login set last_login = now() where loginid = '%s'",
            mysql_real_escape_string($loginid));
     
        if (mysql_query($query)) {
        } else {
            $response->valid = false;
            $response->message = 'Unable to log in';
            return $response;
        }

        // Save the user ID for use later
        $_SESSION['loginid'] = $loginid;
        // Save the username for use later
        $_SESSION['username'] = $u;
        //save act code for use later
        $_SESSION['actcode'] = $actcode;
        //save email
        $_SESSION['email'] = $email;
        //save favorites
        $_SESSION['favorites'] = $favorites;
        // Now we show the userbox
        return $response;
    }
}

function updateLogin($username, $loginid, $actcode) {
    $response = (object) array();
    $response->valid = true;

    if (!valid_username($username) || !user_exists($username))
    {
        $response->valid = false;
        $response->message = 'Invalid username';
        return $response;
    }

    //Now let us look for the user in the database.
    $query = sprintf("
        SELECT email
        FROM login
        WHERE
        username = '%s' AND loginid = '%s'
        AND actcode = '%s'
        LIMIT 1;", mysql_real_escape_string($username), mysql_real_escape_string($loginid), mysql_real_escape_string($actcode));

    $result = mysql_query($query);

    if (mysql_num_rows($result) != 1) {
        $response->valid = false;
        $response->message = 'Invalid credentials';
        return $response;
    }

    $row = mysql_fetch_array($result);
    $email = $row['email'];

    $query = sprintf("
        SELECT favorites
        FROM login
        WHERE
        username = '%s' AND loginid = '%s'
        AND actcode = '%s'
        LIMIT 1;", mysql_real_escape_string($username), mysql_real_escape_string($loginid), mysql_real_escape_string($actcode));

    $result = mysql_query($query);

    if (mysql_num_rows($result) != 1) {
        $response->valid = false;
        $response->message = 'Invalid credentials';
        return $response;
    }

    $row = mysql_fetch_array($result);
    $favorites = $row['favorites'];

    $query = sprintf("update login set last_login = now() where loginid = '%s'",
            mysql_real_escape_string($loginid));
     
    if (mysql_query($query)) {
        $_SESSION['username'] = $username;
        $_SESSION['loginid'] = $loginid;
        $_SESSION['actcode'] = $actcode;
        $_SESSION['email'] = $email;
        $_SESSION['favorites'] = $favorites;
        return $response;
    } else {
        $response->valid = false;
        $response->message = 'Unable to login';
        return $response;
    }
}
 
?>
