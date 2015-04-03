<?php
require_once "header.php"; 
if($_POST){
	$response = (object) array();
	$response->valid = true;

	if(isset($_POST['new_order'])) {
		$retailer = $_POST['retailer'];
		$user = $_POST['user'];
		$product = $_POST['product'];
		$name = $_POST['name'];
		$designs = $_POST['variations'];

		$sql = sprintf("insert into orders (retailer,user,product,name,designs,created) value ('%s','%s','%s','%s','%s',now())",
		mysql_real_escape_string($retailer), 
		mysql_real_escape_string($user), 
		mysql_real_escape_string($product), 
		mysql_real_escape_string($name), 
		mysql_real_escape_string($designs));
		
		if (mysql_query($sql)) {
			$id = mysql_insert_id();
			echo json_encode($response);
			return;
		
		} else {
			$response->valid = false;
			$response->message = 'Unable to create order. Try again later.';
			echo json_encode($response);
			return;
		}
	}
}