<?php
require_once "header.php";
if ($_GET){
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
	$query = sprintf("SELECT * FROM designs $filter $order $limit");

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
		'status' => $_POST['status']
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
