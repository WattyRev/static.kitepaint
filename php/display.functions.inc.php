<?php
 
#### Display Functions ####

function activate_error() {
  $content = (object) array(
      'activated' => false
  );
  echo json_encode($content);
}

function activate_success() {
  $content = (object) array(
      'activated' => true
  );
  echo json_encode($content);
}

function bad_login($message) {
  $content = (object) array(
    'logged_in' => false,
    'message' => $message
  );
  echo json_encode($content);
}

function change_password_error($message) {
  $content = (object) array(
      'changed' => false,
      'message' => $message
  );

  echo json_encode($content);
}

function change_password_success() {
  $content = (object) array(
      'changed' => true
  );

  echo json_encode($content);
}

function change_email_error($message) {
  $content = (object) array(
      'changed' => false,
      'message' => $message
  );

  echo json_encode($content);
}

function change_email_success() {
  $content = (object) array(
      'changed' => true
  );

  echo json_encode($content);
}

function delete_account_error($message) {
  $content = (object) array(
      'changed' => false,
      'message' => $message
  );

  echo json_encode($content);
}

function delete_account_success() {
  $content = (object) array(
      'changed' => true
  );

  echo json_encode($content);
}

function lost_password_error($message) {
  $content = (object) array(
    'reset' => false,
    'message' => $message
  );

  echo json_encode($content);
}

function lost_password_success() {
  $content = (object) array(
    'reset' => true
  );

  echo json_encode($content);
}

function register_error($message) {
  $content = (object) array(
    'registered' => false,
    'message' => $message
  );
  
  echo json_encode($content);
}

function register_success() {
  $content = (object) array(
    'registered' => true
  );

  echo json_encode($content);
}

function return_user() {
  // retrieve the session information
  $u = $_SESSION['username'];
  $uid = $_SESSION['loginid'];
  $content = (object) array(
    'username' => $_SESSION['username'],
    'user_id' => $_SESSION['loginid'],
    'actcode' => $_SESSION['actcode'],
    'email' => $_SESSION['email'],
    'favorites' => $_SESSION['favorites'],
    'first_name' => $_SESSION['first_name'],
    'last_name' => $_SESSION['last_name'],
    'logged_in' => true
  );
  echo json_encode($content);
}
 
?>