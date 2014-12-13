<?php
require_once "header.php"; 
if ($_GET){
	if (isset($_GET['id'])) {
		$query = sprintf("SELECT * FROM designs WHERE id = " . $_GET['id']);
	} else if (isset($_GET['public'])) {
		$query = sprintf("SELECT * FROM designs WHERE public = 1");
	} else {
		$query = sprintf("SELECT * FROM designs");
	}
		 
	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$designs = (object) array();
		$designs->id = mysql_result($result,$i,"id");
		$designs->created = date("m/d/Y", strtotime(mysql_result($result,$i,"created")));
		$designs->updated = date("m/d/Y", strtotime(mysql_result($result,$i,"updated")));
		$designs->name = mysql_result($result,$i,"name");
		$designs->user = mysql_result($result,$i,"user");
		$designs->product = mysql_result($result,$i,"product");
		$designs->product = mysql_result($result,$i,"variations");
		$designs->product = mysql_result($result,$i,"pulbic");
		array_push($response, $designs);
	}
	echo json_encode($response);
} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => ''
	);

	//Delete
	// if (isset($_POST['delete'])) {
	// 	$query = sprintf("delete from login where loginid = '%s'", 
	// 		mysql_real_escape_string($_POST['loginid']));

	// 	if (mysql_query($query)) {

	// 	} else {
	// 		$response->valid = false;
	// 		$response->message = 'Unable to delete user';
	// 	}

	// 	echo json_encode($response);

	// 	return;
	// }

	//Create
	if (isset($_POST['new'])) {

		$name = $_POST['name'];
		$user = $_POST['user'];
		$product = $_POST['product'];
		$variations = $_POST['variations'];
		$public = $_POST['public'];


		if (!valid_username($name)) {
			$response->valid = false;
			$response->message = 'Invalid name';
			echo json_encode($response);
			return;
		}

		$code = generate_code(20);
		$sql = sprintf("insert into designs (created, updated, name, user, product, variations, public) value (now(), now(), '%s', '%s', '%s', '%s', '%s')",
		mysql_real_escape_string($name), mysql_real_escape_string($user)
		, mysql_real_escape_string($product), mysql_real_escape_string($variations), mysql_real_escape_string($public));
		
		
		if (mysql_query($sql)) {
			$id = mysql_insert_id();

			$response->id = $id;
			echo json_encode($response);
		
		} else {
			$response->valid = false;
			$response->message = 'Unable to save';
			echo json_encode($response);
			return;
		}
	}

	//Update
	// $id = $_POST['loginid'];
	// $vars = array(
	// 	'username' => $_POST['username'],
	// 	'email' => $_POST['email'],
	// 	'activated' => $_POST['activated'] === 'true' ? '1' : '0'
	// );

	// foreach($vars as $metric => $val){
	// 	$query = sprintf("update login set $metric = '%s' where loginid = '%s'",
	// 		mysql_real_escape_string($val), mysql_real_escape_string($id));

	// 	if (mysql_query($query)) {
	// 	} else {
	// 		$response->valid = false;
	// 		$response->message = 'Unable to change ' . $metric;
	// 	}
	// }

	// echo json_encode($response);
}