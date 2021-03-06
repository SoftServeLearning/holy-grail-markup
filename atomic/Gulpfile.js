var gulp            = require('gulp'),
    acss            = require('gulp-atomizer')
    sourcemaps      = require('gulp-sourcemaps'),
    cached          = require('gulp-cached'),
    remember        = require('gulp-remember'),
    gulpif          = require('gulp-if'),
    path            = require('path'),
    multipipe       = require('multipipe'),
    notify          = require('gulp-notify');

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

gulp.task('acss', function(filepath) {
    return multipipe (
        gulp.src('*.html'),
        cached('*.html'),
        gulpif(isDevelopment, sourcemaps.init({loadMaps: true})),
        acss({
          outfile: 'style.css',
          acssConfig: require('./config.js'),
        }),
        gulpif(isDevelopment, sourcemaps.write()),
        remember('*.html'),
        gulp.dest('./')
    ).on('error', notify.onError(function(err){
        return {
            title: 'Error',
            message: err.message
        }
    }));
});

gulp.task('watch', function() {
    gulp.watch('*.html', ['acss']).on('unlink', function(filepath) {
        remember.forget('acss', path.resolve(filepath));
        delete cached.caches.sass[path.resolve(filepath)];
    });
});

gulp.task('default', ['acss', 'watch']);
