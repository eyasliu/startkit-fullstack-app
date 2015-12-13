import gulp from 'gulp';
import util from 'gulp-util';
import childProcess from 'child_process';
import del from 'del';
import webpack from 'webpack';
import gulpWebpack from 'gulp-webpack';
// import eslint from 'gulp-eslint';
// import plumber from 'gulp-plumber';
import notifier from 'node-notifier';
import path from 'path';
import run from 'run-sequence';
import colors from 'colors';
import config from './config/config';
import WebpackDevServer from 'webpack-dev-server';
import clientDev from './config/webpack.client.dev.js';
import clientPro from './config/webpack.client.pro.js';

const $ = require('gulp-load-plugins')();

// dev server
gulp.task('clientDev', ()=>{
  const compiler = webpack(clientDev);

  compiler.plugin('done', (stats) => {
    run('lint');
  });
  compiler.plugin('failed', (err) => {
    console.log(err.red);
  });

  new WebpackDevServer( compiler, {
    contentBase: './',
    publicPath: clientDev.output.publicPath,
    hot: true,
    quiet: false,
    historyApiFallback: true,
    noInfo: false,
    inline: true,
    stats: {
      colors: true,
      chunks: false
    }
  }).listen(config.clientPort, config.host, (err, stats)=>{
    if (err) util.log(err);
    util.log(`webpack was listenning: http://${config.host}:${config.clientPort}`.green);
  });
});

gulp.task('lint', () => {
  return gulp.src(['./*.js', 'app/client/**/*.js', 'app/client/**/*.jsx', 'app/server/**/*.js'])
    .pipe($.eslint({
      globals: {
        'React': true,
        '$': true,
        'jQuery': true,
        'ReactDOM': true,
        'cx': true,
        'config': true
      }
    }))
    .pipe($.plumber({
      errorHandler(err) {
        const { fileName, lineNumber, message } = err;
        const relativeFilename = path.relative(process.cwd(), fileName);
        notifier.notify({
          title: 'ESLint Error',
          wait: true,
          message: `Line ${lineNumber}: ${message} (${relativeFilename})`
        }, (error, msg) => {
          if (msg.startsWith('Activate')) {
            childProcess.exec(`subl --command open_file ${fileName}:${lineNumber}`);
          }
        });
      }
    }))
    .pipe($.eslint.failOnError())
    .pipe($.eslint.formatEach());
});

// build
gulp.task('build', ['clean'], ()=>{
  gulp.src('src/app.js')
    .pipe(gulpWebpack(clientPro))
    .pipe(gulp.dest('./build'));
});

// build on save
gulp.task('clean', () => {
  del('build');
});
