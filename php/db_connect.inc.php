<?php
if ($_SERVER['SERVER_NAME'] === 'beta.kitepaint.com' || $_SERVER['SERVER_NAME'] === 'kitepaint.com' || $_SERVER['SERVER_NAME'] === 'wattydev.com') {
	$environment = 'remote';
} else {
	$environment = 'local';
}

// Database settings
// database hostname or IP. default:localhost
// localhost will be correct for 99% of times
define("HOST", "localhost");

// Database user
// Database password
if ($environment === 'remote'){
	define("DBUSER", "r3vfan_kitepaint");
	define("PASS", "cJH,^ViVDm21");
} else {
	define("DBUSER", "root");
	define("PASS", "");
}
// Database name
define("DB", "r3vfan_kite_paint");

############## Make the mysql connection ###########
$conn = mysql_connect(HOST, DBUSER, PASS) or  die('Could not connect !<br />Please contact the site\'s administrator.');

$db = mysql_select_db(DB) or  die('Could not connect to database !<br />Please contact the site\'s administrator.');

?>
