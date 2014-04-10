(function()
{
  "use strict";

  var gulp = require("gulp");
  var concat = require("gulp-concat");
  var uglify = require("gulp-uglify");
  var rename = require("gulp-rename");

  // Main build task
  gulp.task("default", function()
  {
    gulp.src("src/*.js")
    .pipe(concat("tank.js"))
    .pipe(gulp.dest("bin/"))
    .pipe(uglify())
    .pipe(rename("tank.min.js"))
    .pipe(gulp.dest("bin/"));
  });

  // Component build task
  gulp.task("components", function()
  {
    gulp.src("components/*.js")
    .pipe(concat("components.js"))
    .pipe(gulp.dest("bin/"))
    .pipe(uglify())
    .pipe(rename("components.min.js"))
    .pipe(gulp.dest("bin/"));
  });

  // Rerun the task when a file changes
  gulp.task("watch", function() {
    gulp.watch(["src/*.js", "components/*.js"], ["default", "components"]);
  });

})();