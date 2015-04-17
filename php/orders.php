<?php
require_once "header.php"; 
if($_GET) {
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
		$query = sprintf("SELECT * FROM orders WHERE $filter $order $limit");

		$result = mysql_query($query);
		$num = mysql_num_rows($result);
		mysql_close();
		$response = array();
		for ($i = 0; $i < $num; $i++) {
			$users = (object) array();
			foreach ($_GET['return'] as $key=>$metric){
				$users->$metric = mysql_result($result,$i,$metric);
				if ($metric === 'created') {
					$users->$metric = date("m/d/Y", strtotime($users->$metric));
				}
			}
			array_push($response, $users);
		}
		echo JSON_encode($response);
		return;
	}
}
if($_POST){
	$response = (object) array();
	$response->valid = true;

	if(isset($_POST['new_order'])) {
		$retailer = $_POST['retailer'];
		$user = $_POST['user'];
		$product = $_POST['product'];
		$name = $_POST['name'];
		$message = $_POST['message'];
		$designs = $_POST['variations'];

		$sql = sprintf("insert into orders (retailer,user,first_name,last_name,email,product,name,designs,message,created) value ('%s','%s','%s','%s','%s','%s','%s','%s','%s',now())",
		mysql_real_escape_string($retailer), 
		mysql_real_escape_string($user['id']),  
		mysql_real_escape_string($user['first_name']),  
		mysql_real_escape_string($user['last_name']),  
		mysql_real_escape_string($user['email']),  
		mysql_real_escape_string($product), 
		mysql_real_escape_string($name), 
		mysql_real_escape_string($designs),
		mysql_real_escape_string($message));
		
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