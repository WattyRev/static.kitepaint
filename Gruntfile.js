module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "src/js/libraries/jquery.min.js",
                    "src/js/libraries/angular.min.js",
                    "src/js/libraries/angular-ui-router.js",
                    "src/js/libraries/ui-router-styles.js",
                    "src/js/libraries/rgbcolor.js",
                    "src/js/libraries/StackBlur.js",
                    "src/js/libraries/canvg.js",
                    "src/js/app.js",
                    "src/js/controllers/about.js",
                    "src/js/controllers/activate.js",
                    "src/js/controllers/account.js",
                    "src/js/controllers/changePassword.js",
                    "src/js/controllers/contact.js",
                    "src/js/controllers/create.js",
                    "src/js/controllers/designs.js",
                    "src/js/controllers/edit.js",
                    "src/js/controllers/header.js",
                    "src/js/controllers/home.js",
                    "src/js/controllers/primary.js",
                    "src/js/controllers/view.js",
                    "src/js/directives/compile.js",
                    "src/js/directives/alert.js",
                    "src/js/directives/menu.js",
                    "src/js/directives/share.js",
                    "src/js/directives/tooltip.js",
                    "src/js/directives/loading.js"
                ],
                dest: "dist/app.js"
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: "src/html",
                        src: "**",
                        dest: "dist/html/"
                    },
                    {
                        expand: true,
                        cwd: "src/docs",
                        src: "**",
                        dest: "dist/docs/"
                    },
                    {
                        expand: true,
                        cwd: "src/img",
                        src: "**",
                        dest: "dist/img/"
                    },
                    {
                        expand: true,
                        cwd: "src",
                        src: ".htaccess",
                        dest: "dist/"
                    }
                ]
            }
        },
        less: {
            build: {
                files: {
                    "dist/app.css": "src/less/app.less"
                }
            }
        },
        ftpush: {
            beta: {
                auth: {
                    host: "wattyrev.com",
                    port: 21,
                    username: grunt.option("ftp-username"),
                    password: grunt.option("ftp-pass")
                },
                src: "./dist",
                dest: "/static.beta.kitepaint.com",
                simple: false,
                useList: true
            },
            prod: {
                auth: {
                    host: "wattyrev.com",
                    port: 21,
                    username: grunt.option("ftp-username"),
                    password: grunt.option("ftp-pass")
                },
                src: "./dist",
                dest: "/static.kitepaint.com",
                simple: false,
                useList: true
            }
        }
    });

    grunt.registerTask("build", ["concat", "less", "copy"]);
    grunt.registerTask("deploy-beta", ["build", "ftpush:beta"]);
    grunt.registerTask("deploy-prod", ["build", "ftpush:prod"]);
};
