app.controller("DesignsController", [
    "$scope",
    "$rootScope",
    "$sce",
    function(scope, root, sce) {
        //Variables
        scope.designs = []; //raw designs data
        scope.display_designs = []; //designs data displayed
        scope.filtered_designs = []; //filtered designs
        scope.loading = false; //display loading text
        scope.query = ""; //search query
        scope.search = "name"; //search parameter
        scope.num_display = 20; //number of designs to display
        scope.sort = {
            //sorting setting
            metric: "created",
            ascending: false
        };
        scope.show_edit = false;
        scope.editing = {};

        //Functions

        //retrieve designs data
        scope.get_designs = function() {
            scope.loading = true;
            var content = {
                return: [
                    "id",
                    "created",
                    "updated",
                    "name",
                    "user",
                    "product",
                    "status",
                    "active",
                    "variations"
                ]
            };
            $.ajax({
                type: "GET",
                url: "php/designs.php",
                data: content,
                dataType: "json",
                success: function(data) {
                    scope.designs = data;
                    $.each(scope.designs, function(i, design) {
                        design.variations = JSON.parse(design.variations);

                        $.each(design.variations, function(i, variation) {
                            if (variation.primary) {
                                design.primary_variation = variation;
                                design.primary_variation.svg = sce.trustAsHtml(
                                    design.primary_variation.svg
                                );
                            }
                        });
                        design.status = parseInt(design.status);
                        design.active = design.active !== "0";
                    });
                    scope.filtered_designs = data;
                    scope.loading = false;
                    scope.sort_designs();
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    alert("Could not get designs");
                }
            });
        };
        scope.get_designs();

        //Filter designs based on search using query
        scope.filter = function() {
            scope.filtered_designs = [];
            $.each(scope.designs, function(i, design) {
                if (design[scope.search].indexOf(scope.query) > -1) {
                    scope.filtered_designs.push(design);
                }
            });
            scope.sort_designs();
        };

        //Put the first X num of designs into the displayed table
        scope.update_designs = function() {
            scope.display_designs = [];
            for (
                var i = 0;
                i < scope.num_display && i < scope.filtered_designs.length;
                i++
            ) {
                scope.display_designs.push(scope.filtered_designs[i]);
            }
        };

        //sort array of designs
        scope.sort_designs = function() {
            scope.filtered_designs.sort(function(a, b) {
                var metric = scope.sort.metric;
                var a_ = a[metric],
                    b_ = b[metric];
                if (metric === "created" || metric === "updated") {
                    a_ = new Date(a_);
                    b_ = new Date(b_);
                }
                if (scope.sort.ascending) {
                    if (a_ < b_) return -1;
                    if (a_ > b_) return 1;
                    return 0;
                } else {
                    if (a_ < b_) return 1;
                    if (a_ > b_) return -1;
                    return 0;
                }
            });
            scope.update_designs();
        };

        //set sorting parameters
        scope.sort_by = function(metric) {
            if (scope.sort.metric === metric) {
                scope.sort.ascending = !scope.sort.ascending;
            } else {
                scope.sort.metric = metric;
                if (metric === "created" || metric === "updated") {
                    scope.sort.ascending = false;
                } else {
                    scope.sort.ascending = true;
                }
            }
            scope.sort_designs();
        };

        //show more rows of designs
        scope.show_more = function() {
            scope.num_display += 20;
            scope.sort_designs();
        };

        //set editing design and show edit design lightbox
        scope.edit_design = function(design) {
            scope.editing = JSON.parse(JSON.stringify(design));
            scope.show_edit = true;
        };

        //perform ajax post to save design data
        scope.save_design = function(design) {
            $.ajax({
                type: "POST",
                url: "php/designs.php",
                data: design,
                dataType: "json",
                success: function(data) {
                    scope.get_designs();
                    scope.show_edit = false;
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    scope.get_designs();
                    alert("Could not save design");
                }
            });
        };

        //delete a design
        scope.delete_design = function(design) {
            var confirmed = confirm(
                "Are you sure you want to delete " + design.name + "?"
            );
            if (confirmed) {
                $.ajax({
                    type: "POST",
                    url: "php/designs.php",
                    data: { id: design.id, delete: true },
                    dataType: "json",
                    success: function(data) {
                        scope.get_designs();
                        scope.show_edit = false;
                        scope.$apply();
                    },
                    error: function(data) {
                        console.log("error", data);
                        scope.get_designs();
                        alert("Could not delete design");
                    }
                });
            }
        };
    }
]);
