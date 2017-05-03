var gulp = require("gulp");
var coffee = require("gulp-coffee");
var nodemon = require("gulp-nodemon");
var clean = require('gulp-clean');
var path = require("path");
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task("clean",function(){
  var stream = gulp.src("dist")
  .pipe(clean());
  return stream;
});

gulp.task("copyBin",function(){
  var stream = gulp.src("src/bin/**/*")
  .pipe(gulp.dest('dist/bin'));
  return stream;
});
gulp.task("copyConfig",function(){
  var stream = gulp.src("src/config/**/*")
  .pipe(gulp.dest('dist/config'));
  return stream;
});
gulp.task("copyPublic",function(){
  var stream = gulp.src("src/public/**/*")
  .pipe(gulp.dest('dist/public'));
  return stream;
});

gulp.task("copyAsst",function(){
  var stream = gulp.src("src/asst/**/*")
  .pipe(gulp.dest('dist/asst'));
  return stream;
});

gulp.task("copyIndex",function(){
  var stream = gulp.src("src/public/index.html")
  .pipe(rename("index.ejs"))
  .pipe(gulp.dest('dist/views'))
  return stream;
});
gulp.task("delIndex",function(){
  var stream = gulp.src("dist/public/index.html")
  .pipe(clean());
  return stream;
});
gulp.task("copyViews",function(){
  var stream = gulp.src("src/views/**/*")
  .pipe(gulp.dest('dist/views'));
  return stream;
});
gulp.task("copyTemplate",function(){
  var stream = gulp.src("src/template/**/*")
  .pipe(gulp.dest('dist/template'));
  return stream;
});

// gulp.task("copyJs",function(){
//   var stream = gulp.src("src/**/*.js")
//   // .pipe(uglify())
//   .pipe(gulp.dest("dist"));
//   return stream;
// });

gulp.task("coffee",function(){
  var stream = gulp.src("src/**/*.coffee")
  .pipe(coffee())
  // .pipe(uglify())
  .pipe(gulp.dest('dist'));
  return stream;
});

gulp.task("coffee:w", ["coffee"], function () {
    watch = gulp.watch("src/**/*.coffee");
    watch.on("change",function(event){
      file = event.path
      dirname = path.dirname(file);
      dirname = dirname.replace(__dirname,"").replace("/src","dist")
      gulp.src(event.path)
      .pipe(coffee())
      .pipe(gulp.dest(dirname));
    });
});

gulp.task("start",function () {
  nodemon({
    script: 'dist/bin/www',
    ext: 'js json',
    ignore:[
      "src/public"
    ],
    "events": {
      "restart": "echo 'display notification \"App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'"
    },
    env: { 'NODE_ENV': 'dev' }
  });
});

gulp.task("static",["copyPublic","copyAsst","copyIndex","copyViews"],function(){
  gulp.start("delIndex");
});

gulp.task("release",["clean"],function(){
  gulp.start(["copyBin","copyConfig","static","copyTemplate","coffee"]);
});

gulp.task("dev",["copyBin","copyConfig","static","copyTemplate","coffee","coffee:w"],function(){
  gulp.start("start");
});
