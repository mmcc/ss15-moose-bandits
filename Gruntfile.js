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
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['watch', 'harp']
      }
    },
    harp: {
      server: {
        server: true,
        source: 'public'
      },
      dist: {
        source: 'public',
        dest: 'www'
      }
    },
    browserify: {
      dist: {
        files: {
          'public/js/bundle.js': ['src/app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-harp');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('build', ['browserify', 'harp:dist']);
  grunt.registerTask('dev', ['concurrent']);
};
