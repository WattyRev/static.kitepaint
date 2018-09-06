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
		$limit = isset($_GET['limit']) ? "LIMIT " . $_GET['limit'] : "";
		$order = isset($_GET['order']) ? "ORDER BY " . $_GET['order'][0] . " " . $_GET['order'][1] : "";
		$query = sprintf("SELECT * FROM designs WHERE $filter $order $limit");

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
	} else if (isset($_GET['status'])) {
		$query = sprintf("SELECT * FROM designs WHERE status = " . $_GET['status']);
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
		$designs->status = mysql_result($result,$i,"status");
		$designs->active = mysql_result($result,$i,"active");
		$designs->images = mysql_result($result,$i,"images");
		array_push($response, $designs);
	}
	echo json_encode($response);
	return;

} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => '',
		'images' => ''
	);

	//Delete
	if (isset($_POST['delete'])) {
		$id = $_POST['id'];

		$query = sprintf("update designs set active = 0 where id = '%s'",
			mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
			$response->valid = false;
			$response->message = 'Unable to delete design';
		}
		$query = sprintf("update designs set updated = now() where id = '%s'",
		mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
		}
		echo json_encode($response);
		return;
	}

	//Create
	if (isset($_POST['new'])) {

		$name = $_POST['name'];
		$user = $_POST['user'];
		$product = $_POST['product'];
		$variations = $_POST['variations'];
		$status = $_POST['status'];

		$code = generate_code(20);

		$sql = sprintf("insert into designs (created, updated, name, user, product, variations, status) value (now(), now(), '%s', '%s', '%s', '%s', '%s')",
		mysql_real_escape_string($name), mysql_real_escape_string($user)
		, mysql_real_escape_string($product), mysql_real_escape_string($variations), mysql_real_escape_string($status));


		if (mysql_query($sql)) {
			$id = mysql_insert_id();

			$response->id = $id;

		} else {
			$response->valid = false;
			$response->message = 'Unable to save';
			echo json_encode($response);
			return;
		}

		if (isset($_POST['images'])) {
			$p_images = json_decode($_POST['images']);
			define('UPLOAD_DIR', '../img/designs/');
			$images = array();
			foreach($p_images as $type=>$image) {
				$image = str_replace('data:image/png;base64,', '', $image);
   				$image = str_replace(' ', '+', $image);
   				$data = base64_decode($image);
   				$file = UPLOAD_DIR . $response->id . str_replace(' ', '', $type) . '.png';
   				$success = file_put_contents($file, $data);
   				$images[$type] = str_replace('..', '', $file);
   				if(!$success) {
   					$response->message = 'Unable to save the image';
   				}
			}
			$response->images = JSON_encode($images);

			$query = sprintf("update designs set images = '%s' where id = '%s'",
				mysql_real_escape_string($response->images), mysql_real_escape_string($response->id));

			if (mysql_query($query)) {
			} else {
				$response->valid = false;
				$response->message = 'Unable to change ' . $metric;
			}
		}
		$response->name = $name;
		echo json_encode($response);
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
		if (isset($_POST['status'])) {
			$vars['status'] = $_POST['status'];
		}
		if (isset($_POST['images'])) {
			$p_images = json_decode($_POST['images']);
			define('UPLOAD_DIR', '../img/designs/');
			$images = array();
			foreach($p_images as $type=>$image) {
				$image = str_replace('data:image/png;base64,', '', $image);
   				$image = str_replace(' ', '+', $image);
   				$data = base64_decode($image);
   				$file = UPLOAD_DIR . $_POST['id'] . str_replace(' ', '', $type) . '.png';
   				$success = file_put_contents($file, $data);
   				$images[$type] = str_replace('..', '', $file);
   				if(!$success) {
   					$response->message = 'Unable to save the image';
   				}
			}
			$vars['images'] = JSON_encode($images);
			$response->images = JSON_encode($images);
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
		mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
			$response->valid = false;
			$response->message = 'Unable to change updated';
		}
		echo json_encode($response);
	}
}
