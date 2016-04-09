var gulp = require('gulp'),
	server = require('gulp-connect'),
	rigger = require('gulp-rigger'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	spritesmith = require("gulp.spritesmith"),
	watch = require('gulp-watch');

gulp.task('html', function() {
	gulp.src('./src/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('./build'))
		.pipe(server.reload());
});

gulp.task('sprite', function() {
	var spriteData = gulp.src('./build/images/icons_sprite/*.*').pipe(spritesmith({
		imgName: 'icons-sprite.png',
		cssName: '_icons-sprite.scss',
		algorithm: 'binary-tree',
		imgPath: '../images/icons-sprite.png',
		cssVarMap: function(sprite) {
			sprite.name = 'i-' + sprite.name
		}
	}));
	spriteData.img.pipe(gulp.dest('./build/images/'));
	spriteData.css.pipe(gulp.dest('./src/scss/partials/'));
});

gulp.task('scss', function() {
	gulp.src('./src/scss/**/*.scss')
		.pipe(sass()).on('error', sass.logError)
		.pipe(prefixer({
			"browsers": ["Explorer >= 9", "FireFox >= 6", "Safari >= 5", "Opera >= 12", "Chrome >= 10"],
			"cascade": false
		}))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./build/css'))
		.pipe(server.reload());
});

gulp.task('js', function() {
	gulp.src('./src/js/main.js')
		.pipe(rigger())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./build/js/'))
		.pipe(server.reload());
});

gulp.task('server', function() {
	server.server({
		root: './build/',
		port: 1337,
		livereload: true
	});
});

gulp.task('watch', function() {
	watch(['./src/scss/**/*.scss'], function() {
		gulp.start('scss');
	});
	watch(['./src/*.html', './src/template/*.html'], function() {
		gulp.start('html');
	});
	watch(['./src/js/**/*.js'], function() {
		gulp.start('js');
	});
	watch(['./build/images/icons_sprite/*.*'], function() {
		gulp.start('sprite');
	});
});

gulp.task('default', ['html', 'sprite', 'scss', 'js', 'server', 'watch']);
