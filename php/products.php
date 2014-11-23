<?php
require_once "header.php"; 
if ($_GET){
	if (isset($_GET['id'])) {
		$query = sprintf("SELECT * FROM products WHERE id = " . $_GET['id']);
	} else if (isset($_GET['activated'])) {
		$query = sprintf("SELECT * FROM products WHERE activated = 1");
	} else {
		$query = sprintf("SELECT * FROM products");
	}
		 
	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$products = (object) array();
		$products->id = mysql_result($result,$i,"id");
		$products->name = mysql_result($result,$i,"name");
		$products->manufacturer = mysql_result($result,$i,"manufacturer");
		$products->url = mysql_result($result,$i,"url");
		$products->colors = mysql_result($result,$i,"colors");
		$products->variations = mysql_result($result,$i,"variations");
		array_push($response, $products);
	}
	echo json_encode($response);
}