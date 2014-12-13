<?php
require_once "header.php"; 
if ($_GET){
	if (isset($_GET['filter'])) {
		$filter = "";
		$count = 0;
		foreach($_GET['filter'] as $metric => $value){
			$count ++;
			if ($count > 1) {
				$filter .= ' AND ';
			}
			$filter .= "$metric  =  $value";
		}
		$query = sprintf("SELECT * FROM designs WHERE $filter");

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
	}

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
		$designs->variations = mysql_result($result,$i,"variations");
		$designs->public = mysql_result($result,$i,"public");
		array_push($response, $designs);
	}
	echo json_encode($response);
	return;

} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => ''
	);

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
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$vars = array();

		if (isset($_POST['variations'])) {
			$vars['variations'] = $_POST['variations'];
		}
		if (isset($_POST['name'])) {
			$vars['name'] = $_POST['name'];
		}
		if (isset($_POST['public'])) {
			$vars['public'] = $_POST['public'];
		}

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
	}
}