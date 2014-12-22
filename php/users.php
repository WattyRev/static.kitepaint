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
		$query = sprintf("SELECT * FROM login WHERE $filter $order $limit");

		$result = mysql_query($query);
		$num = mysql_num_rows($result);
		mysql_close();
		$response = array();
		for ($i = 0; $i < $num; $i++) {
			$users = (object) array();
			foreach ($_GET['return'] as $key=>$metric){
				$users->$metric = mysql_result($result,$i,$metric);
				if ($metric === 'last_login' || $metric === 'create_time' || $metric === 'deleted_time') {
					$users->$metric = date("m/d/Y", strtotime($users->$metric));
				}
			}
			array_push($response, $users);
		}
		echo JSON_encode($response);
		return;
	}
}