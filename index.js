var Stream = require('stream').Stream;

module.exports = function() {
  var streams = Array.prototype.slice.call(arguments),
      pending = streams.length;

  var stream = new Stream();
  stream.writable = stream.readable = true;

  var buffers = new Array(pending),
      ended = new Array(pending);


  streams.forEach(function(e, i) {
    buffers[i] = [];
    e.on('data', function(data) {
      buffers[i].push(data);
    });

    e.on('end', function() {
      ended[i] = true;
    });
  });

  var i = 0;
  function next() {
    var e = streams[i],
        buffer = buffers[i],
        finished = ended[i];

    buffer.forEach(function(data) {
      stream.emit('data', data);
    });

    if(!finished) {
      e.pipe(stream, {end: false});
      e.on('end', finish);
    } else {
      finish();
    }
    function finish() {
      if(!--pending) return stream.emit('end');
      ++i;
      next();
    }
  }

  stream.write = function(data) {
    this.emit('data', data);
  };

  stream.destroy = function() {
    streams.forEach(function(e) { if(e.destroy) e.destroy(); });
  };

  next();

  return stream;
};
