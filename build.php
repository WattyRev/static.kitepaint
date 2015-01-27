<?php
require "JSMin.php";

process_js();
process_css();

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

function minify_css($buffer) {
	// Remove comments
	$buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);

	// Remove space after colons
	$buffer = str_replace(': ', ':', $buffer);

	// Remove whitespace
	$buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);

	// Write everything out
	return $buffer;
}

function process_css() {
	$css_files = json_decode(file_get_contents("dependencies.json"), true)["development"]["css"];
	$layout_css = $css_files['layout'];
	$page_css = $css_files['pages'];

	function write_files($directory, $name, $files) {
		$output_location = "css/min/$directory/$name.css";

		if (!file_exists("css/min/$directory")) {
			mkdir("css/min/$directory", 0777, true);
		}

		$destination = fopen($output_location, "w") or die("Unable to open file!");

		$content = "";
		foreach ($files as $file) {
			if($file){
				$content .= file_get_contents("css/".$file) . "\n";
			} else {
				echo "$directory/$name - $file";
			}
		}

		$content = minify_css($content);

		fwrite($destination, $content);
		fclose($destination);
	}

	foreach($layout_css as $name => $files) {
		write_files('layout', $name, $files);
	}

	foreach ($page_css as $directory => $files) {
		foreach($files as $name => $files) {
			write_files($directory, $name, $files);
		}
	}
}