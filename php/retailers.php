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

	if(isset($_POST['login'])) {

		$username = $_POST['username'];
		$password = $_POST['password'];
		if(!valid_username($username) || !valid_password($password) || !retailer_exists($username)) {
			$response->valid = false;
			$response->message = 'Invalid username or password';
			echo json_encode($response);
			return;
		}
		$query = sprintf("
			SELECT id
			FROM retailers
			WHERE
			username = '%s' AND password = '%s'
			AND disabled = 0 AND activated = 1
			LIMIT 1;", mysql_real_escape_string($username), mysql_real_escape_string(sha1($password . $seed)));
		$result = mysql_query($query);

		if (mysql_num_rows($result) != 1) {
			$response->valid = false;
			$response->message = 'Invalid username or password';
			echo json_encode($response);
			return;
		} else {

			//get some data
			$row = mysql_fetch_array($result);
			$retailer = array();
			$retailer['id'] = $row['id'];

			$get = array(
				'actcode',
				'name',
				'first_name',
				'last_name',
				'username',
				'url',
				'city',
				'state',
				'email',
				'phone',
				'image',
				'product_opt_out',
				'product_urls'
			);

			foreach($get as $metric) {
				$query = sprintf("
					SELECT  $metric
					FROM retailers
					WHERE
					id = '%s'
					LIMIT 1;", mysql_real_escape_string($retailer['id']));
				$result = mysql_query($query);
				$row = mysql_fetch_array($result);
				$retailer[$metric] = $row[$metric];
			}
			
			$response->message = $retailer;
			echo json_encode($response);
			return;
		}

		return;
	}

	if(isset($_POST['reset_password'])) {
		$username = $_POST['username'];
		$email = $_POST['email'];

		$query = sprintf("
			SELECT email
			FROM retailers
			WHERE username = '%s'
			LIMIT 1;", mysql_real_escape_string($username));
		$result = mysql_fetch_array(mysql_query($query))['email'];
		if($result === $email) {
			$response->valid = true;
		} else {
			$response->valid = false;
			$response->message = 'Could not find a user with that username and email.';
			echo json_encode($response);
			return;
		}

		$password = generate_code(10);
		$query = sprintf("
			UPDATE retailers
			SET password = '%s'
			WHERE username = '%s'",
			mysql_real_escape_string(sha1($password)),
			mysql_real_escape_string($username));
		if(!mysql_query($query)) {
			$response->valid = false;
			$response->message = 'Unable to reset password';
			echo json_encode($response);
			return;
		}
		if(!sendLostPasswordEmailRetailer($username, $email, $password, true)) {
			$response->valid = false;
			$response->message = 'Unable to send email';
		}
		echo json_encode($response);
		return;
	}

	if(isset($_POST['get_username'])){
		$email = $_POST['email'];

		$query = sprintf("
			SELECT username
			FROM retailers
			WHERE email = '%s'
			LIMIT 1;", mysql_real_escape_string($email));
		$result = mysql_fetch_array(mysql_query($query))['username'];

		if(!$result) {
			$response->valid = false;
			$response->message = 'Unable to find username';
			echo json_encode($response);
			return;
		}
		if(!sendLostRetailerUsername($result, $email)) {
			$response->valid = false;
			$response->message = 'Unable to send username';
		}
		echo json_encode($response);
		return;
	}

	if(isset($_POST['check_user'])) {
		$id = $_POST['id'];
		$actcode = $_POST['actcode'];

		$query = sprintf("
			SELECT actcode
			FROM retailers
			WHERE
			id = '%s'
			LIMIT 1;", mysql_real_escape_string($id));
		$result = mysql_fetch_array(mysql_query($query))['actcode'];
		if($result === $actcode) {
			$response->valid = true;
		} else {
			$response->valid = false;
			$response->message = 'Not a valid user';
		}
		echo json_encode($response);
		return;
	}

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