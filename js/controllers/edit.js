app.controller("EditController", [
    "$scope",
    "$rootScope",
    "$location",
    "$state",
    "$sce",
    function(scope, root, location, state, sce) {
        scope.background = "";
        scope.current_color = "#ffffff";
        scope.current_color_style = { "background-color": "#ffffff" };
        scope.colors = [];
        scope.design = {};
        scope.loading = true;
        scope.product = {};
        scope.public = false;
        scope.retailers = [];
        scope.send_retailer = {
            retailer: false,
            first_name: root.user.first_name,
            last_name: root.user.last_name,
            email: root.user.email
        };
        scope.show_outlines = true;
        scope.show_reset = false;
        scope.show_retailers = false;
        scope.show_settings = false;
        scope.variations = [];

        scope.embedded_retailer = false;

        if (window.retailer !== undefined) {
            scope.embedded_retailer = window.retailer;
        }

        window.scope = scope;

        //FUNCTIONS

        /**
         * Retrieve the data for the product
         */
        scope.get_product = function() {
            scope.loading = true;
            var id;
            if (state.params.type === "new") {
                id = location.$$search.id;
            } else {
                id = scope.design.product;
            }
            $.ajax({
                type: "GET",
                url: "php/products.php?id=" + id,
                dataType: "json",
                success: function(data) {
                    scope.product = data[0];
                    //process colors
                    scope.colors = JSON.parse(scope.product.colors);
                    //process notes
                    scope.notes = JSON.parse(scope.product.notes).filter(
                        function(note) {
                            return !!note;
                        }
                    );
                    if (state.params.type === "new") {
                        //process variations
                        scope.variations = JSON.parse(scope.product.variations);
                        $.each(scope.variations, function(i, variation) {
                            scope.send_retailer[variation.name] = true;
                            if (i < 1) {
                                variation.primary = true;
                            } else {
                                variation.primary = false;
                            }
                        });
                        scope.current_variation = scope.variations[0];
                    }
                    scope.loading = false;
                    root.done(1);
                    scope.get_manufacturer();
                    scope.get_retailers();
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not get product");
                    root.done(1);
                    scope.$apply();
                }
            });
        };
        if (state.params.type === "new") {
            scope.get_product();
        }

        /**
         * Retrieve the data for the design
         */
        scope.get_design = function() {
            scope.loading = true;
            $.ajax({
                type: "GET",
                url: "php/designs.php?id=" + location.$$search.id,
                dataType: "json",
                success: function(data) {
                    scope.design = data[0];
                    if (scope.design.active === "0") {
                        root.error("Design does not exist");
                        state.go("home");
                        return;
                    }
                    if (scope.design.user !== root.user.user_id) {
                        var params = { type: "new", id: scope.design.product };
                        state.go("edit", params);
                    }
                    if (scope.design.images) {
                        scope.design.images = JSON.parse(scope.design.images);
                    } else {
                        scope.design.images = {};
                    }
                    scope.variations = JSON.parse(scope.design.variations);
                    scope.current_variation = scope.variations[0];
                    $.each(scope.variations, function(i, variation) {
                        scope.send_retailer[variation.name] = true;
                    });
                    scope.public = scope.design.public === "1" ? true : false;
                    if (root.editing_share) {
                        scope.show_share();
                    }
                    if (root.editing_send_retailer) {
                        scope.show_send_retailer();
                    }
                    scope.$apply();
                    scope.get_product();
                    root.done(2);
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not get design");
                    root.done(1);
                    scope.$apply();
                }
            });
        };
        if (state.params.type === "saved") {
            scope.get_design();
        }

        scope.get_manufacturer = function() {
            $.ajax({
                type: "GET",
                url: "php/manufacturers.php?id=" + scope.product.manufacturer,
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

        /**
         * Retrieve the data for the retailers
         */
        scope.get_retailers = function() {
            var content = {
                filter: {
                    activated: 1
                },
                return: [
                    "id",
                    "name",
                    "city",
                    "state",
                    "email",
                    "image",
                    "url",
                    "product_opt_out",
                    "product_urls"
                ]
            };
            $.ajax({
                type: "GET",
                data: content,
                url: "php/retailers.php",
                dataType: "json",
                success: function(data) {
                    $.each(data, function(i, retailer) {
                        retailer.product_opt_out = JSON.parse(
                            retailer.product_opt_out
                        );
                        retailer.product_urls = JSON.parse(
                            retailer.product_urls
                        );
                        if (
                            retailer.product_opt_out[scope.product.id] === false
                        ) {
                            if (
                                !scope.embedded_retailer ||
                                retailer.id === scope.embedded_retailer
                            ) {
                                scope.retailers.push(retailer);
                            }
                        }
                    });
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                }
            });
        };

        scope.color_panel = function(colors, $event) {
            var panel = $($event.target),
                can_color = true;

            if (colors !== "all") {
                var current_name;

                can_color = false;
                colors = colors.split(", ");

                $.each(scope.colors, function(i, color) {
                    if (color.color === scope.current_color) {
                        current_name = color.name;
                        return false;
                    }
                });

                $.each(colors, function(i, color) {
                    if (current_name === color) {
                        can_color = true;
                        return false;
                    }
                });
            }

            if (can_color) {
                panel.attr("fill", scope.current_color);
                $.each(scope.variations, function(i, variation) {
                    if (variation.name === scope.current_variation.name) {
                        variation.svg = $(".template").html();
                        return false;
                    }
                });
            }
        };

        scope.color_group = function(colors, $event) {
            var group = $($event.target).parents("g"),
                can_color = true;

            if (colors !== "all") {
                var current_name;

                can_color = false;
                colors = colors.split(", ");

                $.each(scope.colors, function(i, color) {
                    if (color.color === scope.current_color) {
                        current_name = color.name;
                        return false;
                    }
                });

                $.each(colors, function(i, color) {
                    if (current_name === color) {
                        can_color = true;
                        return false;
                    }
                });
            }

            if (can_color) {
                group.find("*").attr("fill", scope.current_color);
                $.each(scope.variations, function(i, variation) {
                    if (variation.name === scope.current_variation.name) {
                        variation.svg = $(".template").html();
                        return false;
                    }
                });
            }
        };

        scope.change_color = function(color) {
            scope.current_color_style = { "background-color": color };
            scope.current_color = color;
        };

        scope.select_variation = function(variation) {
            scope.current_variation = {};
            scope.current_variation = variation;
        };

        scope.autofill = function() {
            var layout = {};
            //create array of autofill panels and colors
            $.each($(".template svg *[ng-click]"), function(i, elem) {
                elem = $(elem);
                var item = elem.attr("data-autofill"),
                    color;

                if (item === undefined) {
                    return false;
                }
                if (item[0] === "g") {
                    color = $(elem.children()[0]).attr("fill") || "#FFFFFF";
                } else {
                    color = elem.attr("fill");
                }
                layout[item] = color;
            });

            //loop through visible variations and update html
            $.each($(".variations .variation"), function(i, elem) {
                var variation = $(elem);

                //loop through autofill array and set colors
                $.each(layout, function(item, color) {
                    if (item[0] === "g") {
                        variation
                            .find('*[data-autofill="' + item + '"]')
                            .children()
                            .attr("fill", color);
                    } else {
                        variation
                            .find('*[data-autofill="' + item + '"]')
                            .attr("fill", color);
                    }
                });
            });
            //Update scope.variations
            $.each(scope.variations, function(i, variation) {
                var html = $(
                    '.variation[title="' + variation.name + '"]'
                ).html();
                scope.variations[i].svg = html;
            });
        };

        scope.fn_show_save_as = function() {
            scope.show_save_as = true;
            scope.show_login = false;
        };

        scope.save_as = function() {
            scope.saving = true;
            var user_id, public;
            if (root.no_account) {
                user_id = 0;
                public = true;
            } else {
                user_id = root.user.user_id;
                public = scope.public;
            }

            var design = {
                name: scope.save_as_name,
                user: user_id,
                product: scope.product.id,
                variations: JSON.stringify(scope.variations),
                public: public ? 1 : 0,
                new: 1
            };
            var images = [];
            $.each(scope.variations, function(i, variation) {
                images.push(scope.convert_to_png(variation.svg));
            });
            design.images = JSON.stringify(images);

            $.ajax({
                type: "POST",
                url: "php/designs.php",
                data: design,
                dataType: "json",
                success: function(data) {
                    scope.design.images = JSON.parse(data.images);
                    scope.design.name = data.name;
                    if (root.no_account && root.editing_send_retailer) {
                        root.editing_send_retailer = false;
                        scope.show_retailers = true;
                    } else if (root.no_account && root.editing_share) {
                        root.no_account = false;
                        root.share_design = { id: data.id, public: "1" };
                        root.show_share = true;
                    } else {
                        scope.edit_design(data.id);
                    }
                    scope.saving = false;
                    scope.show_save_as = false;
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not save design");
                    scope.saving = false;
                    scope.show_save_as = false;
                    scope.$apply();
                }
            });
        };

        /**
         * save button event handler
         */
        scope.save = function(callback) {
            scope.saving = true;
            var design = {
                id: scope.design.id,
                variations: JSON.stringify(scope.variations)
            };
            scope.update_design(design, function() {
                if (callback) {
                    callback();
                }
            });
        };

        scope.rename = function() {
            scope.saving = true;
            var design = {
                id: scope.design.id,
                name: scope.design.name
            };
            scope.update_design(design, function() {
                scope.show_rename = false;
            });
        };

        scope.update_design = function(design, callback) {
            //update images on save
            var images = [];
            $.each(scope.variations, function(i, variation) {
                images.push(scope.convert_to_png(variation.svg));
            });
            design.images = JSON.stringify(images);
            $.ajax({
                type: "POST",
                url: "php/designs.php",
                data: design,
                dataType: "json",
                success: function(data) {
                    scope.design.images = JSON.parse(data.images);
                    scope.saving = false;
                    callback();
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Could not save");
                    scope.saving = false;
                    callback();
                    scope.$apply();
                }
            });
        };

        scope.set_primary = function(current) {
            $.each(scope.variations, function(i, variation) {
                if (variation.name === current.name) {
                    variation.primary = true;
                } else {
                    variation.primary = false;
                }
            });
        };

        scope.edit_design = function(id) {
            var params = { type: "saved", id: id };
            state.go("edit", params);
        };

        scope.delete_design = function() {
            var design = scope.design;
            if (!scope.show_delete_design) {
                scope.show_delete_design = true;
                scope.deleting_design = design.id;
                return;
            }
            var data = {
                delete: true,
                id: scope.deleting_design
            };
            $.ajax({
                type: "POST",
                url: "php/designs.php",
                data: data,
                dataType: "json",
                success: function(data) {
                    scope.show_delete_design = false;
                    scope.deleting_design = null;
                    state.go("home");
                    root.success("Your design has been deleted");
                    scope.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    scope.show_delete_design = false;
                    scope.deleting_design = null;
                    root.error(
                        "We could not delete your design. Try again later."
                    );
                    scope.$apply();
                }
            });
        };

        scope.show_share = function() {
            root.editing_share = true;
            //if already saved, show share window
            if (state.params.type === "saved") {
                root.editing_share = false;
                root.share_design = scope.design;
                root.show_share = true;
            } else if (root.user.logged_in) {
                // else if user is logged in, save then, share window.
                scope.show_save_as = true;
                return;
            } else {
                // else if user is not logged in, offer login screen + save window
                scope.show_login = true;
            }
        };

        scope.reset = function() {
            var reset_designs = JSON.parse(scope.product.variations);
            $.each(scope.variations, function(i, variation) {
                variation.svg = reset_designs[i].svg;
            });
            scope.show_reset = false;
        };

        scope.show_send_retailer = function() {
            root.editing_send_retailer = true;
            //if already saved, show send to retailer secreen
            if (state.params.type === "saved") {
                root.editing_send_retailer = false;
                scope.show_retailers = true;
            } else if (root.user.logged_in) {
                scope.show_save_as = true;
                return;
            } else {
                scope.show_login = true;
            }
        };

        scope.send_to_retailer = function() {
            var designs = [];
            $.each(scope.variations, function(i, variation) {
                if (scope.send_retailer[variation.name]) {
                    designs.push(scope.design.images[i]);
                }
            });
            if (!designs.length) {
                root.error("You must select at least one variation");
                return;
            }
            var name =
                scope.send_retailer.first_name +
                " " +
                scope.send_retailer.last_name;
            var comments =
                name +
                " has sent you a design for the " +
                scope.product.name +
                " called " +
                scope.design.name +
                ". Reply to this email to follow up with " +
                name +
                " about ordering this product. <br/><br/>";
            if (scope.send_retailer.message) {
                comments +=
                    name +
                    " has added a message:<br/>" +
                    scope.send_retailer.message +
                    "<br/><br/>";
            }
            $.each(designs, function(i, design) {
                comments += '<img src="' + root.base_url + design + '" /><br/>';
            });
            comments +=
                '<br/>If you think you got this email in error, or if you want to stop receiving these emails, let us know by emailing KitePaint administration at <a href="mailto:spencer@kitepaint.com">spencer@kitepaint.com</a>';
            var content = {
                email: scope.send_retailer.email,
                name: name,
                subject: name + " has sent you a design from KitePaint.com",
                comments: comments,
                to: scope.send_retailer.retailer.email,
                format: "html"
            };
            //post to orders
            var order = {
                new_order: true,
                retailer: scope.send_retailer.retailer.id,
                user: {
                    id: root.user.user_id ? root.user.user_id : 0,
                    first_name: scope.send_retailer.first_name,
                    last_name: scope.send_retailer.last_name,
                    email: scope.send_retailer.email
                },
                product: scope.product.id,
                name: scope.design.name,
                message: scope.send_retailer.message,
                variations: []
            };
            $.each(scope.variations, function(i, variation) {
                if (scope.send_retailer[variation.name]) {
                    order.variations.push(variation);
                }
            });
            order.variations = JSON.stringify(order.variations);
            $.ajax({
                type: "POST",
                url: "php/orders.php",
                data: order,
                dataType: "json",
                success: function(data) {
                    if (data.valid) {
                        send_email();
                    } else {
                        root.error(
                            data.message ||
                                "Unable to send order. Try again later."
                        );
                        root.$apply();
                    }
                },
                error: function(data) {
                    root.error("Unable to send order. Try again later.");
                    root.$apply();
                }
            });

            function send_email() {
                $.ajax({
                    type: "POST",
                    url: "php/email.php",
                    data: content,
                    dataType: "json",
                    success: function(data) {
                        if (data.sent) {
                            root.success("Your design has been sent");
                            scope.send_retailer.retailer = false;
                            scope.send_retailer.message = "";
                            scope.show_retailers = false;
                            root.$apply();
                        } else {
                            root.error(data.message);
                            root.$apply();
                        }
                    },
                    error: function(data) {
                        var message =
                            data.message ||
                            "Unable to send design. Try again later.";
                        root.error(message);
                        console.log("error", data);
                    }
                });
            }
        };

        scope.convert_to_png = function(svg) {
            var find = 'mesh"',
                regex = new RegExp(find, "g"),
                processed_svg = svg.replace(
                    regex,
                    'mesh" fill="rgba(50,50,50,.5)"'
                ),
                svg_data = "data:image/svg+xml;base64," + btoa(processed_svg);
            canvg("canvas", svg_data);
            return document
                .getElementsByTagName("canvas")[0]
                .toDataURL("image/png");
        };

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

        /* LISTENERS */
        scope.$watch(
            "public",
            function(public) {
                if (state.params.type === "saved" && !scope.loading) {
                    scope.saving = true;
                    scope.design.public = public ? 1 : 0;
                    var design = {
                        id: scope.design.id,
                        public: scope.design.public
                    };
                    scope.update_design(design, function() {});
                }
            },
            true
        );

        root.$on("share_set_public", function() {
            scope.public = true;
            scope.design.public = 1;
        });
    }
]);
