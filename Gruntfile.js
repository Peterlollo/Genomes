var grunt = require('grunt');

module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      scripts : {
        files: ['client/**/*.js'],
        tasks: ['force:on','webpack']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-force');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build_server', ['jshint']);
  grunt.registerTask('terminate_server', ['jshint']);
};
