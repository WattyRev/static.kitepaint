<?php
require_once "header.php"; 
if ($_GET){
	if (isset($_GET['id'])) {
		$query = sprintf("SELECT * FROM manufacturers WHERE id = " . $_GET['id']);
	} else if (isset($_GET['activated'])) {
		$query = sprintf("SELECT * FROM manufacturers WHERE activated = 1");
	} else {
		$query = sprintf("SELECT * FROM manufacturers");
	}
		 
	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$manufacturers = (object) array();
		$manufacturers->id = mysql_result($result,$i,"id");
		$manufacturers->name = mysql_result($result,$i,"name");
		$manufacturers->logo = mysql_result($result,$i,"logo");
		array_push($response, $manufacturers);
	}
	echo json_encode($response);
}