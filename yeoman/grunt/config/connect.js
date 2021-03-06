// The actual grunt server settings
module.exports = {
    options: {
        port: 9090,
        livereload: 35730,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
    },
    livereload: {
        options: {
            open: true,
            base: [
                '.tmp',
                '<%= yeoman.app %>'
            ]
        }
    },
    test: {
        options: {
            port: 9001,
            base: [
                '.tmp',
                'test',
                '<%= yeoman.app %>'
            ]
        }
    },
    dist: {
        options: {
            open: true,
            base: '<%= yeoman.dist %>',
            livereload: false
        }
    }
};
