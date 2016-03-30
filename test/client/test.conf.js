

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '..',

    hostname: '127.0.0.1',


    // frameworks to use
    frameworks: ['jasmine'],

    plugins: ['karma-jasmine', 'karma-phantomjs-launcher'],


    // list of files / patterns to load in the browser
    files: [
      '../static/lib/jQuery/dist/jquery.min.js',
      '../static/lib/angular/angular.min.js',
      '../static/lib/angular-mocks/angular-mocks.js',
      '../static/app/**/*.js',
      './client/routing-spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 10000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};