const dotenv = require('dotenv').config();
gulp = require('gulp');
sass = require('gulp-sass');

browserSync = require('browser-sync').create();
browserSyncConfig = {
	proxy: process.env.ORGANIZR_URL,
	files: 'css/Organizr.css',
	serveStatic: ['css'],
	snippetOptions: {
		rule: {
			match: /<link id="theme" href=".*" rel="stylesheet"\s*\/?>/is,
                fn: snippet =>
                    `<link href="/Organizr.css" rel="stylesheet" type="text/css" />${snippet}`
		}
	},

	ghostMode: {
		clicks: false,
		location: false,
		forms: false,
		scroll: false
	},

	notify: {
		styles: {
			top: 'auto',
			bottom: '0'
		}
	}
}

// Lint, compile, and post-process Sass
gulp.task('build', () =>
    gulp
		.src('sass/*.s+(a|c)ss')
        // .pipe(stylelint({ fix: true }))
        .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
        // .pipe(cssSvg({ baseDir: '../' }))
        // .pipe(postcss())
        // .pipe(cleanCSS(cleanCSSConfig))
        // .pipe(headerComment(comment))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream())
);

gulp.task('watch', () =>
	gulp.watch(['sass/**/*.s+(a|c)ss'], gulp.series('build'))
);

gulp.task('build-watch', gulp.series(['build', 'watch']));

browserSyncError = () => {
	console.error("Set URL");
	return process.exit(0);
}

gulp.task('serve', () => {
	!process.env.ORGANIZR_URL ? browserSyncError: browserSync.init(browserSyncConfig);
});

gulp.task('build-watch-serve', gulp.parallel('build-watch', 'serve'));