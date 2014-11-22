<?php
//error_reporting(0); // we don't want to see errors on screen
error_reporting(E_ALL);
ini_set('display_errors', 'on');
// Start a session
session_start();
require_once ('../../php/db_connect.inc.php'); // include the database connection
require_once ("../../php/functions.inc.php"); // include all the functions
$seed = "0dAfghRqSTgx"; // the seed for the passwords
$domain =  "wattydev.com/projects/kite_paint"; // the domain name without http://www.

if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
	echo 'Access Denied';
    exit;
}
$u = $_SERVER['PHP_AUTH_USER'];
$p = $_SERVER['PHP_AUTH_PW'];
$query = sprintf("
	SELECT admin
	FROM login
	WHERE
	username = '%s' AND password = '%s'
	AND disabled = 0 AND activated = 1
	LIMIT 1;", mysql_real_escape_string($u), mysql_real_escape_string(sha1($p . $seed)));
$result = mysql_query($query);
$result = mysql_fetch_array($result);
if ($result['admin'] !== '1') {
	echo 'Access Denied';
} ?>