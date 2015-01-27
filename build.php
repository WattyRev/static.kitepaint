<?php
require "JSMin.php";

process_js();

function process_js() {
	$destination = fopen("js/app.min.js", "w") or die("Unable to open file!");

	$files = json_decode(file_get_contents("dependencies.json"), true)["process"]["js"];

	$content = "";
	foreach ($files as $file) {
		$content .= file_get_contents("js/".$file) . "\n";
	}

	$content = JSMIN::minify($content);
	
	fwrite($destination, $content);
	fclose($destination);
}