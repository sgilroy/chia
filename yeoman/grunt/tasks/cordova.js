'use strict';

module.exports = function(grunt) {
    var cordova = require('cordova');

    var device = {
        platform: grunt.option('platform') || 'all',
        family: grunt.option('family') || 'default',
        target: grunt.option('target') || 'emulator'
    };

    grunt.registerTask('cordova-prepare', 'Cordova prepare tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            cordova.prepare(done);
        } else {
            cordova.prepare(device.platform, done);
        }
    });

    grunt.registerTask('cordova-build', 'Cordova building tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            cordova.build(done);
        } else {
            cordova.build(device.platform, done);
        }
    });

    grunt.registerTask('cordova-run', 'Cordova running tasks', function () {
        if (device.platform === 'all') {
            grunt.fatal("Platform required. Eg. ` --platform=ios`");
        } else if (device.platform === "android") {
            var done = this.async();
            cordova.run("android", done);
        } else if (device.platform === "ios") {
            grunt.task.run('shell:packageIOSDevelopmentBuild');
            grunt.task.run('shell:ios-deploy');
        }
    });

    grunt.registerTask('cordova-emulate', 'Cordova emulation tasks', function () {

        if (device.platform === 'all') {
            grunt.fatal("Platform required. Eg. ` --platform=ios`");
        } else if (device.platform === 'android') {
            var done = this.async();
            cordova.emulate("android", done);
        } else if (device.platform === 'ios') {
            grunt.task.run('shell:iossimstart');
        }
    });

    grunt.registerTask('cordova-serve', 'Cordova serve tasks', function () {
        if (device.platform === 'all') {
            grunt.fatal("Platform required. Eg. ` --platform=ios`");
        } else {
            cordova.serve(device.platform);
        }
    });

    grunt.registerTask('cordova-ripple', 'Cordova ripple tasks', function () {
        if (device.platform === 'all') {
            grunt.fatal("Platform required. Eg. ` --platform=ios`");
        } else {
            cordova.ripple(device.platform);
        }
    });

    grunt.registerTask('cordova-emulate-end', 'Cordova emulation tasks', function () {
        if (device.platform === 'all' || device.platform === 'ios') {
            grunt.task.run('shell:iossimend');
        }
    });

    grunt.registerTask('cordova-buildemulate', [
        'cordova-build',
        'cordova-emulate'
    ]);

    grunt.registerTask('cordova-buildrun', [
        'cordova-build',
        'cordova-run'
    ]);

    grunt.registerTask('cordova-prepareserve', [
        'cordova-prepare',
        'cordova-serve'
    ]);

    grunt.registerTask('cordova-pre-build', [
        'clean:cordova',
        'compass:dist',
        'copy:styles',
        'includeSource',
        'ngtemplates',
        'copy:cordovawww',
        'copy:cordova-defaults',
        'replace:cordova'
    ]);
};
