module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      scripts: {
        files: ['./src/**/*'],
        tasks: ['browserify'],
        options: {
          spawn: false,
        },
      },
    },
    browserify: {
      dist: {
        files: {
          'public/js/bundle.js': ['src/app.js']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);

};
