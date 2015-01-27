<?php

process_js();

function process_js() {
	$destination = fopen("js/app.min.js", "w") or die("Unable to open file!");
	$content = 'test';
	fwrite($destination, $content);
	fclose($myfile);
}