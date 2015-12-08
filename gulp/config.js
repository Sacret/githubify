var build = './build';

var locations = {
  js: './js',
  less: './less',
  images: './img'
}

module.exports = {
  locations: locations,
  browserify: {
    files: [
      locations.js + '/routers/Router.js'
    ],
    dest: build,
    name: 'app.js'
  },
  css: {
    files: [
      build + '/css/app.css'
    ],
    name: 'app.css',
    dest: build + '/css/'
  },
  less: {
    src: locations.less + '/app.less',
    watch: locations.less + '/**',
    dest: build + '/css/'
  },
  fonts: {
    src: [
      //src + '/fonts/**',
      './node_modules/bootstrap/fonts/**',
      './node_modules/font-awesome/fonts/**'
    ],
    dest: build + '/fonts/'
  },
  images: {
    src: [
      locations.images + '/**'
    ],
    dest: build + '/img'
  }
};
