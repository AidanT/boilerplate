import del from 'del'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import {
  spawn
} from 'child_process'

let node
const plugins = gulpLoadPlugins()
const files = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**'],
  other: [
    './**/*.{png,jpg,html,json}',
    '!dist/**',
    '!node_modules/**',
    '!package.json',
    '!package-lock.json'
  ]
}

gulp.task('copy', () =>
  gulp
    .src(files.other)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
)

gulp.task('babel', () =>
  gulp
    .src([...files.js, '!gulpfile.babel.js'], {
      base: 'src'
    })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
)

gulp.task('run', () => {
  if (node) node.kill()
  node = spawn('node', ['dist'], {
    stdio: 'inherit'
  })
  node.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected, waiting for changes...')
    }
  })
  return node
})

gulp.task('clean', () => del(['dist/**', '!dist']))
gulp.task('build:files', gulp.parallel('copy', 'babel'))
gulp.task('watch', () => {
  const watcher = gulp.watch(
    ['src'], {
      delay: 400
    },
    gulp.series('build:files', 'run')
  )
  watcher.on('change', () => {
    if (node) node.kill()
  })
  return watcher
})
gulp.task(
  'start',
  gulp.series('clean', 'build:files', gulp.parallel('watch', 'run'))
)
gulp.task('build', gulp.series('clean', 'build:files'))

process.on('exit', () => (node ? node.kill() : null))
