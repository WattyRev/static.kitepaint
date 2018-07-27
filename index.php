<?php
	//Determine if using an embed url//

	$embed = isset($_GET['embed']) && isset($_GET['id']);

	//Get dependencies
	if ($_SERVER['SERVER_NAME'] === 'kitepaint.com') {
		$environment = 'production';
	} else {
		$environment = 'development';
	}
	$js_files = json_decode(file_get_contents("dependencies.json"), true)[$environment]["js"];
	$css_files = json_decode(file_get_contents("dependencies.json"), true)[$environment]["css"]["layout"];
	$dependencies = file_get_contents("dependencies.json");
?>
<!DOCTYPE html>
<html ng-app="kitePaint">
	<head>
		<title>Kite Paint</title>

		<?php if(!isset($_COOKIE['desktop'])): ?>
			<meta name="viewport" content="width=device-width">
		<?php else:?>
			<meta name="viewport" content="width=1080px">
		<?php endif;?>

		<?php if ($environment === 'development'):?>
			<meta name="robots" content="noindex">
		<?php endif;?>
		<link rel="shortcut icon" href="img/favicon.ico" />

		<!-- Scripts -->
			<?php if ($embed) :?>
				<script type="text/javascript">
					var embed = true;
					var thirdPartyCssUrl = '<?php echo $_GET['css-url']; ?>';
					var product = <?php echo $_GET['id']; ?>;
					var retailer = <?php echo empty($_GET['retailer']) ? '""' : $_GET['retailer'];?>;
					var defaultBackground = <?php echo empty($_GET['default-background-id']) ? 0 : $_GET['default-background-id']; ?>;
				</script>
			<?php else:?>
				<script type="text/javascript">
					var embed = false;
				</script>
			<?php endif;?>

			<script type="text/javascript">
				var dependencies = <?php echo $dependencies ?>;
				var environment = '<?php echo $environment ?>';
			</script>

			<?php if ($environment === 'production'):?>
				<!-- Google Analytics -->
				<script>
				  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

				  ga('create', 'UA-59061299-1', 'auto');
				  //ga('send', 'pageview');

				</script>
			<?php endif;?>

		<!-- JavaScript Files -->
			<?php foreach($js_files as $file):?>
				<script type="text/javascript" src="js/<?php echo $file ?>"></script>
			<?php endforeach;?>

		<!-- StyleSheets -->
			<?php foreach($css_files['main'] as $file):?>
				<link rel="stylesheet" href="css/<?php echo $file ?>" />
			<?php endforeach;?>

			<?php if(!isset($_COOKIE['desktop'])):
				foreach($css_files['responsive'] as $file): ?>
					<link rel="stylesheet" href="css/<?php echo $file ?>" />
				<?php endforeach;
			endif; ?>

			<!--[if IE 9]>
				<?php foreach($css_files['legacy'] as $css):?>
				<link rel="stylesheet" href="css/<?php echo $css ?>" />
				<?php endforeach;?>
			<![endif]-->

			<?php
				$ua = $_SERVER['HTTP_USER_AGENT'];
				$safariorchrome = strpos($ua, 'Safari') ? true : false;
				$chrome = strpos($ua, 'Chrome') ? true : false;
				if($safariorchrome == true AND $chrome == false){
					$safari = true;
				} else {
					$safari = false;
				}

				// Check for version numbers
				$v5 = strpos($ua, 'Version/5.') ? true : false;

				// Test versions of Safari
				if($safari AND $v5){
					foreach($css_files['legacy'] as $css):
						echo '<link rel="stylesheet" href="css/' , $css , '" />';
					endforeach;
				}
			?>

			<?php if ($embed) :
				foreach($css_files['embed'] as $css):?>
					<link rel="stylesheet" href="css/<?php echo $css ?>" />
				<?php endforeach;?>
				<script type="text/javascript">
					var embed = true;
				</script>
			<?php endif;?>
	</head>
	<body id="body" ng-controller="PrimaryController">

		<noscript>
			<div>
				<h1>JavaScript Disabled</h1>
				<p>It seems that your browser either does not support JavaScript, or has JavaScript disabled. This site relies on the use of JavaScript to function. <a target="_blank" href="http://www.enable-javascript.com/">Click Here</a> for instructions on how to enable JavaScript.</p>
			</div>
		</noscript>
		<!-- Scripts -->
			<!-- Facebook -->
			<div id="fb-root"></div>
			<script>
				window.fbAsyncInit = function() {
					FB.init({
						appId      : '410377042472586',
						xfbml      : true,
						version    : 'v2.2'
					});
				};
				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
		    </script>

			<!-- Twitter -->
		    <script type="text/javascript" async src="//platform.twitter.com/widgets.js"></script>
		<!-- /Scripts -->
		<?php if (!$embed):?>
			<header ng-controller="HeaderController">
				<div class="container">
					<h1><a ui-sref="home">Kite Paint</a></h1>
					<a ui-sref="create" class="button left">Create</a>
					<div class="right">
						<span class="logged-in" ng-show="$root.user">Welcome {{user.username}}!</span>
						<menu></menu>
					</line>
					<div class="clearfix"></div>
				</div>
			</header>
		<?php endif;?>
		<main ui-view id="{{current_page.name}}" ng-class="{loading: $root.loading}">

		</main>
		<loading ng-show="$root.loading"></loading>
		<alert></alert>
		<footer>

			<?php if(!isset($_COOKIE['desktop']) && !$embed): ?>
				<button class="mobile" ng-click="$root.request_desktop_version();">Request Desktop Version</button>
			<?php elseif(!$embed):?>
				<button ng-click="$root.return_mobile_version();">Return to Mobile Version</button>
			<?php endif;?>
			<?php if ($embed) :?>
				<p>Powered by <a target="_blank" href="https://www.kitepaint.com">KitePaint.com</a></p>
			<?php else:?>
				<p>&copy; 2014 <a href="http://www.wattydev.com">Spencer Watson</a></p>
			<?php endif;?>
		</footer>
	</body>
</html>
