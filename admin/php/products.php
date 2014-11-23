<?php
require_once "header.php"; 
if ($_GET){
	$query = sprintf("SELECT * FROM products");
		 
	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$products = (object) array();
		$products->id = mysql_result($result,$i,"id");
		$products->activated = mysql_result($result,$i,"activated") === '1' ? true : false;
		$products->created = date("m/d/Y", strtotime(mysql_result($result,$i,"created")));
		$products->name = mysql_result($result,$i,"name");
		$products->manufacturer = mysql_result($result,$i,"manufacturer");
		$products->url = mysql_result($result,$i,"url");
		$products->colors = mysql_result($result,$i,"colors");
		$products->variations = mysql_result($result,$i,"variations");
		array_push($response, $products);
	}
	echo json_encode($response);
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
		'variations' => $_POST['variations']
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