<!DOCTYPE html>
<html ng-app="kitePaint">
	<head>
		<title>Kite Paint</title>

		<?php if(!isset($_COOKIE['desktop'])): ?>
			<meta name="viewport" content="width=device-width">
		<?php else:?>
			<meta name="viewport" content="width=1080px">
		<?php endif;?>

		<script type="text/javascript" src="js/libraries/jquery.min.js"></script>
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

		<link rel="stylesheet" href="css/style.css" />
		<?php if(!isset($_COOKIE['desktop'])): ?>
			<link rel="stylesheet" href="css/responsive.css" />
		<?php endif; ?>
	</head>
	<body ng-controller="PrimaryController">
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
		<main ui-view id="{{current_page.name}}">
			
		</main>
		<alert></alert>
		<footer>

			<?php if(!isset($_COOKIE['desktop'])): ?>
				<button class="mobile" ng-click="$root.request_desktop_version();">Request Desktop Version</button>
			<?php else:?>
				<button ng-click="$root.return_mobile_version();">Return to Mobile Version</button>
			<?php endif;?>
			<p>&copy; 2014 <a href="http://www.wattydev.com">Spencer Watson</a></p>
		</footer>
	</body>
</html>