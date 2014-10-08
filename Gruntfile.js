'use strict';

module.exports = function(grunt) {

  var jshintStylish = require('jshint-stylish');

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var banner = '/**\n * SoundJS Director v<%= pkg.version %>\n * <%= pkg.description %>\n * by <%= pkg.author %>\n */\n';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),   

    concat: {
      options: {
        banner: banner + '\n;(function (createjs) {\n\n\'use strict\';\n',
        footer: '\n\n} (window.createjs = window.createjs || {}));\n',
        separator: '\n',
        process: (function (removeUseStrictRE) {
          return function (src) {
            return src.replace(removeUseStrictRE, '');
          };
        } (/^\'use\sstrict\';\n/)),
      },
      dist: {
        src: ['src/{,*/}*.js'],
        dest: 'soundjs-director.js',
      },
    },

    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'soundjs-director.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: jshintStylish
      },
      sources: {
        src: ['<%= concat.dist.src %>']
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      dest: {
        src: ['<%= concat.dist.dest %>']
      }
    },

    watch: {
      js: {
        files: ['<%= concat.dist.src %>'],
        tasks: ['newer:jshint', 'concat:dist']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
    },

  });

  grunt.registerTask('build', [
    'jshint:gruntfile', 
    'jshint:sources', 
    'concat',
    'jshint:dest',
    'uglify'
  ]);

  grunt.registerTask('default', ['build', 'watch']);
  
};
