module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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

    grunt.registerTask("build", ["less"]);
    grunt.registerTask("deploy-beta", ["ftpush:beta"]);
    grunt.registerTask("deploy-prod", ["ftpush:prod"]);
};
