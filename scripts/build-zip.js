'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const zip = require('zip-folder');
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Generate configuration
const config = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build();
  });

// Create the production build and print the deployment instructions.
const numToNumPlus0 = n => n < 10 ? '0' + n : n;
const confBackground = require(path.resolve(__dirname + './../webpack.background.config.js'));
function build() {
  console.log('Creating an optimized production build...');

  delete config.watch;
  delete confBackground.watch;

  webpack([config, confBackground], (err, stats) => {
    console.clear();
    if (err) {
      console.log(err);
      return;
    }
    const messages = stats.toJson({ all: false, warnings: true, errors: true });

    messages.errors.forEach(err => {
      err.file && console.log(path.resolve(err.file));
      console.log(chalk.red(err.message));
    });

    messages.warnings.forEach(warning => {
      const w = warning.message.split('\n')
      w[1] && console.log(path.resolve(w[1] + ':0:0'));
      console.log(chalk.red(w[2]));
    });

    if (messages.errors.length === 0 && messages.warnings.length === 0) {
      const date = new Date();
      console.log(date.toLocaleDateString(), numToNumPlus0(date.getHours()) + ':' + numToNumPlus0(date.getMinutes()) +
        ':' + numToNumPlus0(date.getSeconds()), chalk.green('Compiled successfully'));
      zip(path.resolve('./build'), path.resolve('./build.zip'), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
