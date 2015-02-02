<?php
require_once "header.php"; 
if ($_GET){
	$filter = "";
	if(isset($_GET['filter'])){
		$filter .= "WHERE";
		$count = 0;
		foreach($_GET['filter'] as $metric => $value){
			$count ++;
			if ($count > 1) {
				$filter .= ' AND ';
			}
			$filter .= "$metric  =  $value";
		}
	}
	$query = sprintf("SELECT * FROM products $filter");

	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$products = (object) array();
		foreach ($_GET['return'] as $key=>$metric){
			$products->$metric = mysql_result($result,$i,$metric);
			if ($metric === 'created') {
				$products->$metric = date("m/d/Y", strtotime($products->$metric));
			}
		}
		array_push($response, $products);
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
		$query = sprintf("delete from products where id = '%s'", 
			mysql_real_escape_string($_POST['id']));

		if (mysql_query($query)) {

		} else {
			$response->valid = false;
			$response->message = 'Unable to delete product';
		}

		echo json_encode($response);

		return;
	}

	//Create
	if (isset($_POST['new'])) {
		$name = $_POST['name'];
		$manufacturer = $_POST['manufacturer'];
		$url = $_POST['url'];
		$colors = $_POST['colors'];
		$variations = $_POST['variations'];
		$notes = $_POST['notes'];
		$embed = $_POST['embed'];


		$code = generate_code(20);
		$sql = sprintf("insert into products (activated,name,manufacturer,created,url,colors,variations) value (1,'%s','%s',now(),'%s','%s','%s')",
		mysql_real_escape_string($name), mysql_real_escape_string($manufacturer)
		, mysql_real_escape_string($url), mysql_real_escape_string($colors), mysql_real_escape_string($variations));
		
		
		if (mysql_query($sql)) {
			$id = mysql_insert_id();

			echo json_encode($response);
			return;
		
		} else {
			$response->valid = false;
			$response->message = 'Unable to create product';
			echo json_encode($response);
			return;
		}
	}

	//Update
	$id = $_POST['id'];
	$vars = array(
		'activated' => $_POST['activated'] === 'true' ? '1' : '0',
		'name' => $_POST['name'],
		'manufacturer' => $_POST['manufacturer'],
		'url' => $_POST['url'],
		'colors' => $_POST['colors'],
		'variations' => $_POST['variations'],
		'notes' => $_POST['notes'],
		'embed' => $_POST['embed']
	);

	foreach($vars as $metric => $val){
		$query = sprintf("update products set $metric = '%s' where id = '%s'",
			mysql_real_escape_string($val), mysql_real_escape_string($id));

		if (mysql_query($query)) {
		} else {
			$response->valid = false;
			$response->message = 'Unable to change ' . $metric;
		}
	}

	echo json_encode($response);

} else {
	echo 'No GET or POST variables';
}