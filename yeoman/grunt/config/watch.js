// Watches files for changes and runs tasks based on the changed files
module.exports = {
    cordova: {
        files: [
            '<%= yeoman.app %>/*.html',
            '.tmp/styles/{,*/}*.css',
            '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['copy:auto', 'cordova-prepare']
    },
    js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
            livereload: true
        }
    },
    jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
    },
    gruntfile: {
        files: ['Gruntfile.js']
    },
    compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
    },
    styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
    },
    livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
        },
        files: [
            '<%= yeoman.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
        ]
    }
};
