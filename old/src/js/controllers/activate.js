app.controller("ActivateController", [
    "$scope",
    "$rootScope",
    "$location",
    function(scope, root, location) {
        //VARIABLES
        scope.activated = "activating";
        scope.activate_data = {
            uid: location.search().uid,
            actcode: location.search().actcode
        };
        root.has_account = true;

        //FUNCTIONS
        scope.activate = function() {
            $.ajax({
                type: "POST",
                url: app.apiDomain + "activate.php",
                data: scope.activate_data,
                dataType: "json",
                success: function(data) {
                    if (data.activated) {
                        scope.activated = "activated";
                    } else {
                        scope.activated = "invalid";
                    }
                    root.done(1);
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    scope.activated = "invalid";
                    root.done(1);
                    scope.$apply();
                }
            });
        };
        scope.activate();
    }
]);
