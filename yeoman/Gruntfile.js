// Generated on 2014-01-29 using generator-webapp 0.4.7
'use strict';
var cordova = require('cordova');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var path = require('path');

    // Define the configuration for all the tasks
    var device = {
        platform: grunt.option('platform') || 'all',
        family: grunt.option('family') || 'default',
        target: grunt.option('target') || 'emulator'
    };

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'grunt', 'config'),
        init: true,
        config: {
            app: require('./bower.json').appPath || 'app',
            config: 'config',
            data: 'data',
            dist: 'dist',
            tasks: 'tasks',
            test: 'test',
            www: 'www',
            coverage: 'coverage',
            device: device
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'autoprefixer',
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('buildweb', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'modernizr',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('cordova-prepare', 'Prepare the native application', function() {
        var done = this.async();

        if (device.platform === null) {
            // Build all platforms
            cordova.prepare(done);
        } else {
            cordova.prepare(device.platform, done);
        }
    });

    grunt.registerTask('cordova-build', 'Build the native application', function() {
        var done = this.async();

        if (device.platform === null) {
            // Build all platforms
            cordova.build(done);
        } else {
            cordova.build(device.platform, done);
        }
    });

    grunt.registerTask('cordova-emulate', 'Emulate the application', function(){
        if (device.platform === 'all') {
            grunt.fatal('Platform required. Eg. ` --platform=ios`');
        } else if (device.platform === 'android') {
            var done = this.async();
            cordova.emulate('android', done);
        } else if (device.platform === 'ios') {
            grunt.task.run('shell:iossimstart');
        }
    });

    grunt.registerTask('build', [
        'buildweb',
        'cordova-build'
    ]);

    grunt.registerTask('emulate', [
        'build',
        'cordova-emulate'
    ]);

    grunt.registerTask('cordova-run', 'Run the application on a device', function() {
        var done = this.async();

        if (device.platform === null) {
            // Build all platforms
            cordova.run(done);
        } else {
            cordova.run(device.platform, done);
        }
    });

    grunt.registerTask('run', [
        'build',
        'cordova-run'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
