<?php 
	//Get dependencies
	if ($_SERVER['SERVER_NAME'] === 'kitepaint.com') {
		$environment = 'production';
	} else {
		$environment = 'development';
	}
?>
<!DOCTYPE html>
<html ng-app="kitePaintRetailers">
	<head>
		<title>Retailers Portal - Kite Paint</title>

		<?php if(!isset($_COOKIE['desktop'])): ?>
			<meta name="viewport" content="width=device-width">
		<?php else:?>
			<meta name="viewport" content="width=1080px">
		<?php endif;?>
		<meta name="robots" content="noindex">
		<link rel="shortcut icon" href="../img/favicon.ico" />
		
		<!-- Scripts -->
			<script type="text/javascript">
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
			<script type="text/javascript" src="../js/libraries/jquery.min.js"></script>
			<script type="text/javascript" src="../js/modernizr.js"></script>
			<script type="text/javascript" src="../js/libraries/angular.min.js"></script>
			<script type="text/javascript" src="../js/libraries/angular-ui-router.js"></script>
			<script type="text/javascript" src="../js/libraries/ui-router-styles.js"></script>
			<script type="text/javascript" src="../js/libraries/canvg.js"></script>
			<script type="text/javascript" src="js/app.js"></script>
			<script type="text/javascript" src="js/controllers/primary.js"></script>
			<script type="text/javascript" src="js/controllers/nav.js"></script>
			<script type="text/javascript" src="js/controllers/login.js"></script>
			<script type="text/javascript" src="js/controllers/activate.js"></script>
			<script type="text/javascript" src="js/controllers/orders.js"></script>
			<script type="text/javascript" src="js/controllers/embeds.js"></script>
			<script type="text/javascript" src="js/controllers/account.js"></script>
			<script type="text/javascript" src="js/controllers/support.js"></script>
			<script type="text/javascript" src="js/directives/logo.js"></script>
			<script type="text/javascript" src="js/directives/state_options.js"></script>
			<script type="text/javascript" src="js/directives/alert.js"></script>
			<script type="text/javascript" src="js/directives/tooltip.js"></script>

		<!-- StyleSheets -->
			<link rel="stylesheet" href="css/layout/style.css" />
			<link rel="stylesheet" href="css/sections/tooltip.css" />
			<link rel="stylesheet" href="css/sections/alert.css" />

			<?php if(!isset($_COOKIE['desktop'])): ?>
				<link rel="stylesheet" href="css/layout/responsive.css" />
				<link rel="stylesheet" href="css/sections/tooltip.responsive.css" />
			<?php 	endif; ?>

			<!--[if IE 9]>
				<link rel="stylesheet" href="css/legacy.css" />
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
					echo '<link rel="stylesheet" href="css/legacy.css" />'; 
				}
			?>
	</head>
	<body id="body" ng-controller="PrimaryController">

		<noscript>
			<div>
				<h1>JavaScript Disabled</h1>
				<p>It seems that your browser either does not support JavaScript, or has JavaScript disabled. This site relies on the use of JavaScript to function. <a target="_blank" href="http://www.enable-javascript.com/">Click Here</a> for instructions on how to enable JavaScript.</p>
			</div>
		</noscript>
		<aside>
			<logo></logo>
			<ul>
				<li><a ui-sref="orders" ng-class="{active: 'orders' === current_page.name}">Orders</a></li>
				<li><a ui-sref="embeds" ng-class="{active: 'embeds' === current_page.name}">Embeds</a></li>
				<li><a ui-sref="account" ng-class="{active: 'account' === current_page.name}">Account</a></li>
				<li><a ui-sref="support" ng-class="{active: 'support' === current_page.name}">Support</a></li>
				<li><a ng-click="$root.sign_out()">Sign Out</a></li>
			</ul>
		</aside>
		<main ui-view id="{{current_page.name}}" ng-class="{loading: $root.loading}">
			
		</main>
		<div class="clearfix"></div>
		<loading ng-show="$root.loading"></loading>
		<footer>
			<?php if(!isset($_COOKIE['desktop'])): ?>
				<button class="mobile" ng-click="$root.request_desktop_version();">Request Desktop Version</button>
			<?php else:?>
				<button ng-click="$root.return_mobile_version();">Return to Mobile Version</button>
			<?php endif;?>
			<p>&copy; 2014 <a href="http://www.wattydev.com">Spencer Watson</a></p>
		</footer>
		<alert></alert>
	</body>
</html>