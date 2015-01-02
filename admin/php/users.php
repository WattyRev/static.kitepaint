<?php 
require_once "header.php"; 
if ($_GET){
	$query = sprintf("SELECT * FROM login");
	 
	$result = mysql_query($query);
	$num = mysql_num_rows($result);
	mysql_close();
	$response = array();
	for ($i = 0; $i < $num; $i++) {
		$user = (object) array();
		$user->loginid = mysql_result($result,$i,"loginid");
		$user->username = mysql_result($result,$i,"username");
		$user->email = mysql_result($result,$i,"email");
		$user->create_time = date("m/d/Y", strtotime(mysql_result($result,$i,"create_time")));
		$user->last_login = date("m/d/Y", strtotime(mysql_result($result,$i,"last_login")));
		$user->favorites = mysql_result($result,$i,"favorites");
		$user->activated = mysql_result($result,$i,"activated") === '1' ? true : false; 
		array_push($response, $user);
	}
	echo json_encode($response);
} elseif ($_POST) {
	$response = (object) array(
		'valid' => true,
		'message' => ''
	);

	//Delete
	if (isset($_POST['delete'])) {
		$query = sprintf("delete from login where loginid = '%s'", 
			mysql_real_escape_string($_POST['loginid']));

		if (mysql_query($query)) {

		} else {
			$response->valid = false;
			$response->message = 'Unable to delete user';
		}

		echo json_encode($response);

		return;
	}

	//Create
	if (isset($_POST['new'])) {

		$username = $_POST['username'];
		$password = generate_code(8);
		$email = $_POST['email'];


		if (!valid_username($username)) {
			$response->valid = false;
			$response->message = 'Invalid username';
			echo json_encode($response);
			return;
		} elseif (!valid_email($email)) {
			$response->valid = false;
			$response->message = 'Invalid email';
			echo json_encode($response);
			return;
		} elseif (user_exists($username)) {
			$response->valid = false;
			$response->message = $username . ' has already been taken';
			echo json_encode($response);
			return;
		}
		$code = generate_code(20);
		$sql = sprintf("insert into login (username,password,email,actcode,create_time,last_login,activated) value ('%s','%s','%s','%s', now(), now(), 1)",
		mysql_real_escape_string($username), mysql_real_escape_string(sha1($password . $seed))
		, mysql_real_escape_string($email), mysql_real_escape_string($code));
		
		
		if (mysql_query($sql)) {
			$id = mysql_insert_id();

			if (sendAccountInfo($username, $password, $email)) {
				echo json_encode($response);
				return;
			} else {
				$response->valid = false;
				$response->message = 'Unable to send activation email';
				echo json_encode($response);
				return;
			}
		
		} else {
			$response->valid = false;
			$response->message = 'Unable to register';
			echo json_encode($response);
			return;
		}
	}

	//Reset Password
	if (isset($_POST['reset'])) {
		global $seed;
		
		$id = $_POST['loginid'];
		$username = $_POST['username'];
		$email = $_POST['email'];

		$query = sprintf("select loginid from login where loginid = '%s' limit 1",
			$id);
		
		$result = mysql_query($query);
		
		if (mysql_num_rows($result) != 1) {
			$response->valid = false;
			$response->message = 'Incorrect user or email address';
			echo json_encode($response);
			return;
		}
		
		
		$newpass = generate_code(8);
		
		$query = sprintf("update login set password = '%s' where username = '%s'",
		    mysql_real_escape_string(sha1($newpass.$seed)), mysql_real_escape_string($username));
		
		if (mysql_query($query)) {
		
			if (sendLostPasswordEmail($username, $email, $newpass)) {
				return $response;
			} else {
				$response->valid = false;
				$response->message = 'Unable to send lost password email';
				echo json_encode($response);
				return;
			}
		
		} else {
			$response->valid = false;
			$response->message = 'Unable to reset password';
			echo json_encode($response);
			return;
		} 
		echo json_encode($response);
		return;
	}

	//Update
	$id = $_POST['loginid'];
	$vars = array(
		'username' => $_POST['username'],
		'email' => $_POST['email'],
		'activated' => $_POST['activated'] === 'true' ? '1' : '0'
	);

	foreach($vars as $metric => $val){
		$query = sprintf("update login set $metric = '%s' where loginid = '%s'",
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