<?php 
require_once "header.php"; 

if ($_GET) {
	$filter = "";
	if (isset($_GET['filter'])){
		$filter .= "WHERE ";
		$count = 0;
		foreach($_GET['filter'] as $metric => $value){
			$count ++;
			if ($count > 1) {
				$filter .= ' AND ';
			}
			$filter .= "$metric  =  $value";
		}
	}
	$limit = isset($_GET['limit']) ? "LIMIT " . $_GET['limit'] : "";
	$order = isset($_GET['order']) ? "ORDER BY " . $_GET['order'][0] . " " . $_GET['order'][1] : "";
	$query = sprintf("SELECT * FROM retailers $filter $order $limit");

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
if ($_POST) {
	global $seed;
	$response = (object) array();
	$response->valid = true;
	if(isset($_POST['action'])) {
		if($_POST['action'] === 'info') {
			$id = $_POST['id'];
			$vars = array();
			$vars['first_name'] = $_POST['first_name'];
			$vars['last_name'] = $_POST['last_name'];
			$vars['name'] = $_POST['name'];
			$vars['username'] = $_POST['username'];
			$vars['password'] = $_POST['password'];
			$vars['email'] = $_POST['email'];
			$vars['phone'] = $_POST['phone'];
			$vars['city'] = $_POST['city'];
			$vars['state'] = $_POST['state'];
			$vars['url'] = $_POST['url'];
			//validation
			if(!valid_username($vars['username'])) {
				$response->valid = false;
				$response->message = 'Invalid username';
				echo json_encode($response);
				return;
			} else if(!valid_password($vars['password'])) {
				$response->valid = false;
				$response->message = 'Invalid password';
				echo json_encode($response);
				return;
			} else if(!valid_email($vars['email'])) {
				$response->valid = false;
				$response->message = 'Invalid email';
				echo json_encode($response);
				return;
			} else if($vars['password'] != $_POST['confirm_password']) {
				$response->valid = false;
				$response->message = 'Passwords do not match';
				echo json_encode($response);
				return;
			} else if(retailer_exists($vars['username'])) {
				$response->valid = false;
				$response->message = $vars['username'] . ' has already been taken';
				echo json_encode($response);
				return;
			}

			foreach($vars as $metric => $val){
				if ($metric === 'password') {
					$query = sprintf("update retailers set $metric = '%s' where id = '%s'",
						mysql_real_escape_string(sha1($val . $seed)), mysql_real_escape_string($id));
				} else {
					$query = sprintf("update retailers set $metric = '%s' where id = '%s'",
						mysql_real_escape_string($val), mysql_real_escape_string($id));
				}

				if (mysql_query($query)) {
				} else {
					$response->valid = false;
					$response->message = 'Unable to change ' . $metric;
				}
			}
			$query = sprintf("update retailers set updated = now() where id = '%s'",
			mysql_real_escape_string($id));
			$query = sprintf("update retailers set activated = 1 where id = '%s'",
			mysql_real_escape_string($id));

			if (mysql_query($query)) {
			} else {
				$response->valid = false;
				$response->message = 'Unable to change updated';
			}
			echo json_encode($response);
			return;
		}
	}
}