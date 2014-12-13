<?php
require_once "header.php"; 
if ($_GET){
	$query = sprintf("SELECT * FROM designs");
		 
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
		$designs->public = mysql_result($result,$i,"public") === '1' ? true : false;
		$designs->active = mysql_result($result,$i,"active") === '1' ? true : false;
		array_push($response, $designs);
	}
	echo json_encode($response);
} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => ''
	);

	//Delete
	if (isset($_POST['delete'])) {
		$query = sprintf("delete from designs where id = '%s'", 
			mysql_real_escape_string($_POST['id']));

		if (mysql_query($query)) {

		} else {
			$response->valid = false;
			$response->message = 'Unable to delete design';
		}

		echo json_encode($response);

		return;
	}

	//Update
	$id = $_POST['id'];
	$vars = array(
		'active' => $_POST['active'] === 'true' ? '1' : '0',
		'name' => $_POST['name'],
		'user' => $_POST['user'],
		'product' => $_POST['product'],
		'public' => $_POST['public'] === 'true' ? '1' : '0'
	);

	foreach($vars as $metric => $val){
		$query = sprintf("update designs set $metric = '%s' where id = '%s'",
			mysql_real_escape_string($val), mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
			$response->valid = false;
			$response->message = 'Unable to change ' . $metric;
		}
	}

	$query = sprintf("update designs set updated = now() where id = '%s'",
		mysql_real_escape_string($val), mysql_real_escape_string($id));

	if (mysql_query($query)) {
	} else {
		$response->valid = false;
		$response->message = 'Unable to change updated';
	}

	echo json_encode($response);

} else {
	echo 'No GET or POST variables';
}