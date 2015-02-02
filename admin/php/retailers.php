<?php 
require_once "header.php"; 

if ($_GET) {
	$filter = "";
	if (isset($_GET['filter'])){
		$filter .= "WHERE ";
		$count = 0;
		foreach($_GET['filter'] as $metric => $value){
			$count ++;
			if ($count > 1) {
				$filter .= ' AND ';
			}
			$filter .= "$metric  =  $value";
		}
	}
	$limit = isset($_GET['limit']) ? "LIMIT " . $_GET['limit'] : "";
	$order = isset($_GET['order']) ? "ORDER BY " . $_GET['order'][0] . " " . $_GET['order'][1] : "";
	$query = sprintf("SELECT * FROM retailers $filter $order $limit");

	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$designs = (object) array();
		foreach ($_GET['return'] as $key=>$metric){
			$designs->$metric = mysql_result($result,$i,$metric);
			if ($metric === 'created' || $metric === 'updated') {
				$designs->$metric = date("m/d/Y", strtotime($designs->$metric));
			}
		}
		array_push($response, $designs);
	}
	echo JSON_encode($response);
	return;
} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => ''
	);

	//create
	if (isset($_POST['new'])) {

		//echo json_encode($_POST);
		//return;
		global $seed;

		$name = $_POST['name'];
		$username = $_POST['username'];
		$password = $_POST['password'];
		$url = $_POST['url'];
		$city = $_POST['city'];
		$state = $_POST['state'];
		$email = $_POST['email'];
		//$product_opt_out = $_POST['product_opt_out'];

		$sql = sprintf("insert into retailers (activated,name,username,password,url,city,state,email,created,updated) value (1,'%s','%s','%s','%s','%s','%s','%s',now(),now())",
			mysql_real_escape_string($name), mysql_real_escape_string($username), mysql_real_escape_string(sha1($password, $seed)), mysql_real_escape_string($url), mysql_real_escape_string($city), mysql_real_escape_string($state), mysql_real_escape_string($email));

		if (mysql_query($sql)) {
			$id = mysql_insert_id();

			echo json_encode($response);
			return;
		} else {
			$response->valid = false;
			$response->message = 'Unable to create retailer';
			echo json_encode($response);
			return;
		}
	}
}