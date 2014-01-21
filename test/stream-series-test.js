var expect = require('expect.js'),
    Stream = require('stream').Stream,
    series = require('../'),
    es = require('event-stream');

describe('stream-waterfall', function() {
  it('waits for one stream to end before calling the next', function(done) {
    var firstStream = es.through(function(data) {
      this.emit('data', data);
    });

    var secondStream = es.through(function(data) {
      this.emit('data', data);
    });

    var thirdStream = es.through(function(data) {
      this.emit('data', data);
    });


    var writer = es.writeArray(function(err, array) {
      expect(array).to.be.eql([1, 3, 2]);
      done();
    });

    series(firstStream, thirdStream, secondStream).pipe(writer);
    firstStream.end(1);
    secondStream.end(2);
    thirdStream.end(3);
  });
});
