app.controller("ContactController", [
    "$scope",
    "$rootScope",
    function(scope, root) {
        //FUNCTIONS

        root.done(1);

        scope.send = function() {
            var content = {
                email: scope.email,
                name: scope.name,
                subject: scope.subject,
                comments: scope.comments,
                to: "spencer@kitepaint.com"
            };
            $.ajax({
                type: "POST",
                url: app.apiDomain + "mail.php",
                data: content,
                dataType: "json",
                success: function(data) {
                    if (data.sent) {
                        root.success("Your message has been sent");
                        scope.comments = "";
                        scope.$apply();
                    } else {
                        root.error(data.message);
                        root.$apply();
                    }
                },
                error: function(data) {
                    var message =
                        data.message ||
                        "Unable to send message. Try again later";
                    root.error(message);
                    console.log("error", data);
                }
            });
        };
    }
]);
