app.controller("ViewController", [
    "$scope",
    "$rootScope",
    "$location",
    "$state",
    function(scope, root, location, state) {
        scope.product = {};
        scope.design = {};
        scope.variations = [];
        scope.show_settings = false;
        scope.show_outlines = true;
        scope.background = "";
        scope.user = {};
        scope.staticDomain = app.staticDomain;

        //FUNCTIONS
        scope.get_product = function() {
            var id = scope.design.product;

            $.ajax({
                type: "GET",
                url: app.apiDomain + "products.php?id=" + id,
                dataType: "json",
                success: function(data) {
                    scope.product = data[0];
                    scope.colors = JSON.parse(scope.product.colors);
                    scope.determine_color_pallets();
                    scope.get_manufacturer();
                    root.done(3);
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not get product");
                    root.done(3);
                    scope.$apply();
                }
            });
        };

        scope.get_manufacturer = function() {
            $.ajax({
                type: "GET",
                url:
                    app.apiDomain +
                    "manufacturers.php?id=" +
                    scope.product.manufacturer,
                dataType: "json",
                success: function(data) {
                    scope.manufacturer = data[0];
                    root.done(2);
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    alert("Could not get manufacturer");
                    root.done(2);
                    scope.$apply();
                }
            });
        };

        scope.get_user = function() {
            var request = {
                filter: {
                    loginid: scope.design.user
                },
                return: ["username"]
            };
            $.ajax({
                type: "GET",
                url: app.apiDomain + "users.php",
                data: request,
                dataType: "json",
                success: function(data) {
                    scope.design.user = {
                        id: scope.design.user,
                        username: data[0].username
                    };
                    root.done(3);
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not get user");
                    root.done(3);
                    scope.$apply();
                }
            });
        };

        scope.determine_color_pallets = function() {
            var variations = scope.variations;
            var colorOptions = scope.colors;
            variations.forEach(function(variation) {
                // Get all the colors used in the variation
                var fillMatches = variation.svg.match(
                    /\sfill="[a-zA-Z0-9#\(\)\s]*"/g
                );
                fillMatches = fillMatches.map(function(match) {
                    return match.split('"')[1];
                });
                fillMatches = fillMatches.reduce(function(dedup, match) {
                    if (dedup.indexOf(match) > -1) {
                        return dedup;
                    }
                    dedup.push(match);
                    return dedup;
                }, []);

                var colorsUsed = fillMatches.map(function(match) {
                    var colorDetails = colorOptions.find(function(colorOption) {
                        if (!match || !colorOption.color) {
                            return false;
                        }
                        return (
                            colorOption.color.toLowerCase() ===
                            match.toLowerCase()
                        );
                    });
                    if (colorDetails) {
                        return colorDetails;
                    }
                    return {
                        name: match,
                        color: match
                    };
                });
                variation.colorsUsed = colorsUsed;
            });
        };

        scope.get_design = function() {
            $.ajax({
                type: "GET",
                url: app.apiDomain + "designs.php?id=" + location.$$search.id,
                dataType: "json",
                success: function(data) {
                    if (!data.length) {
                        console.log("error: Design does not exist");
                        root.error("Unable to find design");
                        state.go("home");
                        root.$apply();
                    }
                    scope.design = data[0];
                    scope.variations = JSON.parse(scope.design.variations);
                    scope.current_variation = scope.variations[0];
                    scope.status = parseInt(scope.design.status);
                    root.done(3);
                    scope.$apply();
                    if (!scope.status) {
                        scope.authorize_user(scope.design.user);
                    }
                    scope.get_product();
                    scope.get_user();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not get design");
                    root.done(1);
                }
            });
        };
        scope.get_design();

        scope.authorize_user = function(user) {
            if (!root.user || root.user.user_id !== user) {
                root.error("That design is set to private");
                state.go("home");
            }
        };

        scope.select_variation = function(variation) {
            scope.current_variation = {};
            scope.current_variation = variation;
        };

        console.log(scope);

        //Close dropdown when clicking out of it
        $(document).click(function(e) {
            var elem = $(e.target);
            if (
                !elem.parents(".settings-button").length &&
                !elem.hasClass("settings-button") &&
                scope.show_settings
            ) {
                scope.show_settings = false;
                scope.$apply();
            }
        });
    }
]);
