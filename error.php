<?php 
if (isset($_GET['m'])) {
	$error_code = $_GET['m'];
} else {
	$error_code = '';
}

if ($error_code === 'embedding_prohibited') {
	$message = 'Embedding of KitePaint.com is prohibited.';
} else if ($error_code === 'bad_embed_domain') {
	$message = 'This site does not have permission to embed this page.';
} else if ($error_code === 'cannot_verify_embed_domain') {
	$message = 'Unable to verify embed permission. Please notify KitePaint.com administration if this issue continues to happen.';
} else if ($error_code === 'bed_embed_url') {
	$message = 'Invalid src url for iFrame embed.'
} else {
	$message = 'Unknown error ocurred';
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Error</title>
		<link rel="stylesheet" href="css/style.css" />
	</head>
	<body>
		<h1><?php echo $message ?></h1>
	</body>
</html>