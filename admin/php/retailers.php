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

		// echo json_encode($_POST);
		// return;

		$name = $_POST['name'];
		$email = $_POST['email'];
		$url = $_POST['url'];
		$city = $_POST['city'];
		$state = $_POST['state'];
		$image = $_POST['image'];
		$product_opt_out = json_encode($_POST['product_opt_out']);
		$product_urls = json_encode($_POST['product_urls']);
		$code = generate_code(20);
		$sql = sprintf("insert into retailers (activated,name,email,url,city,state,image,product_opt_out,product_urls,actcode,created,updated) value (0,'%s','%s','%s','%s','%s','%s','%s','%s','%s',now(),now())",
			mysql_real_escape_string($name), mysql_real_escape_string($email), mysql_real_escape_string($url), mysql_real_escape_string($city), mysql_real_escape_string($state), mysql_real_escape_string($image), mysql_real_escape_string($product_opt_out), mysql_real_escape_string($product_urls), mysql_real_escape_string($code));

		if (mysql_query($sql)) {
			$id = mysql_insert_id();
			if (sendRetailerActivation($id, $name, $email, $code)) {
				echo json_encode($response);
				return;
			} else {
				$response->valid = false;
				$response->message = 'Unable to send activation email';
				echo json_encode($response);
				return;
			}
		} else {
			$response->valid = false;
			$response->message = 'Unable to create retailer';
			echo json_encode($response);
			return;
		}
	}

	//Delete
	if (isset($_POST['delete'])) {
		$query = sprintf("delete from retailers where id = '%s'", 
			mysql_real_escape_string($_POST['id']));

		if (mysql_query($query)) {

		} else {
			$response->valid = false;
			$response->message = 'Unable to delete retailer';
		}

		echo json_encode($response);

		return;
	}

	//Update
	$id = $_POST['id'];
	$vars = array(
		'activated' => $_POST['activated'] === 'true' ? '1' : '0',
		'name' => $_POST['name'],
		'username' => $_POST['username'],
		'url' => $_POST['url'],
		'city' => $_POST['city'],
		'state' => $_POST['state'],
		'email' => $_POST['email'],
		'image' => $_POST['image'],
		'product_opt_out' => json_encode($_POST['product_opt_out']),
		'product_urls' => json_encode($_POST['product_urls'])
	);

	foreach($vars as $metric => $val){
		$query = sprintf("update retailers set $metric = '%s' where id = '%s'",
			mysql_real_escape_string($val), mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
			$response->valid = false;
			$response->message = 'Unable to change ' . $metric;
		}
	}
	$query = sprintf("update retailers set updated = now() where id = '%s'",
		mysql_real_escape_string($id));

	if (mysql_query($query)) {
	} else {
		$response->valid = false;
		$response->message = 'Unable to change updated';
	}

	echo json_encode($response);
}