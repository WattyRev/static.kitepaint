<?php 
	//Determine if using an embed url//
	
	$embed = isset($_GET['embed']) && isset($_GET['id']);
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

		<?php if ($embed) :?>
			<script type="text/javascript">
				var embed = true;
				var product = <?php echo $_GET['id']; ?>;
			</script>
		<?php else:?>
			<script type="text/javascript">
				var embed = false;
			</script>
		<?php endif;?>

		<script type="text/javascript" src="js/libraries/jquery.min.js"></script>
		<script type="text/javascript" src="js/modernizr.js"></script>
		<script type="text/javascript" src="js/libraries/angular.min.js"></script>
		<script type="text/javascript" src="js/libraries/angular-ui-router.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<script type="text/javascript" src="js/controllers/about.js"></script>
		<script type="text/javascript" src="js/controllers/activate.js"></script>
		<script type="text/javascript" src="js/controllers/account.js"></script>
		<script type="text/javascript" src="js/controllers/changePassword.js"></script>
		<script type="text/javascript" src="js/controllers/contact.js"></script>
		<script type="text/javascript" src="js/controllers/create.js"></script>
		<script type="text/javascript" src="js/controllers/designs.js"></script>
		<script type="text/javascript" src="js/controllers/edit.js"></script>
		<script type="text/javascript" src="js/controllers/header.js"></script>
		<script type="text/javascript" src="js/controllers/home.js"></script>
		<script type="text/javascript" src="js/controllers/manufacturer.js"></script>
		<script type="text/javascript" src="js/controllers/primary.js"></script>
		<script type="text/javascript" src="js/controllers/retailer.js"></script>
		<script type="text/javascript" src="js/controllers/view.js"></script>
		<script type="text/javascript" src="js/directives/compile.js"></script>
		<script type="text/javascript" src="js/directives/alert.js"></script>
		<script type="text/javascript" src="js/directives/menu.js"></script>
		<script type="text/javascript" src="js/directives/share.js"></script>
		<script type="text/javascript" src="js/directives/tooltip.js"></script>
		<script type="text/javascript" src="js/directives/loading.js"></script>

		<link rel="stylesheet" href="css/style.css" />
		<?php if(!isset($_COOKIE['desktop'])): ?>
			<link rel="stylesheet" href="css/responsive.css" />
		<?php endif; ?>

		<!--[if IE 9]>
			<link rel="stylesheet" href="css/style.ie9.css" />
		<![endif]-->

		<?php 
			$ua = $_SERVER['HTTP_USER_AGENT'];
			$safariorchrome = strpos($ua, 'Safari') ? true : false;   
			$chrome = strpos($ua, 'Chrome') ? true : false;    
			if($safariorchrome == true AND $chrome == false){ $safari = true; }

			// Check for version numbers 
			$v5 = strpos($ua, 'Version/5.') ? true : false;

			// Test versions of Safari
			if($safari AND $v5){ 
				echo '<link rel="stylesheet" href="css/style.ie9.css" />'; 
			}
		?>

		<?php if ($embed) :?>
			<link rel="stylesheet" href="css/embed.css" />
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

			<?php if(!isset($_COOKIE['desktop'])): ?>
				<button class="mobile" ng-click="$root.request_desktop_version();">Request Desktop Version</button>
			<?php else:?>
				<button ng-click="$root.return_mobile_version();">Return to Mobile Version</button>
			<?php endif;?>
			<?php if ($embed) :?>
				<p>Powered by <a target="_blank" href="http://www.kitepaint.com">KitePaint.com</a></p>
			<?php else:?>
				<p>&copy; 2014 <a href="http://www.wattydev.com">Spencer Watson</a></p>
			<?php endif;?>
		</footer>
	</body>
</html>