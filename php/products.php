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
		$query = sprintf("SELECT * FROM products WHERE $filter");

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
	}

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
		$products->notes = mysql_result($result,$i,"notes");
		array_push($response, $products);
	}
	echo json_encode($response);
}