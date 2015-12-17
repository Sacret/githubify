react-bootstrap-async-autocomplete
==================================

An autocomplete input for react-bootstrap using an async datasource

Live demo: http://cdn.rawgit.com/nnarhinen/react-bootstrap-async-autocomplete/master/example/index.html

Source of demo: [example.js](example/example.js)

Installation
------------

`npm install react-bootstrap-async-autocomplete`

Usage
-----

```js
var AutocompleteInput = require('react-bootstrap-async-autocomplete');
    React = require('react');

var searchRequested = function(key, cb) {
  setTimeout(function() { //Emulate async
    var results = [];
    for (var i = 0; i < 10; i++) {
      results.push(key + i);
    }
    cb(results);
  }, 1000);
};

var itemSelected = function(itm) {
  alert(itm + ' selected');
};

//AutocompleteInput accepts all same props that react-bootstrap/Input
React.renderComponent(<AutoCompleteInput label="Some label" placeholder="Start typing.." onSearch={searchRequested} onItemSelect={itemSelected} />, document.body);
```

Author
------

Niklas Närhinen <niklas@narhinen.net>

License
-------

The MIT license
