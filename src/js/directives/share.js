app.directive("share", function() {
    function link(scope, element, attrs) {
        //VARIABLES
        scope.url = root.base_url;
        scope.encoded_url = root.base_url;
        scope.selected = "link";
        scope.make_public = false;
        scope.variationImages = [];

        //FUNCTIONS

        scope.share_facebook = function() {
            FB.ui(
                {
                    method: "feed",
                    name: root.share_design.name + " Design on KitePaint",
                    link: scope.url,
                    picture: root.base_url + "/img/blank_dual_line-01.png",
                    caption: "Kite Design",
                    description: "A kite design made on KitePaint.com!"
                },
                function(response) {
                    var published = true;
                    if (response && response.post_id) {
                    } else {
                        published = false;
                    }
                    if (published) {
                        root.show_share = false;
                        root.$apply();
                    }
                }
            );
        };

        scope.set_status = function(design, status) {
            var content = {
                id: design.id,
                status: parseInt(status)
            };
            $.ajax({
                type: "POST",
                url: app.apiDomain + "designs.php",
                data: content,
                dataType: "json",
                success: function(data) {
                    if (!data.valid) {
                        root.error("Unable to set status");
                        return;
                    }
                    scope.make_public = false;
                    root.share_design.status = 0;
                    root.$broadcast("share_set_status", parseInt(status));
                    root.$apply();
                },
                error: function(data) {
                    console.log("error", data);
                    root.error("Unable to set status");
                    root.$apply();
                }
            });
        };

        scope.generate_images = function() {
            scope.variationImages = scope.variations.map(function(variation) {
                return {
                    name: variation.name,
                    imageData: scope.convert_to_png(variation.svg)
                };
            });
        };

        scope.convert_to_png = function(svg) {
            // Add a translucent fill to mesh elements
            var regex = new RegExp('mesh"', "g");
            var processed_svg = svg.replace(
                regex,
                'mesh" fill="rgba(50,50,50,.5)"'
            );
            var fillVentRegex = new RegExp('fill="venting"', "g");
            processed_svg = processed_svg.replace(
                fillVentRegex,
                'fill="rgba(50,50,50,.5)"'
            );

            // Remove any styling added to the svg
            var stylingRegex = new RegExp("<style(.|\n)*</style>", "g");
            processed_svg = processed_svg.replace(stylingRegex, "");

            var svg_data = "data:image/svg+xml;base64," + btoa(processed_svg);
            canvg("canvas", svg_data);
            return document
                .getElementsByTagName("canvas")[0]
                .toDataURL("image/png");
        };

        //close lightbox
        $(document).click(function(e) {
            var clicked = $(e.target);
            if (
                !clicked.parents(".lightbox").length &&
                !clicked.hasClass("lightbox") &&
                (!clicked.hasClass("icon") && !clicked.hasClass("share"))
            ) {
                root.show_share = false;
                root.$apply();
            }
        });

        //LISTENERS
        root.$watch(
            "share_design",
            function(design) {
                if (!design) {
                    return;
                }
                scope.url = root.base_url + "/#!/view?id=" + design.id;
                scope.encoded_url =
                    root.base_url +
                    encodeURIComponent("/#/view?id=" + design.id);

                if (parseInt(design.status) === 0) {
                    scope.make_public = true;
                } else {
                    scope.make_public = false;
                }
            },
            true
        );
    }
    return {
        restrict: "E",
        templateUrl: app.staticDomain + "html/directives/share.html",
        link: link
    };
});
