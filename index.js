var chokidar = require('chokidar');
const path = require('path');
var fs = require('fs');

var watcher = chokidar.watch( __dirname , {ignored: /^\./,
   persistent: true ,
   awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },
});

/*
fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js') return;


  module.exports[file.replace('.js','')] = require( './' + file);
});

fs.watch(__dirname, (eventType, filename) => {
console.log(eventType);
console.log(filename);
}) */
watcher
  .on('add', function(uri)    {
    var file = path.basename(uri, '.js') ;
    if ( path.extname(uri) == '.js' && file != 'index' ) {
    module.exports[file] = require( './' + file, true );
    console.log('Module', file , 'has been added'); }
  })
  .on('change',  function(uri,stat) {
    var file = path.basename(uri, '.js') ;
    if (module.exports[file]) {
    delete require.cache[uri]
    delete module.exports[file] ;
    module.exports[file] = require('./' + file, true );
    console.log('Module', file , 'has been changed');}
  })
  .on('unlink', function(uri) {
    var file = path.basename(uri, '.js') ;
    if (module.exports[file]) {
    delete module.exports[file] ;
    console.log('Module', file , 'has been removed');}
  })
  .on('error', function(error) {console.error('Error happened', error);})
