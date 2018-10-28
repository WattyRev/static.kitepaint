module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 9000,
                    base: "dist"
                }
            }
        },
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
        concurrent: {
            serve: ["watch", "connect"]
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
                    },
                    {
                        expand: true,
                        cwd: "src",
                        src: "index.html",
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
        run: {
            deploy_beta: {
                cmd: "node",
                args: [
                    "deploy.js",
                    "path=./public_html/static.beta.kitepaint.com/",
                    `user=${grunt.option("sftp-user")}`,
                    `pass=${grunt.option("sftp-pass")}`,
                    `host=${grunt.option("sftp-host")}`
                ]
            },
            deploy_prod: {
                cmd: "node",
                args: [
                    "deploy.js",
                    "path=./public_html/static.kitepaint.com/",
                    `user=${grunt.option("sftp-user")}`,
                    `pass=${grunt.option("sftp-pass")}`,
                    `host=${grunt.option("sftp-host")}`
                ]
            }
        },
        watch: {
            scripts: {
                files: "src/**/*.js",
                tasks: ["concat"]
            },
            styles: {
                files: "src/**/*.less",
                tasks: ["less"]
            }
        }
    });

    grunt.registerTask("build", ["concat", "less", "copy"]);
    grunt.registerTask("deploy-beta", ["build", "run:deploy_beta"]);
    grunt.registerTask("deploy-prod", ["build", "run:deploy_prod"]);
    grunt.registerTask("start", ["build", "concurrent:serve"]);
};
