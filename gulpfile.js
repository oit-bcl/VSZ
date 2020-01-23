var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    concat= require('gulp-concat'),
    cssnano= require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify= require('gulp-uglifyjs');

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css-libs', function(){
    return gulp.src('app/css/main.css')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('scripts', function(){
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function(){
    browserSync({
        server : {baseDir : 'app'},
        port : 4560
    });
});

gulp.task('code', function(){
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true}))
});

gulp.task('img', function(){
    return gulp.src('app/img/**/* */')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeVieBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function(){
    return ChannelMergerNode.clearAll();
});

gulp.task('watch', function(){
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/common.js','app/libs/**/*.js'], gulp.parallel('scripts'));
    
});

gulp.task('build', async function(){
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('css-libs','sass','browser-sync','scripts', 'watch'));

gulp.task('clean', function(){
    return del.sync('dist');
});
