const path = require('path');
const funnel = require('broccoli-funnel');
const concat = require('broccoli-concat');
const mergeTrees = require('broccoli-merge-trees');
const esTranspiler = require('broccoli-babel-transpiler');
const testem = require('broccoli-testem-plugin');
const pkg = require('./package.json');
const env = process.env.NODE_ENV;

const src = 'src';

const indexHtml = funnel(src, {
  files: ['index.html']
});

const vendorEs = funnel('node_modules/htmlbars/dist/es6/', {
  include: ['**/*.js'],
  destDir: '/'
});

const vendorJs = esTranspiler(vendorEs, {
  stage: 0,
  moduleIds: true,
  modules: 'amd',
  sourceMaps: true
});

const js = esTranspiler(mergeTrees([vendorEs, src]), {
  stage: 0,
  moduleIds: true,
  modules: 'amd',
  sourceMaps: true,

  // Transforms /index.js files to use their containing directory name
  getModuleId: function (name) {
    return name.replace(/\/index$/, '');
  },

  // Fix relative imports inside /index's
  resolveModuleSource: function (importSource, filename) {
    var match = filename.match(/(.+)\/index\.\S+$/i);

    // is this an import inside an /index file?
    if (match) {
      var path = match[1];
      return importSource
        .replace(/^\.\//, path + '/')
        .replace(/^\.\.\//, '');
    } else {
      return importSource;
    }
  }
});

const main = concat(js, {
  inputFiles: [
    '**/*.js'
  ],
  outputFile: '/lib.js'
});

const vendor = concat('node_modules/', {
  inputFiles: [
    'babel/node_modules/babel-core/browser-polyfill.js',
    'zone.js/dist/zone-microtask.js',
    'zone.js/dist/long-stack-trace-zone.js',
    'htmlbars/dist/assets/loader.js'
  ],
  outputFile: '/vendor.js'
});

const bundle = concat(mergeTrees([vendor, main]), {
  inputFiles: [
    'vendor.js',
    '**/*.js',
  ],
  outputFile: '/' + pkg.name + '.js'
});

if (env === 'test') {
  const testIndex = funnel('test', {
    include: ['index.mustache']
  });

  const testVendor = funnel('node_modules', {
    include: ['sinon/pkg/sinon.js']
  });

  var test = funnel('test', {
    include: ['**/*.js']
  });

  test = esTranspiler(test, {
    stage: 0,
    moduleIds: true,
    modules: 'amd',
    sourceMaps: true,
  });

  test = mergeTrees([bundle, testVendor, test, testIndex]);

  test = testem(test, {
    ci: process.env.CI === 'true',
    'framework': 'mocha+chai',
    'test_page': 'index.mustache',
    'disable_watching': true,
    'src_files': [
      '**/*.js',
    ],
    'launch_in_ci': [
      'PhantomJS'
    ],
    'launch_in_dev': [
      'PhantomJS',
      'Chrome'
    ]
  });

  module.exports = test;
} else {
  module.exports = mergeTrees([bundle, indexHtml]);
}
