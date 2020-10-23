let log = console.log.bind(console);
let err = console.error.bind(console);

let version = '1';
let cacheName = 'pwa-client-v' + version;
let dataCacheName = 'pwa-client-data-v' + version;
let appShellFilesToCache = [
  './',
  './index.html',
  // "./inline.bundle.js",
  // "./polyfills.bundle.js",
  // "./styles.bundle.js",
  // "./vendor.bundle.js",
  // "./main.bundle.js",
  './manifest.json',
];

