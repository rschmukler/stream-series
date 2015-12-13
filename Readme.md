# stream-series

Emits events from streams in series.

## Example

```js
var series = require('stream-series');
var orderedStream = series(streamA, streamC, streamB);

streamC.end('c');
streamB.end('b');
streamA.end('a');

var writer = es.writeArray(function(err, array) {
  // Array will be ['a', 'c', 'b'] even though streams sent data in reverse order;
});

orderedStream.pipe(writer);
```
