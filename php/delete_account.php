<?php
 
require_once "header.php";
$response = delete_account($_POST['id'], $_POST['password']);
if ($response->valid) {

  delete_account_success();

} else {
   
  delete_account_error($response->message);

}
 
?>