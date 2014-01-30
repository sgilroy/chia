// Empties folders to start fresh
module.exports = {
    options: {
        force: true
    },
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= yeoman.dist %>/*',
                '!<%= yeoman.dist %>/.git*'
            ]
        }]
    },
    server: '.tmp'
};
