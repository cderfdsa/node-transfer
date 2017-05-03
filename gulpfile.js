var gulp = require("gulp");
var coffee = require("gulp-coffee");
var nodemon = require("gulp-nodemon");
var clean = require('gulp-clean');
var path = require("path");
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

// 清空 dist
gulp.task("clean",function(){
	var stream = gulp.src("dist")
	.pipe(clean());
	return stream;
});

// copy
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
gulp.task("copyAsst",function(){
	var stream = gulp.src("src/asst/**/*")
	.pipe(gulp.dest('dist/asst'));
	return stream;
});
gulp.task("copyViews",function(){
	var stream = gulp.src("src/views/**/*")
	.pipe(gulp.dest('dist/views'));
	return stream;
});

// 前端代码处理
gulp.task("copyPublic",function(){
	var stream = gulp.src("src/public/**/*")
	.pipe(gulp.dest('dist/public'));
	return stream;
});
gulp.task("delIndex",function(){
	var stream = gulp.src("dist/public/index.html")
	.pipe(clean());
	return stream;
});
gulp.task("copyIndex",function(){
	var stream = gulp.src("src/public/index.html")
	.pipe(rename("index.ejs"))
	.pipe(gulp.dest('dist/views'))
	return stream;
});

// coffee to js
gulp.task("coffee",function(){
	var stream = gulp.src("src/**/*.coffee")
	.pipe(coffee())
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
	return stream;
});

// watch coffee change
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

// 起服务
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

// 前端处理集合任务
gulp.task("static",["copyPublic","copyAsst","copyIndex","copyViews"],function(){
	gulp.start("delIndex");
});
// 产出
gulp.task("release",["clean"],function(){
	gulp.start(["copyBin","copyConfig","static","coffee"]);
});
// 开发
gulp.task("dev",["copyBin","copyConfig","static","coffee:w"],function(){
	gulp.start("start");
});
