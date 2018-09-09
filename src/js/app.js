var app = angular.module("kitePaint", ["ui.router", "uiRouterStyles"]);

app.config(function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
});

app.config(function(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $compileProvider
) {
    $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|data):/
    );

    $locationProvider.hashPrefix("!");

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    // Store some domain references based on environment
    var currentDomain = window.location.hostname;
    var staticDomains = {
        "beta.kitepaint.com": "https://static.beta.kitepaint.com/",
        "kitepaint.com": "https://static.kitepaint.com/",
        default: ""
    };
    var apiDomains = {
        "beta.kitepaint.com": "https://api.beta.kitepaint.com/api/php/",
        "kitepaint.com": "https://api.kitepaint.com/api/php/",
        default: ""
    };
    app.staticDomain = staticDomains[currentDomain] || staticDomains.default;
    app.apiDomain = apiDomains[currentDomain] || apiDomains.default;

    $stateProvider
        .state("about", {
            url: "/about",
            templateUrl: app.staticDomain + "html/pages/about.html",
            controller: "AboutController",
            data: {
                title: "About"
            }
        })
        .state("activate", {
            url: "/activate",
            templateUrl: app.staticDomain + "html/pages/activate.html",
            controller: "ActivateController",
            data: {
                title: "Activate"
            }
        })
        .state("account", {
            url: "/account",
            templateUrl: app.staticDomain + "html/pages/account.html",
            controller: "AccountController",
            data: {
                title: "Account"
            }
        })
        .state("changePassword", {
            url: "/changePassword",
            templateUrl: app.staticDomain + "html/pages/changePassword.html",
            controller: "ChangePasswordController",
            data: {
                title: "Change Password"
            }
        })
        .state("contact", {
            url: "/contact",
            templateUrl: app.staticDomain + "html/pages/contact.html",
            controller: "ContactController",
            data: {
                title: "Contact"
            }
        })
        .state("create", {
            url: "/create",
            templateUrl: app.staticDomain + "html/pages/create.html",
            controller: "CreateController",
            data: {
                title: "Create"
            }
        })
        .state("designs", {
            url: "/designs",
            templateUrl: app.staticDomain + "html/pages/designs.html",
            controller: "DesignsController",
            data: {
                title: "Designs"
            }
        })
        .state("edit", {
            url: "/edit/:type?id",
            templateUrl: app.staticDomain + "html/pages/edit.html",
            controller: "EditController",
            data: {
                title: "Edit"
            }
        })
        .state("home", {
            url: "/",
            templateUrl: app.staticDomain + "html/pages/home.html",
            controller: "HomeController",
            data: {
                title: ""
            }
        })
        .state("view", {
            url: "/view?id",
            templateUrl: app.staticDomain + "html/pages/view.html",
            controller: "ViewController",
            data: {
                title: "View"
            }
        });
});

if (embed) {
    verify_embed();
} else {
    if (parent !== window) {
        //don't allow embeds of site
        window.location.replace("error.php?m=embedding_prohibited");
    }
}

function verify_embed() {
    if (parent === window) {
        //don't allow embed url unless in iframe
        window.location.replace("https://kitepaint.com");
    }
    var parent_url = document.referrer;
    var parent_domain = parent_url.split("://")[1]; //take of protocol
    parent_domain = parent_domain.split("/")[0]; //take off path
    if (parent_domain.split(".").length === 3) {
        parent_domain =
            parent_domain.split(".")[1] + "." + parent_domain.split(".")[2]; //take off subdomain if exists
    }
    var path = window.location.href.split("#!")[1];
    if (path !== "/edit/new?id=" + product) {
        window.location.replace("error.php?m=bad_embed_url");
    }

    //Get list of domains
    var domains = ["kitepaint.com", "wattydev.com"];
    var content = {
        filter: {
            activated: 1
        },
        return: ["website"]
    };
    var checks = 0;
    $.ajax({
        type: "GET",
        url: app.apiDomain + "manufacturers.php",
        data: content,
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, item) {
                if (!item.website) {
                    return check_domain();
                }
                var domain = item.website.split("://")[1];
                domain = domain.split("/")[0];
                if (domain.split(".").length === 3) {
                    domain = domain.split(".")[1] + "." + domain.split(".")[2]; //take off subdomain if exists
                }
                domains.push(domain);
                return check_domain();
            });
        },
        error: function(data) {
            check_domain();
        }
    });
    content = {
        filter: {
            activated: 1
        },
        return: ["url"]
    };
    $.ajax({
        type: "GET",
        url: app.apiDomain + "retailers.php",
        data: content,
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, item) {
                var domain = item.url.split("://")[1];
                domain = domain.split("/")[0];
                if (domain.split(".").length === 3) {
                    domain = domain.split(".")[1] + "." + domain.split(".")[2]; //take off subdomain if exists
                }
                domains.push(domain);
                check_domain();
            });
        },
        error: function(data) {
            check_domain();
        }
    });

    function check_domain() {
        checks++;
        if (checks > 1) {
            // If the current domain is not on the whitelist, redirect to an error page.
            if (domains.indexOf(parent_domain) < 0) {
                return window.location.replace("error.php?m=bad_embed_domain");
            }

            // If the embed is valid, look for a providd css file to include
            applyThirdPartyCss();
        }
    }

    function applyThirdPartyCss() {
        // thirdPartyCSSUrl is provided by PHP at page load and is placed in a global variable
        if (!thirdPartyCssUrl) {
            return;
        }

        // Apply the third party css to the page
        $("head").append(
            '<link rel="stylesheet" href="' + thirdPartyCssUrl + '" />'
        );
    }
}

function create_cookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function read_cookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function erase_cookie(name) {
    create_cookie(name, "", -1);
}
