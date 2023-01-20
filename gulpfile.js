import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;
import concat from "gulp-concat";
import imageMin from "gulp-imagemin";
import prefix from "gulp-autoprefixer";
import minJs from "gulp-js-minify";
import cleanCss from "gulp-clean-css";
import clean from "gulp-clean";
import browserSync from "browser-sync";
import rename from "gulp-rename";

const sync = browserSync.create();

import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

const serve = () =>
  sync.init({
    server: {
      baseDir: "./",
      browser: "firefox",
    },
  });

const css = () =>
  src("./src/styles/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    )
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest("./dist"))
    .pipe(sync.reload({ stream: true }));

const js = () =>
  src("./src/js/*.js")
    .pipe(concat("script.min.js"))
    .pipe(minJs())
    .pipe(dest("./dist/"))
    .pipe(sync.reload({ stream: true }));

const images = () =>
  src("./src/images/**.*")
    .pipe(imageMin())
    .pipe(dest("./dist/images"))
    .pipe(sync.reload({ stream: true }));

const cleanDest = () => src("./dist/*", { read: false }).pipe(clean());

const watcher = () => {
  watch("./src/styles/**/*.scss", css);
  watch("*.html").on("change", sync.reload);
  watch("./src/js/**/*.js").on("change", js);
  watch("./src/images/**/*.{jpg,jpeg,png,svg,webp}").on("change", images);
};

export const build = series(cleanDest, parallel(css, js, images));
export const dev = series(build, parallel(serve, watcher));
