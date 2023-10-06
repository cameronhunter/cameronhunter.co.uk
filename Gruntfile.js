const { devDependencies } = require('./package.json');

module.exports = function (grunt) {
  Object.keys(devDependencies)
    .filter((name) => name.startsWith('grunt-') && name !== 'grunt-cli')
    .forEach(grunt.loadNpmTasks);

  var aws = (function () {
    try {
      return grunt.file.readJSON('aws-credentials.json');
    } catch (e) {
      return {};
    }
  })();

  grunt.initConfig({
    source: 'src',
    target: 'build',
    temp: '.tmp',
    aws: aws,

    clean: {
      build: ['<%= temp %>', '<%= target %>'],
      temp: ['<%= temp %>']
    },

    dataUri: {
      build: {
        src: '<%= source %>/css/*.css',
        dest: '<%= temp %>/css',
        options: {
          target: '<%= source %>/assets/*',
          baseDir: '<%= source %>'
        }
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= temp %>/css/app.min.css': ['<%= temp %>/css/*.css']
        }
      }
    },

    htmlbuild: {
      build: {
        src: '<%= source %>/index.html',
        dest: '<%= target %>',
        options: {
          beautify: false,
          scripts: {
            'google-analytics': '<%= source %>/js/google-analytics.js'
          },
          styles: {
            app: '<%= temp %>/css/app.min.css'
          }
        }
      }
    },

    copy: {
      build: {
        files: [{ expand: true, cwd: '<%= source %>', src: 'robots.txt', dest: '<%= target %>', filter: 'isFile' }]
      }
    },

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        region: 'us-west-1',
        bucket: 'cameronhunter.co.uk',
        overwrite: true,
        progress: 'progressBar'
      },
      deploy: {
        files: [{ expand: true, cwd: 'build', src: ['**'], dest: '/' }]
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

  grunt.registerTask('deploy', ['build', 'aws_s3:deploy']);

  grunt.registerTask('default', ['build']);
};
