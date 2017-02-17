var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var minifyCss = require('gulp-minify-css');
var cssmin = require('gulp-cssmin');
var order = require('gulp-order');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var browserSync = require('browser-sync').create();

var paths = {
    bowerDir: './bower_components',
    public: './public/assets',
    resource: './resource',
};

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
    });
});


gulp.task('cssAllMin', function () {
    var sassStream,
        cssStream;

    //compile sass
    sassStream = gulp.src(paths.resource + '/scss/**/*.scss')

    .pipe(sass({
        errLogToConsole: true
    }));
    //select additional css files
    cssStream = gulp.src('./css');


    //merge the two streams and concatenate their contents into a single file
    return merge(sassStream, cssStream)
        .pipe(order([
            "bootstrap.css",
            "/bower_components/animate.css/animate.min.css",
            "main.css"
        ]))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(paths.public + '/css/'))
        .pipe(cssmin())
        .pipe(prefix())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.public + '/css/')) // save .min.css

    .pipe(browserSync.reload({
        stream: true
    }));
});


gulp.task('jsAllMin', function () {

    return gulp.src([
            paths.bowerDir + '/jquery/dist/jquery.min.js',
            paths.bowerDir + '/tether/dist/js/tether.min.js',
            paths.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
            paths.bowerDir + '/jquery.easing/js/jquery.easing.min.js',
            paths.bowerDir + '/wow/dist/wow.js',
            paths.resource + '/js/main.js',
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.public + '/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('watch', ['browserSync', 'cssAllMin'], function () {
    gulp.watch(paths.resource + '/scss/*.scss', ['cssAllMin']);
    gulp.watch('./*.html', browserSync.reload);
    gulp.watch(paths.resource + '/js/*.js', ['jsAllMin']);
    // Other watchers
});