module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    source: 'src',
    target: 'build',
    temp: '.tmp',

    clean: {
      build: ['<%= temp %>', '<%= target %>'],
      temp: ['<%= temp %>']
    },

    dataUri: {
      build: {
        src: '<%= source %>/css/main.css',
        dest: '<%= temp %>/css',
        options: {
          target: '<%= source %>/images/*',
          baseDir: '<%= source %>'
        }
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= temp %>/css/main.min.css': [
            '<%= temp %>/css/main.css',
          ]
        }
      }
    },

    htmlbuild: {
      build: {
        src: '<%= source %>/index.html',
        dest: '<%= target %>',
        options: {
          beautify: false,
          styles: {
            "main": '<%= temp %>/css/main.min.css'
          }
        }
      }
    },

    copy: {
      build: {
        files: [
          {expand: true, cwd: '<%= source %>', src: 'images/background.jpg', dest: '<%= target %>', filter: 'isFile'},
          {expand: true, cwd: '<%= source %>', src: 'favicon.ico', dest: '<%= target %>', filter: 'isFile'},
          {expand: true, cwd: '<%= source %>', src: 'robots.txt', dest: '<%= target %>', filter: 'isFile'}
        ]
      }
    }

  });

  grunt.registerTask('build', [
      'clean:build',
      'dataUri:build',
      'cssmin:build',
      'htmlbuild:build',
      'copy:build',
      'clean:temp'
  ]);
};
