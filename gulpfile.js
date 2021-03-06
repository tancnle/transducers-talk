var pkg = require("./package.json"),
  gulp = require("gulp"),
  gutil = require("gulp-util"),
  plumber = require("gulp-plumber"),
  del = require("del"),
  rename = require("gulp-rename"),
  connect = require("gulp-connect"),
  browserify = require("gulp-browserify"),
  uglify = require("gulp-uglify"),
  jade = require("gulp-jade"),
  stylus = require("gulp-stylus"),
  autoprefixer = require("gulp-autoprefixer"),
  csso = require("gulp-csso"),
  through = require("through"),
  opn = require("opn"),
  ghpages = require("gh-pages"),
  path = require("path"),
  isDist = process.argv.indexOf("serve") === -1;

gulp.task("js", ["clean:js"], function() {
  return gulp
    .src("src/scripts/main.js")
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ debug: !isDist }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename("build.js"))
    .pipe(gulp.dest("dist/build"))
    .pipe(connect.reload());
});

gulp.task("html", ["clean:html"], function() {
  return gulp
    .src("src/index.jade")
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: true }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

gulp.task("css", ["clean:css"], function() {
  return gulp
    .src("src/styles/main.styl")
    .pipe(isDist ? through() : plumber())
    .pipe(
      stylus({
        // Allow CSS to be imported from node_modules and bower_components
        "include css": true,
        paths: ["./node_modules", "./bower_components"]
      })
    )
    .pipe(autoprefixer("last 2 versions", { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename("build.css"))
    .pipe(gulp.dest("dist/build"))
    .pipe(connect.reload());
});

gulp.task("images", ["clean:images"], function() {
  return gulp
    .src("src/images/**/*")
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());
});

gulp.task("clean", function() {
  del("dist");
});

gulp.task("clean:html", function() {
  del("dist/index.html");
});

gulp.task("clean:js", function() {
  del("dist/build/build.js");
});

gulp.task("clean:css", function() {
  del("dist/build/build.css");
});

gulp.task("clean:images", function() {
  del("dist/images");
});

gulp.task("connect", ["build"], function(done) {
  connect.server({
    root: "dist",
    livereload: true
  });

  opn("http://localhost:8080", done);
});

gulp.task("watch", function() {
  gulp.watch("src/**/*.jade", ["html"]);
  gulp.watch("src/styles/**/*.styl", ["css"]);
  gulp.watch("src/images/**/*", ["images"]);
  gulp.watch(
    [
      "src/scripts/**/*.js",
      "bespoke-theme-*/dist/*.js" // Allow themes to be developed in parallel
    ],
    ["js"]
  );
});

gulp.task("deploy", ["build"], function(done) {
  ghpages.publish(path.join(__dirname, "dist"), { logger: gutil.log }, done);
});

gulp.task("build", ["js", "html", "css", "images"]);
gulp.task("serve", ["connect", "watch"]);
gulp.task("default", ["build"]);
