module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    uglify:
      dist:
        files:
          'dist/elevation.profile.min.js': ['dist/elevation.profile.js']
    less:
      dist:
        options:
          compress: true,
          yuicompress: true,
          optimization: 2
        files:
          'dist/elevation.profile.css': 'src/elevation.profile.less'
    coffee:
      dist:
        options:
          sourceMap: true
        files:
          'dist/elevation.profile.js': 'src/elevation.profile.coffee'
    watch:
      dist:
        files: ['src/*.js', 'src/*.less'],
        tasks: ['dist']

  grunt.registerTask 'dist', ['coffee', 'less', 'uglify']