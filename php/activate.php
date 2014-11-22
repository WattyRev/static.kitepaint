<?php
 
require_once "header.php";
 
$uid = (int)htmlentities(strip_tags($_POST['uid']));
$actcode = htmlentities(strip_tags($_POST['actcode']));
 
if (activateUser($uid, $actcode) == true)
{
	activate_success();
} else
{
	activate_error();
}
?>
