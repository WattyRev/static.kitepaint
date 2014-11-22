<?php 
//error_reporting(0); // we don't want to see errors on screen
error_reporting(E_ALL);
ini_set('display_errors', 'on');
// Start a session
session_start();
require_once ('../php/db_connect.inc.php'); // include the database connection
require_once ("../php/functions.inc.php"); // include all the functions

if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
	echo 'Access Denied';
    exit;
    return;
}
$u = $_SERVER['PHP_AUTH_USER'];
$p = $_SERVER['PHP_AUTH_PW'];
$seed="0dAfghRqSTgx"; // the seed for the passwords
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
	return;
} ?>
<!DOCTYPE html>
<html ng-app="kitePaintAdmin">
	<head>
		<title>Kite Paint Admin</title>
		<meta name="robots" content="noindex, nofollow">
		<script type="text/javascript" src="../js/libraries/jquery.min.js"></script>
		<script type="text/javascript" src="../js/libraries/angular.min.js"></script>
		<script type="text/javascript" src="../js/libraries/angular-ui-router.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<script type="text/javascript" src="js/controllers/designs.js"></script>
		<script type="text/javascript" src="js/controllers/home.js"></script>
		<script type="text/javascript" src="js/controllers/products.js"></script>
		<script type="text/javascript" src="js/controllers/manufacturers.js"></script>
		<script type="text/javascript" src="js/controllers/primary.js"></script>
		<script type="text/javascript" src="js/controllers/retailers.js"></script>
		<script type="text/javascript" src="js/controllers/users.js"></script>

		<link rel="stylesheet" href="css/style.css" />
	</head>
	<body ng-controller="PrimaryController">
		<aside>
			<ul class="unstyled">	
				<a ui-sref="home" ng-class="{active: 'home' === current_page.name}"><li>Dashboard</li></a>
				<a ui-sref="designs" ng-class="{active: 'designs' === current_page.name}"><li>Designs</li></a>
				<a ui-sref="products" ng-class="{active: 'products' === current_page.name}"><li>Products</li></a>
				<a ui-sref="manufacturers" ng-class="{active: 'manufacturers' === current_page.name}"><li>Manufacturers</li></a>
				<a ui-sref="retailers" ng-class="{active: 'retailers' === current_page.name}"><li>Retailers</li></a>
				<a ui-sref="users" ng-class="{active: 'users' === current_page.name}"><li>Users</li></a>
			</ul>
		</aside>
		<main ui-view id="{{current_page.name}}"></main>
	</body>
</html>