var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var watch = require('gulp-watch');
 


gulp.task('less', function () {
  return gulp.src('./assets/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./static/css'));
});


gulp.task('stream', function () {
    return watch('./assets/less/*.less', ['less']);
});

gulp.watch('assets/less/*.less', function(event) {  
    gulp.run('less');
});

gulp.task('default', ['less']);