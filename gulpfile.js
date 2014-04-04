(function()
{
  "use strict";

  var gulp = require("gulp");
  var concat = require("gulp-concat");

  // Main build task
  gulp.task("default", function()
  {
    gulp.src("src/*.js")
    .pipe(concat("tank.js"))
    .pipe(gulp.dest("bin/"));
  });

  // Rerun the task when a file changes
  gulp.task("watch", function() {
    gulp.watch("src/*.js", ["default"]);
  });

})();